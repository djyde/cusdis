import path from 'path'

module.exports = {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'iframe.js'),
      name: 'iframe',
      fileName: 'iframe',
      formats: ['umd']
    },
    outDir: path.resolve(__dirname, '..', 'public', 'js'),
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
}
