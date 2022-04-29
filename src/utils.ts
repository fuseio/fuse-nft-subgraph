import { Address } from "@graphprotocol/graph-ts"
import { Account } from "../generated/schema";
import { encode, decode } from "as-base64";

export const ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export let IPFS_SCHEME = "ipfs://";

export let HTTP_SCHEME = "https://";

export let DATA_SCHEME = "data:application/json;base64,";

export let BASE_IPFS_URL = "https://ipfs.io/ipfs/";

export let BASE_IPINATA_URL = 'https://gateway.pinata.cloud/ipfs/'

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
  let hash = ipfsURI.split("ipfs://")[1]
  if(hash.includes("/"))
  {
    return ipfsURI.split("/")[0]
  }
  return ipfsURI.split("ipfs://")[1];
}

export function getBase64(data: string): string {
    return data.split(",")[1];
  }

export function getIpfsURL(ipfsURI: string): string {
  return BASE_IPFS_URL + getIpfsPath(ipfsURI);
}

// export function toBytes(hexString: String): Bytes {
//   let result = new Uint8Array(hexString.length);
//   for (let i = 0; i < hexString.length; i += 2) {

//     result[i] = parseInt(hexString.substr(i, 2), 64);
//   }
//   return result as Bytes;
// }

// function _base64ToArrayBuffer(base64 : string) {
//     var binary_string = decode(base64);
//     var len = binary_string.length;
//     var bytes = new Uint8Array(len);
//     for (var i = 0; i < len; i++) {
//         bytes[i] = parseInt(binary_string.substr(i, 2), 64);
//     }
//     return bytes.buffer;
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

//@ts-ignore
function d2b(dec:i32,length:i32):String{
  let out = "";
  while(length--)
    out += ((dec >> length ) & 1).toString();    
  return out.toString();
}
//@ts-ignore
export function base64TableValBin(code:i32, dec:boolean = false): String {
  if(code >= 65 && code <= 90) return d2b(code - 65,8)
  if(code >= 97 && code <= 122) return d2b(code - 71,8)
  if(code >= 48 && code <= 57) return d2b(code + 4,8)
  if(code >= 43 && code <= 44) return d2b(code + 19,8)
  // problematic character
  return "-1" as String
}

export function _toBytes(hexString: String): String {
  let result = "";
  let binString = ""
  for(let i = 0; i < hexString.length; i++) {
  	let tableCode = base64TableValBin(hexString.charCodeAt(i))
  	if (tableCode == "-1") continue;
  	let tableCodeTrim = tableCode.slice(2)
  	binString += tableCodeTrim
  	while(binString.length >= 8) {
  		let substr = binString.substring(0,8)
  		binString = binString.slice(8)
      //@ts-ignore
  		let ord = I8.parseInt(substr,2)
  		result += String.fromCharCode(ord)
  	}
  }
  return result as String
}