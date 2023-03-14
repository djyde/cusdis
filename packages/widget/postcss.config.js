module.exports = {
  plugins: {
    tailwindcss: {
      purge: ['src/**/*.svelte', 'src/theme.css'],
      darkMode: 'class',
      variants: {
        extend: {
          outline: ['dark'],
          borderWidth: ['dark'],
          borderColor: ['dark']
        },
      },
    },
    autoprefixer: {},
  },
}