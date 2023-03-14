module.exports = {
  experimental: {
    appDir: true
  },
  rewrites() {
    return [
      {
        source: '/doc',
        destination: '/doc/index.html'
      }
    ]
  }
}