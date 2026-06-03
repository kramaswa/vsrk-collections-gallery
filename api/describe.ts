import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mimeType } = req.body;

  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 },
            },
            {
              type: 'text',
              text: 'You are an expert jewelry describer. Look at this jewelry image and provide:\n1. A concise title (3-6 words, e.g. "Emerald Gold Necklace Set")\n2. A brief description (1-2 sentences) mentioning the type, materials, and style.\n\nRespond with JSON only, no extra text: {"title": "...", "description": "..."}',
            },
          ],
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const parsed = JSON.parse(text.trim());
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Claude API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
