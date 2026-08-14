import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const capabilities = await getCollection('capabilities');
  const body = capabilities.map((c) => ({
    id: c.id,
    pillar: c.data.pillar,
    capability: c.data.capability,
    traditional: c.data.traditional,
    advanced: c.data.advanced,
    optimal: c.data.optimal,
    frameworks: c.data.frameworks,
  }));

  return new Response(
    JSON.stringify(
      {
        source: 'https://github.com/sepand/ZTLens',
        license: 'CC BY-SA 4.0',
        generatedFrom: 'data/capabilities.yaml',
        count: body.length,
        capabilities: body,
      },
      null,
      2
    ),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};
