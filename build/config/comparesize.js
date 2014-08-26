module.exports = {
  files: [
    'dist/index.html'
  ],
  options: {
    cache: 'build/.sizecache.json',
    compress: {
      gz: function( fileContents ) {
        return require('gzip-js').zip( fileContents, {} ).length;
      }
    }
  }
};
