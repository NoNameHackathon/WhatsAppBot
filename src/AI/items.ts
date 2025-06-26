export type Item = {
    productName: string;
    productPrice: number;
    productURL: string;
}
async function getLoblawsProducts(requiredItem: string): Promise<Item[]> {
    return [];
}

export { getLoblawsProducts };