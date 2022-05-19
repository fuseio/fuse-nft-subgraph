import { BigInt} from '@graphprotocol/graph-ts'
import { Address } from "@graphprotocol/graph-ts";

export let IPFS_SCHEME = 'ipfs://'

export let HTTP_SCHEME = 'https://'

// 'https://ipfs.io/ipfs/'
export let BASE_IPFS_URL = 'https://gateway.pinata.cloud/ipfs/'

export let DWEB_IPFS_URL = 'https://dweb.link/ipfs/'

export let COZY_ASSET_URL = 'https://bafybeid64tyd25ovegjakaq6qyjyo332qzeqj3md6lygqgjg6aj5u5gybi.ipfs.dweb.link/'

export function getURIScheme (input: string): string {
    return input.split(':')[0]
}

export function getIpfsPath (ipfsURI: string): string {
    return ipfsURI.split('ipfs://')[1]
}

export function getIpfsURL(ipfsURI: string): string {
    let ipfsURL = BASE_IPFS_URL + getIpfsPath(ipfsURI) 
    return ipfsURL
}

export function getDwebURL(ipfsURI: string): string {
    let ipfsURL = DWEB_IPFS_URL + getIpfsPath(ipfsURI)
    return ipfsURL
}

export let COZY_ADDRESS = Address.fromString(
    "0x32319834d90323127988E4e2DC7b2162d4262904"
  );

export let ZERO_ADDRESS_STRING = '0x0000000000000000000000000000000000000000';