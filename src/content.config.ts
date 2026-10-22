import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({ title: z.string(), description: z.string(), lang: z.enum(['en', 'fr']), translationKey: z.string(), updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() })
});
export const collections = { blog };
