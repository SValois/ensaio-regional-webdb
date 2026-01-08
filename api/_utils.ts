
// Helper para ler o corpo da requisição em Node (IncomingMessage) e Edge (Web Request)
// Retorna { tag, value } de forma consistente, suportando JSON e x-www-form-urlencoded.
export async function readBody(req: any): Promise<{ tag?: string; value?: any }> {
  const contentType =
    (req.headers?.get?.('content-type') || req.headers?.['content-type'] || '').toLowerCase();

  // Lê o corpo como string, independente do runtime
  let bodyStr = '';
  if (typeof req.text === 'function') {
    // Edge runtime (Web Request)
    bodyStr = await req.text();
  } else {
    // Node runtime (IncomingMessage)
    bodyStr = await new Promise<string>((resolve) => {
      let d = '';
      req.on('data', (chunk: Buffer) => (d += chunk.toString()));
      req.on('end', () => resolve(d));
    });
  }

  // Parse conforme content-type
  if (contentType.includes('application/json')) {
    try {
      const data = JSON.parse(bodyStr);
      return { tag: data?.tag, value: data?.value };
    } catch {
      return {};
    }
  } else {
    // application/x-www-form-urlencoded (TinyWebDB padrão)
    const params = new URLSearchParams(bodyStr);
    const tag = params.get('tag') || undefined;
    const value = params.get('value') ?? undefined;
    return { tag, value };
  }
}
``
