
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ success: false, error: 'TAG obrigatória' });
    }

    const value = await kv.get(tag);

    res.json({ success: true, value });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
