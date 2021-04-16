import path from 'path'

module.exports = {
  root: "widget",
  server: {
    port: 3001,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'widget', 'index.js'),
      name: 'comment'
    },
    outDir: "public",
  },
  plugins: [require("rollup-plugin-svelte")()],
};
