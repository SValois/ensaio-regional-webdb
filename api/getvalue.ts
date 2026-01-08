
import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readBody } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const { tag } = await readBody(req);

    if (!tag) {
      res.status(400).json(['ERROR', 'TAG_MISSING', null]);
      return;
    }

    const raw = await kv.get<string | null>(tag);

    // Se armazenamos JSON serializado, tenta parsear; senão retorna string
    let value: any = raw;
    if (typeof raw === 'string') {
      try {
        value = JSON.parse(raw);
      } catch {
        value = raw;
      }
    } else if (raw === null) {
      value = null;
    }

    // TinyWebDB: lista JSON obrigatória
    res.status(200).json(['VALUE', tag, value]);
  } catch (err) {
    res.status(500).json(['ERROR', 'INTERNAL', null]);
  }
}
