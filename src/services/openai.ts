import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateMessage(prompt: string): Promise<string> {
  const response = await openai.responses.create({
    model: 'gpt-4o-mini',
    input: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Text lives under output_text in the SDK’s helper
  const text = response?.output_text;

  if (!text) {
    throw new Error('No text returned from OpenAI');
  }

  return text;
}
