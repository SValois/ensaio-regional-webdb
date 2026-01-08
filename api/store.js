
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  try {
    const { tag, value } = req.body;

    if (!tag) {
      return res.status(400).json({ success: false, error: 'TAG obrigatória' });
    }

    await kv.set(tag, value);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
