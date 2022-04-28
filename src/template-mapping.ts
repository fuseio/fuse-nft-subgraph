import { Transfer } from '../generated/Erc721/Erc721'
import { Collection } from '../generated/schema'
import { ERC721 } from "../generated/templates";

export function handleTransfer(event: Transfer): void {
  let collectionAddress = event.address.toHex();
  let collection = Collection.load(collectionAddress);

  if (collection == null) {
    collection = new Collection(event.address.toHex());
  }
  
  collection.collectionAddress = event.address;
  collection.save();

  ERC721.create(event.address);
}
