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
            Based on the conversation content, create a plan (recipe, trip itinerary, or event plan).
            Provide:
            1. Info: A recipe with instructions, trip itinerary with activities, or event plan with timeline
            2. Items: A practical shopping/packing list of specific items they will need
            
            Always suggest at least 3 specific items, even if the conversation is general.
            Focus on creating actionable content.
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
                    name: "response_schema",
                    schema: {
                        type: "object",
                        properties: {
                            info: {
                                type: "string",
                                description: "A recipe, trip plan, or event plan"
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

