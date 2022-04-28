import { ipfs, json, JSONValue, log, TypedMap } from '@graphprotocol/graph-ts'
import { Transfer, Erc721 } from '../generated/Erc721/Erc721'
import { Collection, Account, Collectible } from '../generated/schema'
import { ADDRESS_ZERO, BASE_IPFS_URL, getIpfsURL, getOrCreateAccount, HTTP_SCHEME, IPFS_SCHEME } from './utils'

export function handleTransfer(event: Transfer): void {
  log.info('Parsing Transfer for txHash {}', [event.transaction.hash.toHexString()])

  let collection = Collection.load(event.address.toHex());
  if(collection != null) {

  let account = getOrCreateAccount(event.params.to);
  //let from = getOrCreateAccount(event.params.from);
  let tokenId = event.params.tokenId.toHexString();

  if (event.params.from.toHexString() == ADDRESS_ZERO.toHexString()) {
    // Mint token
    let item = new Collectible(tokenId);

    item.creator = account.id;
    item.owner = item.creator;
    item.tokenId = event.params.tokenId;
    item.collection = collection.id;
    item.descriptorUri = Erc721.bind(event.address).tokenURI(
      event.params.tokenId
    );
    item.created = event.block.timestamp;
    item.save()
    
    log.info('MINT  - tokenid: {}, txHash: {}', [tokenId, event.transaction.hash.toHexString()])
  } else {
    let item = Collectible.load(tokenId);

    if (item != null) {
      if (event.params.to.toHexString() == ADDRESS_ZERO.toHexString()) {
        // Burn token
        item.removed = event.block.timestamp;
        log.info('BURN - tokenid: {}, txHash: {}', [tokenId, event.transaction.hash.toHexString()])
      } else {
        // Transfer token
        item.owner = account.id;
        item.modified = event.block.timestamp;
     
        log.info('TRANSFER - tokenid: {}, txHash: {}', [tokenId, event.transaction.hash.toHexString()])
      }

      item.save();
    } else {
      log.warning("Collectible #{} not exists", [tokenId]);
    }
  }
}
}
