import path from 'path'

module.exports = {
  root: 'widget',
  build: {
    lib: {
      entry: path.resolve(__dirname, '..', 'widget', 'sdk.js'),
      name: 'cusdis',
    },
    outDir: path.resolve(__dirname, '..', 'widget', 'dist'),
  },
  plugins: [
    require('rollup-plugin-svelte')({
      emitCss: false,
    }),
  ],
}
