import detectEthereumProvider from "@metamask/detect-provider"
import { EthereumAddress } from "./Ethereum"

export namespace MetaMask {

    export enum State {
        Initial,
        NotInstalled,
        Installed,
        Connected
    }

    export async function getProviderIfInstalled(): Promise<any> {
        let provider = await detectEthereumProvider({ mustBeMetaMask: true })
        if (provider) return provider
        throw "MetaMask not installed"
    }

    export async function connectAndGetAddress(provider: any): Promise<EthereumAddress | null> {
        let addresses: Array<EthereumAddress> = await provider.request({ method: 'eth_requestAccounts' })
        if (addresses.length > 0) return addresses[0] // MetaMask docs say to return the first element always as for now...
        throw "Couldn't retrieve address"
    }
}