import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true, // Allow running in browser environment
});

/**
 * Function to generate a response using Claude
 * @param prompt The prompt to send to Claude
 * @returns The generated response
 */
export async function generateResponse(prompt: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Check if the content is a text block
    if (response.content[0].type === 'text') {
      return response.content[0].text;
    }
    return 'No text response received.';
  } catch (error) {
    console.error('Error generating response from Claude:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}

export default anthropic;
