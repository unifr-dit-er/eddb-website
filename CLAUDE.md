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
  to take first, not a default.
- **Three languages**: French at the root, German under `/de/`, English
  under `/en/` (`astro.config.mjs`). Interface strings in
  `src/i18n/ui.ts`; page texts in Markdown, one file per page and language:
  `src/content/pages/<locale>/<slug>.md`, with the **same slug in every
  language** (the language switcher relies on it). Slugs are English in
  every language (`/projects`, `/de/projects`). Pages: `index`,
  `projects`, `open-science`, `get-started` (Almanac:
  `eddb/eddb-website/decisions/2026-10-27-plan-du-site.md`). French is
  written first; a page missing in a language makes the switcher link to
  that language's home page.
- **Offers**: no page of their own. The three offers (`nocodb`,
  `postgresql`, `showcases`) are cards on the home page, each opening a
  native `<dialog>` with its details, including what is and is not
  included: `src/content/offers/<locale>/<slug>.md`. The slug is the
  dialog id: `/#nocodb` opens it, from a card or a shared link.
- **Projects**: one YAML file per project in service in
  `src/content/projects/` (localized texts, French as fallback), all shown
  on `/projects`, the `featured` ones on the home page too. Keep it in step
  with the project index of Almanac: a project put into service or
  archived enters or leaves the gallery.
- **Drafts**: missing information is marked `[À compléter : …]` in the
  texts; none may remain at launch (`grep -rn 'À compléter' src/content`).
- **Shared domain**: NocoDB (`/noco`) and the showcases (`/pressearchiv`,
  `/holynet`, `/nafo`, `/callisto`…) live on eddb.unifr.ch too. Never
  create a page whose path collides with them. Assets are under `/_astro/`.
- **Texts are written for others**: the team is named **DIT-ER**.
- **Colours** follow the Unifr corporate design: midnight blue #071D49 as
  primary (EDDB serves every faculty, so no faculty colour), WCAG AA
  contrast. `src/styles/theme.css` is copied from the showcases' kit
  (`eddb-showcases`, `packages/showcase-kit/src/theme.css`): carry changes
  over by hand.
- Fonts are self-hosted (Fontsource): Atkinson Hyperlegible Next for text,
  Newsreader for headings, as in the showcases.

# Tooling

- npm 11, Node 22. `npm run dev`, `npm run check` (ESLint, `astro check`),
  `npm run build` (output in `dist/`).
- Image: `podman build -t eddb-website:latest .` (Node builds, nginx
  unprivileged serves on port 8080; `nginx.conf`).
- **CI** (`.github/workflows/ci.yml`): check, build and image on every push
  to main and every pull request. No secret, no deployment.
- **Renovate** (`renovate.json5`), as in eddb-showcases: development tools
  and Actions weekly, automerged after a green CI; site dependencies, images
  and lockfile in one monthly batch, merged by hand; security fixes at once.
  Node stays on 22. Actions are pinned by commit SHA.
