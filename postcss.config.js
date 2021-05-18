module.exports = {
  plugins: {
    tailwindcss: {
      purge: [
        "widget/**/*.svelte"
      ],
      darkMode: 'class',
      variants: {
        extend: {
          outline: ['dark']
        }
      }
    },
    autoprefixer: {},
  },
};
