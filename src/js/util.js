
// object property extension
function extend (){
  // local vars, grumble grumble
  var args = arguments,
    len = args.length,
    target = this,
    key,
    obj,
    i;
  // iterate each argument
  for ( i = 0; i < len; i++ )
    // ensure truthiness
    if ( obj = args[i] )
      // iterate the props of each arg
      for ( key in obj )
        // only take local properties
        if ( obj.hasOwnProperty( key ) )
          // copy over the key/value
          target[ key ] = obj[ key ];
  // the extended object
  return target;
};

// create a subclass
function subclass (){
  // subclass constructor
  function Class (){
    var obj = this instanceof Class ? this : Object.create( Class.prototype );
    return obj.construct.apply( obj, arguments ) || obj;
  };
  // if the current scope is a constructor, set up the inheritance chain
  Class.prototype = typeof this == 'function' ?
    Object.create( this.prototype ) : {};
  // extend the prototype with any arguments, as mixins
  extend.apply( Class.prototype, arguments );
  // static method for reproduction
  Class.subclass = subclass;
  return Class;
};

// determine if something is of type number
function isNum ( val ){
  return typeof val === 'number';
}

// snap to the nearest 1/2 pixel, for crisp lines
function snap ( v ){
  return Math.round( v ) + 0.5;
};
