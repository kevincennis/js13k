module.exports = {
  test: {
    options: {
      banner: 'define([], function() {\n\n',
      footer: '\n});\n'
    },
    src: [
      'test/shims/**/*.js',
      'test/tests/**/*.js'
    ],
    dest: 'test/test.js'
  }
};
