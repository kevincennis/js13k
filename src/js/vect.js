
// 2 dimensional vector class
var Vect = subclass({
  x: 0, y: 0,
  construct: function( x, y ){
    this.set( x, y );
  },
  set: function( x, y ){
    if ( isNum( x ) ){
      this.x = _num( x, 0, Physics.width );
    }
    if ( isNum( y ) ){
      this.y = _num( y, 0, Physics.height );
    }
    return this;
  },
  add: function( x, y ){
    return this.set( this.x + x, this.y + y );
  },
  subtract: function( x, y ){
    return this.set( this.x - x, this.y - y );
  },
  multiply: function( x, y ){
    return this.set( this.x * x, this.y * y );
  },
  divide: function( x, y ){
    return this.set( this.x / x, this.y / y );
  },
  clone: function(){
    return new Vect( this.x, this.y );
  }
});

// ensure valid vector values
function _num ( n, min, max ){
  // validate the value
  if ( isNaN( n ) === true ){
    throw new Error('NaN in Vect');
  }
  if ( isFinite( n ) === false ){
    throw new Error('Infinity in Vect');
  }
  // fix flotaing point errors
  return Math.round( n * 1e6 ) / 1e6;
}
