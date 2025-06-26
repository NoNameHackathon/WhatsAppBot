export type GenerateSummaryResponse = {
    // A summary of recipe/trip plan
    summary: string;
    // A list of items that users will need
    items: string[];
}
async function generateSummary(conversationHistory: string[]): Promise<GenerateSummaryResponse> {
    console.log(conversationHistory.length);
    const summary = "This is a summary of the conversation";
    const items = ["toilet paper", "milk", "bread"];
    return { summary, items };
}

export { generateSummary };