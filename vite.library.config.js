import path from 'path'

module.exports = {
  root: "widget",
  server: {
    port: 3001,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'widget', 'index.js'),
      name: 'cusdis'
    },
    outDir: "public",
  },
  plugins: [require("rollup-plugin-svelte")()],
};
