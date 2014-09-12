var fs = require('fs');

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
        var zip = new require('node-zip')(), file;
        zip.file( 'index.html', fileContents );
        file = zip.generate({ base64:false, compression:'DEFLATE' })
        fs.writeFileSync('dist/js13k.zip', file, 'binary');
        return file.length;
      }
    }
  }
};
