import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://julienverkest06.github.io',
  base: '/90-deutschlektionen-in-90-tagen',
  vite: {
    plugins: [tailwindcss()],
  },
});
