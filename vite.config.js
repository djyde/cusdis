module.exports = {
  root: "widget",
  server: {
    port: 3001,
  },
  plugins: [
    require("rollup-plugin-svelte")({
      emitCss: false
    }),
  ],
};
