import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'napady.json');
      const fileData = fs.readFileSync(filePath, 'utf8');
      const ideas = JSON.parse(fileData);
      return res.status(200).json(ideas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const ideas = req.body;
      const filePath = path.join(process.cwd(), 'napady.json');
      fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
