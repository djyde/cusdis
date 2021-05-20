module.exports = {
  root: "widget",
  server: {
    hmr: {
      host: 'localhost'
    },
    port: 3001,
  },
  plugins: [
    require("rollup-plugin-svelte")({
      emitCss: false
    }),
  ],
};
