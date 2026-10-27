import { getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['fr', 'de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const languageNames: Record<Locale, string> = {
  fr: 'Français',
  de: 'Deutsch',
  en: 'English',
};

export const contactEmail = 'eddb@unifr.ch';

// Interface strings; page texts live in src/content/pages/.
const ui = {
  fr: {
    'site.tagline': 'Bases de données pour la recherche et l’enseignement',
    'site.unifr': 'Université de Fribourg',
    'site.title': 'EDDB · Enseignement et Recherche',
    'nav.skip': 'Aller au contenu',
    'nav.languages': 'Langues',
    'offers.more': 'En savoir plus',
    'offers.close': 'Fermer',
    'home.projects': 'Quelques projets',
    'home.moreProjects': 'Plus de projets',
    'home.fewerProjects': 'Moins de projets',
    'home.projectsIntro':
      'Des bases de toutes les disciplines : droit, histoire, histoire de l’art, archéologie, biologie. Certaines se consultent en ligne, d’autres servent au travail interne des équipes.',
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
    'site.unifr': 'Universität Freiburg',
    'site.title': 'EDDB · Lehre und Forschung',
    'nav.skip': 'Zum Inhalt',
    'nav.languages': 'Sprachen',
    'offers.more': 'Mehr erfahren',
    'offers.close': 'Schliessen',
    'home.projects': 'Einige Projekte',
    'home.moreProjects': 'Weitere Projekte',
    'home.fewerProjects': 'Weniger Projekte',
    'home.projectsIntro':
      'Datenbanken aus allen Disziplinen: Recht, Geschichte, Kunstgeschichte, Archäologie, Biologie. Manche sind online zugänglich, andere dienen der internen Arbeit der Teams.',
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
    'site.unifr': 'University of Fribourg',
    'site.title': 'EDDB · Teaching and Research',
    'nav.skip': 'Skip to content',
    'nav.languages': 'Languages',
    'offers.more': 'Learn more',
    'offers.close': 'Close',
    'home.projects': 'Some projects',
    'home.moreProjects': 'More projects',
    'home.fewerProjects': 'Fewer projects',
    'home.projectsIntro':
      'Databases from every discipline: law, history, art history, archaeology, biology. Some can be browsed online, others support the internal work of the teams.',
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

/** A localized text of the content collections, French as fallback; a plain string is the same in every language. */
export function localized(text: string | ({ fr: string } & Partial<Record<Locale, string>>), locale: Locale): string {
  return typeof text === 'string' ? text : (text[locale] ?? text.fr);
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

/** Pages of the University of Fribourg: its home page, imprint and legal notice. */
export function unifrUrl(locale: Locale, page: 'home' | 'impressum' | 'legal'): string {
  return `https://www.unifr.ch/home/${locale}/${page === 'home' ? '' : `${page}.html`}`;
}
