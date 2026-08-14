import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const pillars = (await getCollection('nistCrosswalk')).sort((a, b) => a.data.order - b.data.order);
  const body = pillars.map((p) => ({
    id: p.id,
    name: p.data.name,
    order: p.data.order,
    dodPillar: p.data.dod_pillar,
    functions: p.data.cells,
  }));

  return new Response(
    JSON.stringify(
      {
        source: 'https://github.com/sepand/ZTLens',
        license: 'CC BY-SA 4.0',
        generatedFrom: 'data/nist-csf-mapping.yaml',
        functions: ['govern', 'identify', 'protect', 'detect', 'respond', 'recover'],
        pillars: body,
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
