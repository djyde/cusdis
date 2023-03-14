import path from 'path'
import { defineConfig } from 'vite'

module.exports = defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'cusdis',
    },
    outDir: 'dist'
    // outDir: path.resolve(__dirname, '..', 'public', 'js'),
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
})
