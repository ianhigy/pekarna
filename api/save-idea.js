import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, idea } = req.body;
    
    const ideas = await kv.get('ideas') || [];
    
    const newIdea = {
      id: ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1,
      name,
      email,
      idea,
      created: new Date().toISOString(),
      status: 'pending'
    };
    
    ideas.push(newIdea);
    await kv.set('ideas', ideas);
    
    return res.status(200).json({ success: true, idea: newIdea });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
