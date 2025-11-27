import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const ideas = await kv.get('ideas') || [];
    return res.status(200).json(ideas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
