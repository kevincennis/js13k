module.exports = {
  src: {
    files: 'src/**/*',
    tasks: [
      'concat',
      'preprocess:js',
      'uglify',
      'preprocess:html',
      'compare_size'
    ]
  }
};
