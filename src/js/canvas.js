// canvas drawing abstraction
var Canvas = subclass({
  construct: function( parent ){
    this.elem = document.createElement('canvas');
    this.ctx = this.elem.getContext('2d');
    if ( parent ){
      parent.appendChild( this.elem );
    }
  },
  size: function( width, height ){
    this.w = this.elem.width = width;
    this.h = this.elem.height = height;
    return this;
  },
  style: function( obj ){
    extend.call( this.elem.style, obj || {} );
    return this;
  },
  draw: function( callback ){
    callback.call( this, this.ctx );
    return this;
  },
  clear: function(){
    this.ctx.clearRect( 0, 0, this.w, this.h );
  }
});
