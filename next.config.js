module.exports = {
  experimental: {
    appDir: true
  },
  async headers() {
    return [
      {
        source: '/js/iframe.umd',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      {
        source: '/js/cusdis.es.js',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      {
        source: '/js/style.css',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    ]
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