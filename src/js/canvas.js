// canvas drawing abstraction
var Canvas = subclass({
  construct: function( parent ){
    this.x = this.y = this.w = this.h = 0;
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
  css: function( obj ){
    extend.call( this.elem.style, obj || {} );
    return this;
  },
  draw: function( callback ){
    callback.call( this, this.ctx );
    return this;
  },
  clear: function(){
    this.ctx.clearRect( 0, 0, this.w, this.h );
    return this;
  },
  circ: function( r, x, y ){
    this.ctx.arc( x || this.x, y || this.y, r, 0, twoPI, false );
    return this;
  },
  rect: function( x, y, w, h ){
    this.ctx.rect( x || this.x, y || this.y, w || this.w, h || this.h );
    return this;
  },
  move: function( x, y ){
    this.ctx.moveTo( this.x = x, this.y = y );
    return this;
  },
  line: function( x, y ){
    this.ctx.lineTo( this.x = x, this.y = y );
    return this;
  },
  set: function( opts ){
    extend.call( this.ctx, opts || {} );
    return this;
  },
  path: function(){
    this.ctx.closePath();
    this.ctx.beginPath();
    return this;
  },
  fill: function(){
    this.ctx.fill();
    return this;
  },
  stroke: function(){
    this.ctx.stroke();
    return this;
  },
  url: function(){
    return this.elem.toDataURL();
  }
});
