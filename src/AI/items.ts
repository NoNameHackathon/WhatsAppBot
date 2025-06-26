export type Item = {
    productName: string;
    productPrice?: number;
    productURL?: string;
}
    /**
     * This function will return a list of products from Loblaws that are related to the required item.
     * @param requiredItem - The item that the user is looking for.
     * @returns A list of products from Loblaws that are related to the required item.
     * @if the item is not found, return an empty list.
     */
async function getLoblawsProducts(requiredItem: string): Promise<Item[]> {
    try {
        const url = "http://108.61.252.153:8000/mcp"
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": `Find products matching ' ${requiredItem} ' and include a link.`
            })
        })
        
        console.log(`Response status: ${response.status}`)
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`API Error (${response.status}):`, errorText)
            return []
        }
        
        const data = await response.json() as {data: {products: any[]}}
        console.log("Raw API response:", data.data.products)
        
        // Map the API response to Item format
        const items: Item[] = data.data.products.map((product: any) => ({
            productName: product.name || product.Name || product.productName || "Unknown Product",
            productPrice: product.price || product.Price || product.productPrice || undefined,
            productURL: product.product_link || product.Product_Link || product.productURL || undefined
        }))
        
        console.log("Mapped items:", items)
        return items
    } catch(error) {
        console.error("Error: ", error)
        return []
    }
}


export { getLoblawsProducts };

getLoblawsProducts("milk")