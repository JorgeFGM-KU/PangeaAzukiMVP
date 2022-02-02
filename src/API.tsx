export namespace API {
    const baseUrl = "https://api.opensea.io/api/v1"
    const headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
        "Accept": 'application/json',
        // "Access-Control-Allow-Origin" : "http://localhost:3000"
    } // Seems necessary for the API to not return a 403 error!

    export async function getSlugOfCollectionsOwnedBy(walletAddress: string): Promise<Array<string>> {
        let collectionsSlugs: Array<string> = []

        let page = 0
        let nCollectionsInLastCall = 0
        do {
            let res = await fetch(baseUrl + "/collections?limit=300&offset=" + page*300 + "&asset_owner=" + walletAddress, {
                method: "GET",
                headers: headers
            })
            let rawData = await res.json()
            collectionsSlugs.push(rawData.map((collectionData: any) => collectionData.slug))
            nCollectionsInLastCall = rawData.length
            page++
        } while (nCollectionsInLastCall == 300)

        return collectionsSlugs
    }

    export async function getAssetsFromCollection(slug: string): Promise<Array<{ name: string, id: string, imageURL: string }>> {
        let assets: Array<{ name: string, id: string, imageURL: string }> = []
        
        let page = 0
        let nAssetrsRetrievedInLastCall = 0
        do {
            let res = await fetch(baseUrl + "/assets?order_direction=desc&offset=" + page*50 + "&limit=50&collection=" + slug, {
                method: "GET",
                headers: headers
            })
            let rawData = await res.json()
            assets.push(rawData.map((asset: any) => {
                return {
                    name: asset.name,
                    id: asset.token_id,
                    imageURL: asset.image_url
                }
            }))
            nAssetrsRetrievedInLastCall = rawData.length
            page++
        } while (nAssetrsRetrievedInLastCall == 50)
        return assets
    }

    export async function get32RandomAzukis(): Promise<Array<{ id: number, imageURL: string }>>{
        let ids: Array<number> = []
        for (let i = 0; i < 32; i++) ids.push(Math.floor(Math.random() * 10000))
        
        let azukis: Array<{ id: number, imageURL: string }> = []
        for (let id of ids) {
            azukis.push({
                id: id,
                imageURL: "https://rarible.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/" + id.toString() + ".png"
            })
        }
        return azukis
    }
}