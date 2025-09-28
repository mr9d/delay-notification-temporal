import OpenAI from 'openai';


// Initialize the OpenAI client with the API key from environment variables.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * Generates a message using the OpenAI API based on the provided prompt.
 *
 * @param prompt - The prompt string to send to the OpenAI model
 * @returns The generated message text from the model
 * @throws Error if no text is returned from OpenAI
 */
export async function generateMessage(prompt: string): Promise<string> {
  // Call the OpenAI API with the specified model and user prompt.
  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract the generated text from the response (under output_text).
  const text = response?.output_text;

  // If no text is returned, throw an error.
  if (!text) {
    throw new Error('No text returned from OpenAI');
  }

  // Return the generated message text.
  return text;
}
