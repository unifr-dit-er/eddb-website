import { getCollection, type CollectionEntry } from 'astro:content';
import { splitEntryId, type Locale } from '../i18n/ui';

// A type, not an interface: route props must accept an index signature.
export type PageRoute = {
  page: CollectionEntry<'pages'>;
  locale: Locale;
  slug: string;
  /** Languages in which this page exists, for the switcher and hreflang. */
  translations: Locale[];
};

/** Every page with its locale, slug and available translations. */
export async function getPageRoutes(): Promise<PageRoute[]> {
  const entries = (await getCollection('pages')).map((page) => ({ page, ...splitEntryId(page.id) }));
  return entries.map((entry) => ({
    ...entry,
    translations: entries.filter((other) => other.slug === entry.slug).map((other) => other.locale),
  }));
}
