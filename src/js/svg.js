var SVG = subclass({
  ns: 'http://www.w3.org/2000/svg',
  construct: function( tag ){
    this.elem = document.createElementNS( this.ns, tag );
  },
  attr: function( key, val ){
    this.elem.setAttributeNS( null, key, val );
  },
  destruct: function(){

  }
});
