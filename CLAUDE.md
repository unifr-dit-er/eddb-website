# EDDB website

Website presenting the EDDB service (databases for research and teaching,
University of Fribourg) to teachers and researchers. It will replace the
home page of eddb.unifr.ch, served today by `eddb-hub`.

# Stack

Astro, static output only, served by nginx in a container: no Node.js at run
time. Tailwind CSS 4 (Vite plugin). Decided on 27.10.2026 (Almanac:
`eddb/eddb-website/decisions/2026-10-27-stack-astro-statique.md`).

# Rules

- **Static only.** No server endpoint, no on-demand rendering, no adapter.
  Anything that needs a server (a request form, for instance) is a decision
  to take first, not a default. Requests come by email (eddb@unifr.ch).
- **A single page** (decided on 27.10.2026, Almanac:
  `eddb/eddb-website/decisions/2026-10-27-plan-du-site.md`), no
  navigation in the header: introduction and call to action, the three
  offer cards, the open science section, the projects. Anchors: `/#<slug>`
  scrolls to a section or opens a dialog.
- **Three languages**: French at the root, German under `/de/`, English
  under `/en/` (`astro.config.mjs`). Interface strings in
  `src/i18n/ui.ts`. Texts in Markdown, one file per part and language,
  **same slug in every language**: `src/content/pages/<locale>/<slug>.md`
  with `kind: home` (`index`, the introduction), `section` (a section of
  the page, id `<slug>`: `open-science`, whose `blocks` are shown side by
  side under its introduction) or `dialog` (`get-started`,
  opened by the call to action). French is written first; a dialog not yet
  translated falls back to French.
- **Dialogs**: native `<dialog>`, one at a time; a link to `/#<slug>`
  opens the dialog of that id, closing any other.
- **Offers**: the three offers (`nocodb`, `postgresql`, `showcases`) are
  cards, each opening a dialog with its details, including what is and is
  not included: `src/content/offers/<locale>/<slug>.md`.
- **Projects**: one YAML file per project in service in
  `src/content/projects/` (localized texts, French as fallback). The three
  `featured` ones are shown, the others under "More projects" (a
  `<details>`; never call it "all projects"). Keep it in step with the
  project index of Almanac: a project put into service or archived enters
  or leaves the list.
- **Drafts**: missing information is marked `[À compléter : …]` in the
  texts; none may remain at launch (`grep -rn 'À compléter' src/content`).
- **Shared domain**: NocoDB (`/noco`) and the showcases (`/pressearchiv`,
  `/holynet`, `/nafo`, `/callisto`…) live on eddb.unifr.ch too. Never
  create a page whose path collides with them. Assets are under `/_astro/`.
- **Texts are written for others**: the team is named **DIT-ER**.
- **Open science**: describe our support, not platforms. DaSCH and data
  repositories (OLOS, Zenodo) are not named on the site until those
  processes are properly established (Alrick, 27.10.2026).
- **Colours** follow the Unifr corporate design: midnight blue #071D49 as
  primary (EDDB serves every faculty, so no faculty colour), WCAG AA
  contrast. `src/styles/theme.css` is copied from the showcases' kit
  (`eddb-showcases`, `packages/showcase-kit/src/theme.css`): carry changes
  over by hand.
- **Header**: a single white band, the Unifr logo, then EDDB in midnight
  blue (inline SVG icon), a midnight blue rule below. The Unifr logo always
  keeps its white background (Service communication). `public/unifr.png`
  (500 × 82, the only web version, as on unifr.ch) is shown at exactly
  41 px high to stay sharp; on narrow screens (< 640 px) the signet alone,
  `public/unifr-signet.svg`, vector, extracted from the icon font of
  unifr.ch (glyph U+E00A). Ask the Service communication for a vector
  version of the horizontal logo.
- Fonts are self-hosted (Fontsource): Atkinson Hyperlegible Next for text,
  Newsreader for headings, as in the showcases.

# Tooling

- npm 11, Node 22. `npm run dev`, `npm run check` (ESLint, `astro check`),
  `npm run build` (output in `dist/`).
- After a change of the content schema (`src/content.config.ts`), the dev
  server may keep stale entries and answer 404: stop it, delete `.astro/`
  and `node_modules/.astro/`, start it again.
- Image: `podman build -t eddb-website:latest .` (Node builds, nginx
  unprivileged serves on port 8080; `nginx.conf`).
- **CI** (`.github/workflows/ci.yml`): check, build and image on every push
  to main and every pull request. No secret, no deployment.
- **Renovate** (`renovate.json5`), as in eddb-showcases: development tools
  and Actions weekly, automerged after a green CI; site dependencies, images
  and lockfile in one monthly batch, merged by hand; security fixes at once.
  Node stays on 22. Actions are pinned by commit SHA.
