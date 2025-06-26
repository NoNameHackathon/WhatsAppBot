export type Item = {
    productName: string;
    productPrice: number;
    productURL: string;
}
async function getNoNameProducts(requiredItem: string): Promise<Item[]> {
    return [];
}

export { getNoNameProducts };