> Source of truth: this starter is exported from the `contentrain-starters` monorepo.
> Internal starter id: `astro-blog`.
# Contentrain Astro Blog

Editorial starter for founder letters, product journals, and thoughtful publishing sites.

![Contentrain Astro Blog cover](./media/cover.png)

![Contentrain Astro Blog preview](./media/preview.gif)

## Contentrain Ecosystem

- SDK and CLI: [ai.contentrain.io/packages/sdk.html](https://ai.contentrain.io/packages/sdk.html)
- Product guides: [docs.contentrain.io](https://docs.contentrain.io/)
- Editorial and content operations UI: [studio.contentrain.io](https://studio.contentrain.io)

## Quick Start

```bash
pnpm install
pnpm dev
```

## Commands

- `pnpm dev`
- `pnpm check`
- `pnpm build`
- `pnpm preview`
- `pnpm deploy:netlify`
- `pnpm contentrain:generate`

## Demo routes

- `/`
- `/blog/designing-calm-interfaces`
- `/architecture`

## Contentrain

- Seed content lives in `.contentrain/`
- Runtime content queries use the generated `#contentrain` SDK
- Blog pages, navigation, footer, SEO, authors, and categories are content-driven
- The starter follows a git-backed Contentrain architecture so content, schemas, and generated SDK output stay versioned together

## Deploy

- Netlify build command: `pnpm deploy:netlify`
- Netlify publish directory: `dist`
- `netlify.toml` is committed in the starter root

## Netlify Project Creation

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2FContentrain%2Fcontentrain-starter-astro-blog)

Use `pnpm dlx netlify-cli init` to connect the repository for continuous deployment, or `pnpm dlx netlify-cli link` if the site already exists.
