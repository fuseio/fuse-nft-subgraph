import {
  Address,
  ipfs,
  json,
  Bytes,
  JSONValue,
  JSONValueKind,
  log,
  TypedMap,
} from "@graphprotocol/graph-ts";
import { Transfer, Erc721 } from "../generated/Erc721/Erc721";
import { Collection, Account, Collectible } from "../generated/schema";
import {
  ADDRESS_ZERO,
  BASE_IPFS_URL,
  COZY_ADDRESS,
  DATA_SCHEME,
  getBase64,
  getDwebURL,
  getIpfsURL,
  getOrCreateAccount,
  HTTP_SCHEME,
  IPFS_SCHEME,
} from "./utils";

export function handleTransfer(event: Transfer): void {
  log.info("Parsing Transfer for txHash {}", [
    event.transaction.hash.toHexString(),
  ]);

  let collection = Collection.load(event.address.toHex());
  if (collection != null) {
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
      item.save();
      item = readMetadata(item, item.descriptorUri, event.address);
      log.info("MINT  - tokenid: {}, txHash: {}", [
        tokenId,
        event.transaction.hash.toHexString(),
      ]);
    } else {
      let item = Collectible.load(tokenId);

      if (item != null) {
        if (event.params.to.toHexString() == ADDRESS_ZERO.toHexString()) {
          // Burn token
          item.removed = event.block.timestamp;
          log.info("BURN - tokenid: {}, txHash: {}", [
            tokenId,
            event.transaction.hash.toHexString(),
          ]);
        } else {
          // Transfer token
          item.owner = account.id;
          item.modified = event.block.timestamp;

          log.info("TRANSFER - tokenid: {}, txHash: {}", [
            tokenId,
            event.transaction.hash.toHexString(),
          ]);
        }

        item.save();
      } else {
        log.warning("Collectible #{} not exists", [tokenId]);
      }
    }
  }
}

function readMetadata(
  collectible: Collectible,
  tokenURI: string,
  erc721Address: Address
): Collectible {
  

  let contentPath: string;
  if (tokenURI.startsWith(HTTP_SCHEME)) {
    contentPath = tokenURI.split(BASE_IPFS_URL).join("");
  } else if (tokenURI.startsWith(IPFS_SCHEME)) {
    contentPath = tokenURI.split(IPFS_SCHEME).join("");
  } else if (tokenURI.startsWith(DATA_SCHEME)) {
    log.warning("TRYING BASE64 for #{} is not working", [tokenURI]);
    let jsonResult = json.try_fromString(getBase64(tokenURI));

    if (jsonResult.isError) {
      log.warning("FAILED BASE64 for #{} is not working", [tokenURI]);
      return collectible;
    }
    log.warning("SUCCEEDED BASE64 for #{} is not working", [
      jsonResult.value.toString(),
    ]);

    let value = jsonResult.value;
    if (value.kind == JSONValueKind.OBJECT) {
      let data = value.toObject();
      if (data != null) {
        let name = data.get("name");
        if (name != null) {
          collectible.name = name.toString();
        } else {
          return collectible;
        }

        let description = data.get("description");
        if (description != null) {
          collectible.description = description.toString();
        } else {
          return collectible;
        }

        let image = data.get("image");
        if (image != null) {
          let imageStr = image.toString();
          if (imageStr.includes(IPFS_SCHEME)) {
            if (erc721Address == COZY_ADDRESS) {
              imageStr = getDwebURL(imageStr);
            }
            imageStr = getIpfsURL(imageStr);
          }
          collectible.imageURL = imageStr;
        } else {
          return collectible;
        }
      }
    }
    return collectible;
  } else {
    log.warning("URI for #{} is not working", [tokenURI]);
    return collectible;
  }

  let ipfsData = ipfs.cat(contentPath);
  if (!ipfsData) return collectible;

  let jsonResult = json.try_fromBytes(ipfsData);
  if (jsonResult.isError) return collectible;

  let value = jsonResult.value;
  if (value.kind == JSONValueKind.OBJECT) {
    let data = value.toObject();
    if (data != null) {
      let name = data.get("name");
      if (name != null) {
        collectible.name = name.toString();
      } else {
        return collectible;
      }

      let description = data.get("description");
      if (description != null) {
        collectible.description = description.toString();
      } else {
        return collectible;
      }

      let image = data.get("image");
      if (image != null) {
        let imageStr = image.toString();
        if (imageStr.includes(IPFS_SCHEME)) {
          if (erc721Address == COZY_ADDRESS) {
            imageStr = getDwebURL(imageStr);
          }
          imageStr = getIpfsURL(imageStr);
        }
        collectible.imageURL = imageStr;
      } else {
        return collectible;
      }
    }
  }

  collectible.save();
  return collectible;
}
