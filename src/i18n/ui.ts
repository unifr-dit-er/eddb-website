import { getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['fr', 'de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  de: 'Deutsch',
  en: 'English',
};

/** Pages of the main navigation, by slug. */
export const navigation = ['projects', 'open-science', 'get-started'] as const;

export const contactEmail = 'eddb@unifr.ch';

// Interface strings; page texts live in src/content/pages/.
const ui = {
  fr: {
    'site.tagline': 'Bases de données pour la recherche et l’enseignement',
    'nav.skip': 'Aller au contenu',
    'nav.main': 'Navigation principale',
    'nav.languages': 'Langues',
    'offers.more': 'En savoir plus',
    'offers.close': 'Fermer',
    'nav.projects': 'Projets',
    'nav.open-science': 'Science ouverte',
    'nav.get-started': 'Démarrer un projet',
    'home.projects': 'Quelques projets',
    'home.allProjects': 'Tous les projets',
    'projects.visit': 'Consulter',
    'funding.FNS': 'FNS',
    'funding.ERC': 'ERC',
    'faculty.lettres': 'Lettres et sciences humaines',
    'faculty.sciences': 'Sciences et médecine',
    'faculty.droit': 'Droit',
    'footer.service': 'Un service de la DIT-ER, Université de Fribourg',
    'footer.contact': 'Contact :',
    'footer.impressum': 'Impressum',
    'footer.legal': 'Mentions légales',
  },
  de: {
    'site.tagline': 'Datenbanken für Forschung und Lehre',
    'nav.skip': 'Zum Inhalt',
    'nav.main': 'Hauptnavigation',
    'nav.languages': 'Sprachen',
    'offers.more': 'Mehr erfahren',
    'offers.close': 'Schliessen',
    'nav.projects': 'Projekte',
    'nav.open-science': 'Open Science',
    'nav.get-started': 'Projekt starten',
    'home.projects': 'Einige Projekte',
    'home.allProjects': 'Alle Projekte',
    'projects.visit': 'Ansehen',
    'funding.FNS': 'SNF',
    'funding.ERC': 'ERC',
    'faculty.lettres': 'Philosophische Fakultät',
    'faculty.sciences': 'Mathematisch-Naturwissenschaftliche und Medizinische Fakultät',
    'faculty.droit': 'Rechtswissenschaftliche Fakultät',
    'footer.service': 'Ein Dienst der DIT-ER, Universität Freiburg',
    'footer.contact': 'Kontakt:',
    'footer.impressum': 'Impressum',
    'footer.legal': 'Rechtliche Hinweise',
  },
  en: {
    'site.tagline': 'Databases for research and teaching',
    'nav.skip': 'Skip to content',
    'nav.main': 'Main navigation',
    'nav.languages': 'Languages',
    'offers.more': 'Learn more',
    'offers.close': 'Close',
    'nav.projects': 'Projects',
    'nav.open-science': 'Open science',
    'nav.get-started': 'Start a project',
    'home.projects': 'Some projects',
    'home.allProjects': 'All projects',
    'projects.visit': 'Visit',
    'funding.FNS': 'SNSF',
    'funding.ERC': 'ERC',
    'faculty.lettres': 'Humanities',
    'faculty.sciences': 'Science and Medicine',
    'faculty.droit': 'Law',
    'footer.service': 'A service of DIT-ER, University of Fribourg',
    'footer.contact': 'Contact:',
    'footer.impressum': 'Imprint',
    'footer.legal': 'Legal notice',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['fr'];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}

/** A localized text of the content collections, French as fallback. */
export function localized(text: { fr: string } & Partial<Record<Locale, string>>, locale: Locale): string {
  return text[locale] ?? text.fr;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** URL of a page slug in a language; 'index' is the home page. */
export function pageUrl(locale: Locale, slug: string, anchor?: string): string {
  const url = getRelativeLocaleUrl(locale, slug === 'index' ? '' : slug);
  return anchor ? `${url}#${anchor}` : url;
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

/** Pages of the University of Fribourg linked from the footer. */
export function unifrUrl(locale: Locale, page: 'impressum' | 'legal'): string {
  return `https://www.unifr.ch/home/${locale}/${page}.html`;
}
