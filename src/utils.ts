import { Address } from "@graphprotocol/graph-ts"
import { Account } from "../generated/schema"

export const ADDRESS_ZERO = Address.fromString("0x0000000000000000000000000000000000000000");

export let IPFS_SCHEME = 'ipfs://'

export let HTTP_SCHEME = 'https://'

export let BASE_IPFS_URL = 'https://ipfs.io/ipfs/'

export function getURIScheme (input: string): string {
    return input.split(':')[0]
}

export function getIpfsPath (ipfsURI: string): string {
    return ipfsURI.split('ipfs://')[1]
}

export function getIpfsURL (ipfsURI: string): string {
    return BASE_IPFS_URL + getIpfsPath(ipfsURI)
}


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
