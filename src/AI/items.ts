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
    // return a dummy list of products
    console.log("Getting Loblaws products for: ", requiredItem);
    const products = [
        {
            productName: "Loblaws Toilet Paper",
            productPrice: 10.99,
            productURL: "https://www.loblaws.ca/product/1234567890"
        },
    ];
    return products;
}

export { getLoblawsProducts };