(function ( root, factory ) {

  // allow the file to be required as an AMD module
  if ( typeof define === 'function' && define.amd ) {
    define( [], factory );
  // otherwise just stick it on the global object
  } else {
    root.js13k = factory();
  }

}( this, function () {
