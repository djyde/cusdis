import path from 'path'
import { fileURLToPath } from 'url'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'count.js'),
      name: 'CUSDIS_COUNT',
      fileName: 'cusdis-count',
      formats: ['umd'],
    },
    outDir: path.resolve(__dirname, '..', 'public', 'js'),
    emptyOutDir: false,
  },
  plugins: [svelte({ emitCss: false })],
}
