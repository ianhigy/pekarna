import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Povolit CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const filePath = path.join(process.cwd(), 'napady.json');

  if (req.method === 'GET') {
    try {
      let ideas = [];
      try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        ideas = JSON.parse(fileData);
      } catch (e) {
        // Soubor neexistuje, vrátíme prázdné pole
        ideas = [];
      }
      return res.status(200).json(ideas);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const ideas = req.body;
      fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
