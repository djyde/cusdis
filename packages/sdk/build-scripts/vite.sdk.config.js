import { webPublicPath } from './constants'

module.exports = {
  build: {
    lib: {
      entry: 'src/sdk.js',
      name: 'cusdis',
      fileName: 'cusdis'
    },
    outDir: webPublicPath
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
}
