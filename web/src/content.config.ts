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

export const collections = { pillars, capabilities, mappings, glossary };
