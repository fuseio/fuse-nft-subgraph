import { ipfs, json, JSONValue, JSONValueKind, log, TypedMap } from '@graphprotocol/graph-ts'
import { Transfer, Erc721 } from '../generated/Collectible/Erc721'
import { Collectible, User } from '../generated/schema'
import { BASE_IPFS_URL, getIpfsURL, HTTP_SCHEME, IPFS_SCHEME } from './utils'

export function handleTransfer(event: Transfer): void {
  log.info('Parsing Transfer for txHash {}', [event.transaction.hash.toHexString()])

  let id = event.address.toHexString() + '-' + event.params.tokenId.toString()

  let collectible = Collectible.load(id)
  if (!collectible) {
    collectible = new Collectible(id)
  }

  let erc721Token = Erc721.bind(event.address)
  let tokenURIResult = erc721Token.try_tokenURI(event.params.tokenId)
  if (tokenURIResult.reverted) {
    return
  }
  
  let tokenURI = tokenURIResult.value
  
  let contentPath: string
  if (tokenURI.startsWith(HTTP_SCHEME)) {
    contentPath = tokenURI.split(BASE_IPFS_URL).join('')
  } else if (tokenURI.startsWith(IPFS_SCHEME)) {
    contentPath = tokenURI.split(IPFS_SCHEME).join('')
  } else {
    return
  }

  let data = ipfs.cat(contentPath)
  if (data) {
    let jsonResult = json.try_fromBytes(data!)
    if (jsonResult.isError) return
  
    let value = jsonResult.value.toObject()
    if (data != null) {
      let name = value.get('name')
      if (name != null && name.kind == JSONValueKind.STRING) {
        collectible.name = name.toString()
      } else {
        return
      }
  
      let description = value.get('description')
      if (description != null && description.kind == JSONValueKind.STRING) {
        collectible.description = description.toString()
      } else {
        return
      }
  
      let image = value.get('image')
      if (image != null && image.kind == JSONValueKind.STRING) {
        let imageStr = image.toString()
        if (imageStr.includes(IPFS_SCHEME)) {
          imageStr = getIpfsURL(imageStr)
        }
        collectible.imageURL = imageStr
      } else {
        return
      }
    }
  
    let name = erc721Token.try_name()
    if (!name.reverted) {
      collectible.collectionName = name.value
    }
  
    let symbol = erc721Token.try_symbol()
    if (!symbol.reverted) {
      collectible.collectionSymbol = symbol.value
    }
  } else {
    if (event.address.toHexString() == '0x3f82395600296eef2e7022673bce036d3b040cf6') {
      collectible.name = 'FreedomCup'
      collectible.description = 'Celebrate the World Cup 2022 with Freedom Community by joining our Freedom Cup Campaign. Guess the result, get the NFT, and recieve rewards from the prize pool!'
      collectible.collectionName = 'FreedomCup'
      collectible.collectionSymbol = 'FDCUP'
      collectible.imageURL = 'https://assets.bitazza.com/images/freedom-cup.png'
    } else {
      return 
    }
  }

  collectible.owner = event.params.to.toHexString()
  collectible.collectionAddress = event.address
  collectible.save()

  let user = User.load(event.params.to.toHexString())
  if (!user) {
    user = new User(event.params.to.toHexString())
    user.save()
  }
}
