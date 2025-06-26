import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type GenerateSummaryResponse = {
    // A summary of recipe/trip plan
    info: string;
    // A list of items that users will need
    items: string[];
}

async function generateSummary(conversationHistory: string): Promise<GenerateSummaryResponse> {
    console.log(conversationHistory);
    const systemPrompt = `
            You are an assistant that helps users plan events, trips, or recipes based on their conversation history.
            Analyze the conversation and provide:
            1. A recipe, trip plan, or event plan as the summary
            2. A practical list of items they might need

            Always suggest at least 3 items, even if the conversation is general.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: conversationHistory }
            ],
            temperature: 0.7,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "summary_response",
                    schema: {
                        type: "object",
                        properties: {
                            info: {
                                type: "string",
                                description: "A clear, concise summary of what they're planning"
                            },
                            items: {
                                type: "array",
                                items: {
                                    type: "string"
                                },
                                description: "A practical list of items they might need"
                            }
                        },
                        required: ["info", "items"],
                        additionalProperties: false
                    }
                }
            }
        });
    
        let aiMessage = completion.choices[0].message?.content || '';
        
        // Parse the JSON response (should be properly formatted now)
        try {
            const result = JSON.parse(aiMessage);
            console.log(result);
            return {
                info: result.info || "Unable to generate summary",
                items: result.items || []
            };
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', aiMessage);
            return {
                info: "Error generating summary",
                items: ["Unable to suggest items"]
            };
        }
    } catch (error) {
        console.error('OpenAI API error:', error);
        return {
            info: "Error connecting to AI service",
            items: ["Please try again later"]
        };
    }
}

export { generateSummary };

