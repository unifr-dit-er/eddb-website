# EDDB website

Website of EDDB, the database service for teaching and research of the
University of Fribourg (DIT-ER): eddb.unifr.ch.

Built with [Astro](https://astro.build) as a static site, served by nginx.

```sh
npm ci
npm run dev      # development server, http://localhost:4321
npm run check    # lint and typecheck
npm run build    # static site in dist/
podman build -t eddb-website:latest .   # nginx image, port 8080
```

Page texts are Markdown files in `src/content/pages/<locale>/`
(French, German, English).
