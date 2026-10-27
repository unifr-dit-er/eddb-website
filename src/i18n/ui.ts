import { getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['fr', 'de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  de: 'Deutsch',
  en: 'English',
};

// Interface strings; page texts live in src/content/pages/.
const ui = {
  fr: {
    'site.tagline': 'Bases de données pour la recherche et l’enseignement',
    'nav.skip': 'Aller au contenu',
    'nav.languages': 'Langues',
    'footer.service': 'Un service de la DIT-ER, Université de Fribourg',
  },
  de: {
    'site.tagline': 'Datenbanken für Forschung und Lehre',
    'nav.skip': 'Zum Inhalt',
    'nav.languages': 'Sprachen',
    'footer.service': 'Ein Dienst der DIT-ER, Universität Freiburg',
  },
  en: {
    'site.tagline': 'Databases for research and teaching',
    'nav.skip': 'Skip to content',
    'nav.languages': 'Languages',
    'footer.service': 'A service of DIT-ER, University of Fribourg',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['fr'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** URL of a page slug in a language; 'index' is the home page. */
export function pageUrl(locale: Locale, slug: string): string {
  return getRelativeLocaleUrl(locale, slug === 'index' ? '' : slug);
}

/** Locale and slug of a content entry, from its id (<locale>/<slug>). */
export function splitEntryId(id: string): { locale: Locale; slug: string } {
  const [locale, ...rest] = id.split('/');
  if (!isLocale(locale)) throw new Error(`Unknown locale in content entry: ${id}`);
  return { locale, slug: rest.join('/') || 'index' };
}

/** Path parameter of [...locale] routes: none for the default locale. */
export function localeParam(locale: Locale): string | undefined {
  return locale === defaultLocale ? undefined : locale;
}
