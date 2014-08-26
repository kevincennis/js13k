module.exports = {
  shims: {
    src: [
      'test/shims/**/*.js'
    ],
    dest: 'test/shims.js'
  },
  test: {
    options: {
      banner: 'define([], function() {\n\n',
      footer: '\n});\n'
    },
    src: [
      'test/tests/**/*.js'
    ],
    dest: 'test/test.js'
  }
};
