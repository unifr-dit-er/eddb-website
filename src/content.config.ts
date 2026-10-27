import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** A text in each language; French is required, the others fall back to it. */
const localized = z.object({ fr: z.string(), de: z.string().optional(), en: z.string().optional() });

// The site is a single page. Its texts are Markdown files, one per part and
// language: src/content/pages/<locale>/<slug>.md, same slug in every language.
// - home (`index`): the introduction at the top of the page;
// - section: a section of the page, with its id <slug> (/#<slug>);
// - dialog: a dialog opened from the page (/#<slug>).
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    kind: z.enum(['home', 'section', 'dialog']),
    title: z.string(),
    description: z.string(),
    // Section only: blocks shown side by side under the introduction.
    blocks: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    // Home only: the call to action, opening the dialog <slug>.
    cta: z.object({ label: z.string(), slug: z.string() }).optional(),
  }),
});

// The three offers, shown as cards on the home page, each opening a dialog
// with its details: src/content/offers/<locale>/<slug>.md. The slug is the
// dialog id, so that /#<slug> opens it (same slug in every language).
const offers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/offers' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
  }),
});

// One YAML file per project in service: the `featured` ones are shown first,
// the others under "More projects". Keep it in step with the project index of
// Almanac.
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    // A proper name stays as is; a descriptive one is translated.
    name: z.union([z.string(), localized]),
    faculty: z.enum(['lettres', 'sciences', 'droit']),
    department: localized,
    summary: localized,
    funding: z.enum(['FNS', 'ERC']).optional(),
    url: z.url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { pages, offers, projects };
