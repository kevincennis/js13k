window.requestAnimationFrame = function( fn ) {
  return setTimeout( fn, 1000 / 60 );
};

window.cancelAnimationFrame = function( n ) {
  clearTimeout( n );
};
