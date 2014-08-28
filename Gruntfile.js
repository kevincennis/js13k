module.exports = function( grunt ) {

  grunt.initConfig({
    // read package.json
    pkg: grunt.file.readJSON('package.json'),
    // auto-build on /src changes
    watch: require('./build/config/watch'),
    // minify
    uglify: require('./build/config/uglify'),
    // concat
    concat: require('./build/config/concat'),
    // preprocess
    preprocess: require('./build/config/preprocess'),
    // web server
    connect: require('./build/config/connect'),
    // mocha tests
    'blanket_mocha': require('./build/config/mocha'),
    // compare size of generated files
    'compare_size': require('./build/config/comparesize')
  });

  // load npm plugins (all dependencies that match /^grunt/)
  require('load-grunt-tasks')( grunt );

  // default task
  grunt.registerTask( 'default', require('./build/tasks/default') );

};
