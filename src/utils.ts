export let IPFS_SCHEME = 'ipfs://'

export let HTTP_SCHEME = 'https://'

export let BASE_IPFS_URL = 'https://ipfs.io/ipfs/'

export let COZY_ASSET_URL = 'https://bafybeid64tyd25ovegjakaq6qyjyo332qzeqj3md6lygqgjg6aj5u5gybi.ipfs.dweb.link/'

export function getURIScheme (input: string): string {
    return input.split(':')[0]
}

export function getIpfsPath (ipfsURI: string): string {
    return ipfsURI.split('ipfs://')[1]
}

export function getIpfsURL (ipfsURI: string): string {
    return BASE_IPFS_URL + getIpfsPath(ipfsURI)
}

export const CozyCosmonautsAddress = "0x32319834d90323127988E4e2DC7b2162d4262904"
export function getCozyImage(cozyID: string): string {
    return COZY_ASSET_URL + cozyID + '.png'
}

