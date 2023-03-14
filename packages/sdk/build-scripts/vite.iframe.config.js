import { webPublicPath } from './constants'

module.exports = {
  build: {
    lib: {
      entry: 'src/iframe.js' ,
      name: 'iframe',
      fileName: 'iframe',
      formats: ['umd']
    },
    outDir: webPublicPath
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
}
