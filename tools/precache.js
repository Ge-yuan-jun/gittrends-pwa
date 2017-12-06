// ./tools/precache.js

const name = 'scotchPWA-v1'
module.exports = {
  staticFileGlobs: [
    './gittrends-pwa/index.html',
    './gittrends-pwa/images/*.{png,svg,gif,jpg}',
    './gittrends-pwa/fonts/**/*.{woff,woff2}',
    './gittrends-pwa/js/*.js',
    './gittrends-pwa/css/*.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
  ],
  stripPrefix: '.',
  runtimeCaching: [{
    urlPattern: /https:\/\/api\.github\.com\/search\/repositories/,
    handler: 'networkFirst',
    options: {
      cache: name
    }
  }]
};