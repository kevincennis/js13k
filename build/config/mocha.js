module.exports = {
  dist: {
    options : {
      // test suite url
      urls: ['http://localhost:8080/test/index.html'],
      // allow console logs to reach the grunt console
      log: true,
      // log errors to the grunt console
      logErrors: true,
      // global threshold
      globalThreshold: 10,
      // per-file threshold (we only have 1 file, but this has to be defined)
      threshold : 10,
      // console reporter
      reporter: 'Dot'
    }
  }
};
