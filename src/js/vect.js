
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
  // addition
  add: function( vect ){
    return this.set( this.x + vect.x, this.y + vect.y );
  },
  // subtraction
  sub: function( vect ){
    return this.set( this.x - vect.x, this.y - vect.y );
  },
  // multiply by scalar
  mult: function( f ){
    return this.set( this.x * f, this.y * f );
  },
  // divide by scalar
  div: function( d ){
    return this.set( this.x / d, this.y / d );
  },
  // magnitude
  length: function(){
    return Math.sqrt( this.x * this.x + this.y * this.y );
  },
  // normalize to a unit vector
  norm: function(){
    var len = this.length();
    return this.set(
      this.x / len,
      this.y / len
    );
  },
  // rotate the vector to perpindicular
  rotate: function(){
    return this.set( -this.y, this.x );
  },
  // dot product
  dot: function( vect ){
    return this.x * vect.x + this.y * vect.y;
  },
  // copy into a new vector instance
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
