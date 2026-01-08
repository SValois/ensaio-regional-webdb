
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

    await kv.del(tag);

    // Não há resposta "oficial" do TinyWebDB para delete; manteremos formato de lista
    res.status(200).json(['DELETED', tag, null]);
  } catch (err) {
    res.status(500).json(['ERROR', 'INTERNAL', null]);
  }
}
