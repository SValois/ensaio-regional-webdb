
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readBody } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const { tag, value } = await readBody(req);

    if (!tag) {
      // TinyWebDB trabalha com listas; mantemos esse padrão
      res.status(400).json(['ERROR', 'TAG_MISSING', null]);
      return;
    }

    // Persistência no KV (stringify para suportar qualquer tipo)
    const toStore = typeof value === 'string' ? value : JSON.stringify(value ?? null);
    await kv.set(tag, toStore);

    // TinyWebDB: resposta obrigatória em lista JSON
    res.status(200).json(['STORED', tag, value ?? null]);
  } catch (err) {
    res.status(500).json(['ERROR', 'INTERNAL', null]);
  }
}
