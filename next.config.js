const nextConfig = {
  rewrites: async () => {
      return [
      {
          source: '/api/:path*',
          destination: 'http://0.0.0.0:5000/api/:path*'
      },
      ]
},
}

module.exports = nextConfig
