import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: "https://poststatus.com",
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
})
