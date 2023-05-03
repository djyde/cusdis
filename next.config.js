const staticFileHeaders = [
  {
    key: 'Access-Control-Allow-Origin',
    value: '*'
  }
]
module.exports = {
  experimental: {
    appDir: true
  },
  async headers() {
    return [
      {
        source: '/js/iframe.umd.js',
        headers: staticFileHeaders 
      },
      {
        source: '/js/cusdis.es.js',
        headers: staticFileHeaders 
      },
      {
        source: '/js/style.css',
        headers: staticFileHeaders 
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