const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('Missing OpenAI API key');
}

export const openaiConfig = {
  apiKey: openaiKey,
};