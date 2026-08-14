import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { load as parseYaml } from 'js-yaml';

const pillars = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: '../pillars' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.string(),
  }),
});

const capabilities = defineCollection({
  loader: file('../data/capabilities.yaml', {
    parser: (text) => parseYaml(text),
  }),
  schema: z.object({
    pillar: z.string(),
    capability: z.string(),
    traditional: z.string(),
    advanced: z.string(),
    optimal: z.string(),
    frameworks: z
      .array(z.object({ framework: z.string(), ref: z.string() }))
      .default([]),
  }),
});

const mappings = defineCollection({
  loader: glob({ pattern: 'README.md', base: '../mappings' }),
});

const glossary = defineCollection({
  loader: glob({ pattern: 'README.md', base: '../glossary' }),
});

const nistCrosswalkCellSchema = z.object({
  govern: z.string(),
  identify: z.string(),
  protect: z.string(),
  detect: z.string(),
  respond: z.string(),
  recover: z.string(),
});

const nistCrosswalk = defineCollection({
  loader: file('../data/nist-csf-mapping.yaml', {
    parser: (text) => parseYaml(text),
  }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    dod_pillar: z.string(),
    cells: nistCrosswalkCellSchema,
  }),
});

const vendors = defineCollection({
  loader: file('../data/vendors.yaml', {
    parser: (text) => parseYaml(text).pillars,
  }),
  schema: z.object({
    pillar: z.string(),
    vendors: z.array(
      z.object({
        name: z.string(),
        publisher: z.string(),
        category: z.string().optional(),
        source: z.string(),
        url: z.string().optional(),
      })
    ),
    generated_at: z.string(),
    sources: z.array(z.string()),
    disclaimer: z.string(),
  }),
});

export const collections = { pillars, capabilities, mappings, glossary, nistCrosswalk, vendors };
