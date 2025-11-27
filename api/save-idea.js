import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Povolit CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, idea } = req.body;
    
    const filePath = path.join(process.cwd(), 'napady.json');
    
    let ideas = [];
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      ideas = JSON.parse(fileData);
    } catch (e) {
      // Soubor neexistuje nebo je prázdný
      ideas = [];
    }
    
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
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
