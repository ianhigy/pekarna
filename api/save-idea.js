import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, idea } = req.body;
    
    const filePath = path.join(process.cwd(), 'napady.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileData);
    
    const newIdea = {
      id: ideas.length > 0 ? Math.max(...ideas.map(i => i.id)) + 1 : 1,
      name,
      email,
      idea,
      created: new Date().toISOString(),
      status: 'pending'
    };
    
    ideas.push(newIdea);
    fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
    
    res.status(200).json({ success: true, idea: newIdea });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
