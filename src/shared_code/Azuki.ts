import { EthereumAddress } from "./Ethereum"


export namespace Azuki {
    export type AzukiModel = {
        id: number
        imageURL: string
    }

    export async function ownsAnyAzuki(address: EthereumAddress): Promise<boolean> {
        let page = 0
        let nCollectionsInLastCall = 0
        do {
            let res = await fetch("https://api.opensea.io/api/v1/collections?limit=300&offset=" + page * 300 + "&asset_owner=" + address, {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
                    "Accept": 'application/json',
                }
            })
            let rawData = await res.json()
            rawData.forEach((d: any) => { if (d.slug == "azuki") return true })
            nCollectionsInLastCall = rawData.length
            page++
        } while (nCollectionsInLastCall == 300)
        return false
    }

    export async function getRandomAzukis(count: number = 32): Promise<Array<AzukiModel>> {
        let ids: Array<number> = []
        do {
            let randId = Math.floor(Math.random() * 10000)
            if (!ids.includes(randId)) ids.push(randId)
        } while (ids.length != 32)
        return ids.map((id) => {
            return {
                id: id,
                imageURL: "https://rarible.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/" + id.toString() + ".png"
            }
        })
    }
}