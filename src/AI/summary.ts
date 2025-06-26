import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type GenerateSummaryResponse = {
    // A summary of recipe/trip plan
    summary: string;
    // A list of items that users will need
    items: string[];
}

async function generateSummary(conversationHistory: string): Promise<GenerateSummaryResponse> {
    console.log(conversationHistory);
    const systemPrompt = `
            You are an assistant that helps users plan events, trips, or recipes based on their conversation history.
            Analyze the conversation and provide:
            1. A clear, concise summary of what they're planning (recipe, trip, event, etc.)
            2. A practical list of items they might need

            Always suggest at least 3 items, even if the conversation is general.
            Respond ONLY in the following JSON format:
            {"summary": "str", "items": ["str1", "str2", "str3"]}.
    `;


    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: conversationHistory }
            ],
            temperature: 0.7,
        });
    
        let aiMessage = completion.choices[0].message?.content || '';
        
        // Try to parse the JSON response
        try {
            const result = JSON.parse(aiMessage);
            console.log(result);
            return {
                summary: result.summary || "Unable to generate summary",
                items: result.items || []
            };
        } catch (parseError) {
            // Try to fix single quotes to double quotes and parse again
            try {
                aiMessage = aiMessage.replace(/'/g, '"');
                const result = JSON.parse(aiMessage);
                console.log(result);    
                return {
                    summary: result.summary || "Unable to generate summary",
                    items: result.items || []
                };
            } catch (secondParseError) {
                console.error('Failed to parse OpenAI response:', aiMessage);
                return {
                    summary: "Error generating summary",
                    items: ["Unable to suggest items"]
                };
            }
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        return {
            summary: "Error connecting to AI service",
            items: ["Please try again later"]
        };
    }
}

export { generateSummary };

