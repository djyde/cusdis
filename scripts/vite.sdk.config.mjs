import path from 'path'
import { fileURLToPath } from 'url'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'sdk.js'),
      name: 'cusdis',
    },
    outDir: path.resolve(__dirname, '..', 'widget', 'dist'),
    emptyOutDir: false,
  },
  plugins: [svelte({ emitCss: false })],
}
