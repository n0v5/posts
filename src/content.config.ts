import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesPart: z.number().int().min(0).optional(),
    seriesOrder: z.number().int().min(0).optional(),
  }),
});

export const collections = { blog };
