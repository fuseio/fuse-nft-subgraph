import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Account } from "../generated/schema";

export const ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export let IPFS_SCHEME = "ipfs://";

export let HTTP_SCHEME = "https://";

export let DATA_SCHEME = "data:";

export let BASE_IPFS_URL = "https://ipfs.io/ipfs/";

//export let BASE_IPFS_URL = 'https://gateway.pinata.cloud/ipfs/'

export let DWEB_IPFS_URL = "https://dweb.link/ipfs/";

export let COZY_ASSET_URL =
  "https://bafybeid64tyd25ovegjakaq6qyjyo332qzeqj3md6lygqgjg6aj5u5gybi.ipfs.dweb.link/";

export let COZY_ADDRESS = Address.fromString(
  "0x32319834d90323127988E4e2DC7b2162d4262904"
);

export function getURIScheme(input: string): string {
  return input.split(":")[0];
}

export function getIpfsPath(ipfsURI: string): string {
  return ipfsURI.split("ipfs://")[1];
}

export function getIpfsURL(ipfsURI: string): string {
  return BASE_IPFS_URL + getIpfsPath(ipfsURI);
}

// export function toBytes(hexString: String): Bytes {
//   let result = new Uint8Array(hexString.length / 2);
//   for (let i = 0; i < hexString.length; i += 2) {
//       //@ts-ignore
//     result[i / 2] = parseInt(hexString.substr(i, 2), 16) as u32;
//   }
//   return result as Bytes;
// }

export function getOrCreateAccount(
  address: Address,
  persist: boolean = true
): Account {
  let accountAddress = address.toHexString();
  let account = Account.load(accountAddress);

   
  if (account == null) {
    account = new Account(accountAddress);
    account.address = address;

    if (persist) {
      account.save();
    }
  }

  return account as Account;
}

export function getDwebURL(ipfsURI: string): string {
  let ipfsURL = DWEB_IPFS_URL + getIpfsPath(ipfsURI);
  return ipfsURL;
}
