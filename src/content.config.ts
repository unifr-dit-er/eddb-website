import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A text in each language; French is required, the others fall back to it. */
const localized = z.object({ fr: z.string(), de: z.string().optional(), en: z.string().optional() });

// One Markdown file per page and language: src/content/pages/<locale>/<slug>.md.
// A page keeps the same slug in every language, so that the language switcher
// can link a page to its translations.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Home page only: the offer cards and the call to action.
    cards: z
      .array(z.object({ title: z.string(), text: z.string(), slug: z.string(), anchor: z.string().optional() }))
      .optional(),
    cta: z.object({ label: z.string(), slug: z.string() }).optional(),
  }),
});

// One YAML file per project in service, shown on /projects (and on the home
// page if `featured`). Keep it in step with the project index of Almanac.
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    faculty: z.enum(['lettres', 'sciences', 'droit']),
    department: localized,
    summary: localized,
    funding: z.enum(['FNS', 'ERC']).optional(),
    url: z.url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { pages, projects };
