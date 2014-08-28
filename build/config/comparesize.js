module.exports = {
  files: [
    'dist/index.html'
  ],
  options: {
    cache: 'build/.sizecache.json',
    compress: {
      gz: function( fileContents ) {
        return require('gzip-js').zip( fileContents, {} ).length;
      },
      zip: function( fileContents ) {
        var zip = new require('node-zip')();
        zip.file( 'index.html', fileContents );
        return zip.generate({ base64:false, compression:'DEFLATE' }).length;
      }
    }
  }
};
