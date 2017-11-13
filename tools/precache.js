// ./tools/precache.js

const name = 'scotchPWA-v1'
module.exports = {
  staticFileGlobs: [
    './index.html',
    './images/*.{png,svg,gif,jpg}',
    './fonts/**/*.{woff,woff2}',
    './js/*.js',
    './css/*.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
  ],
  stripPrefix: '.'
};