module.exports = [
  'concat',
  'preprocess:js',
  'uglify',
  'preprocess:html',
  'connect',
  'blanket_mocha',
  'compare_size'
];
