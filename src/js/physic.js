
// physics manager
var Physics = {
  width: 1024,
  height: 512,
  init: function(){
    Physics.canvas = document.createElement('canvas');
    document.body.appendChild( Physics.canvas );
    Physics.canvas.width = Physics.width;
    Physics.canvas.height = Physics.height;
    Physics.canvas.style.position = 'absolute';
    Physics.canvas.style.top = '1px';
    Physics.canvas.style.left = '1px';
    Physics.canvas.style.zIndex = 2;
    Physics.ctx = Physics.canvas.getContext('2d');
    // draw a separate background canvas...
    Physics.bgcanvas = document.createElement('canvas');
    document.body.appendChild( Physics.bgcanvas );
    Physics.bgcanvas.width = Physics.width+2;
    Physics.bgcanvas.height = Physics.height+2;
    Physics.bgcanvas.style.position = 'absolute';
    Physics.bgcanvas.style.top = '0px';
    Physics.bgcanvas.style.left = '0px';
    Physics.bgcanvas.style.zIndex = 1;
    var bg = Physics.bgcanvas.getContext('2d');
    bg.beginPath();
    // vertical lines
    for ( var i = 1; i < Physics.width+2; i+=32 ){
      bg.moveTo( i, 0 );
      bg.lineTo( i, Physics.height );
    }
    // horizontal lines
    for ( var i = 1; i < Physics.height+2; i+=32 ){
      bg.moveTo( 0, i );
      bg.lineTo( Physics.width, i );
    }
    bg.lineWidth = .5;
    bg.strokeStyle = 'rgba(0,0,0,.25)';
    bg.stroke();
    bg.closePath();
  },
  // all interacting objects
  bodies: [],
  // time step all bodies in motion
  motion: function( dt ){
    // dt /= 1;
    for ( var i=0, len = Physics.bodies.length; i<len; i++){
      if ( Physics.bodies[i] != null ){
        Physics.bodies[i].step( dt );
      }
    }
  },
  // detect and resolve collisions
  collisions: function(){
    var i, j, len = Physics.bodies.length, obj1, obj2;
    for ( i = 0; i < len; i++ ){
      if ( Physics.bodies[i] != null ){
        obj1 = Physics.bodies[i];
        for ( j = i + 1; j < len; j++ ){
          if ( Physics.bodies[j] != null ){
            obj2 = Physics.bodies[j];
            // collision detected...
            if ( Physics.overlap( obj1, obj2 ) === true ){
              Physics.impulse( obj1, obj2 );
            }
          }
        }
        obj1.worlds_collide();
      }
    }
  },
  // do two circles overlap?
  overlap: function( a, b ){
      var r = a.r + b.r,
      x = a.pos.x - b.pos.x,
      y = a.pos.y - b.pos.y;
      return r * r > x * x + y * y;
  },
  // http://en.wikipedia.org/wiki/Inelastic_collision#Formula
  impulse: function( a, b ) {
    var cr = Math.min( a.rest, b.rest ),
      uax = a.vel.x,
      ubx = b.vel.x,
      uay = a.vel.y,
      uby = b.vel.y,
      ma = a.mass,
      mb = b.mass,
      ax, ay, bx, by;

    ax = ( ( cr * mb * ( ubx - uax ) ) + ma * uax + mb * ubx ) / ( ma + mb );
    ay = ( ( cr * mb * ( uby - uay ) ) + ma * uay + mb * uby ) / ( ma + mb );

    bx = ( ( cr * ma * ( uax - ubx ) ) + mb * ubx + ma * uax ) / ( ma + mb );
    by = ( ( cr * ma * ( uay - uby ) ) + mb * uby + ma * uay ) / ( ma + mb );

    a.vel.set( ax, ay );
    b.vel.set( bx, by );

  },
  render: function(){
    Physics.ctx.clearRect( 0, 0, Physics.width, Physics.height );
    for ( var i=0, len = Physics.bodies.length; i<len; i++){
      if ( Physics.bodies[i] != null ){
        // Physics.bodies[i].render();
        Physics.bodies[i].draw( Physics.ctx );
      }
    }
  }
};

// a base class for physics bodies
var Physic = subclass({

  // physical properties
  r: 32, // radius
  pos: { x:0, y:0 }, // position - coordinate vector
  vel: { x:0, y:0 }, // velocity - change in position
  acc: { x:0, y:0 }, // acceleration - change in velocity
  force: { x:0, y:0 }, // additional applied forces
  dens: .5, // density
  rest: 1, // restitution
  mass: 1, // mass ( volume * density )

  // world registration
  construct: function(r){
    this.r = r || this.r;
    // initialize vectors
    this.pos = new Vect(
      this.r + Math.random() * ( Physics.width - 2 * this.r ),
      this.r + Math.random() * ( Physics.height - 2 * this.r )
    );
    this.vel = new Vect( Math.random()/2-.25, Math.random()/2-.25 );
    this.acc = new Vect( 0, 0 );
    this.force = new Vect( 0, 0 );
    this.init.apply( this, arguments );
    this.index = Physics.bodies.push( this ) - 1;
  },
  // no-op, override in subclasses
  init: function(){ },

  // move the properties a step of time (+/-)
  step: function( dt ){
    // calculate any change in velocity
    this.vel.add( this.acc.x, this.acc.y );
    // calculate the change in position
    this.pos.add( this.vel.x * dt + this.force.x, this.vel.y * dt + this.force.y );
    // console.log( this.vel );
    this.force.x = 0;
    this.force.y = 0;
  },

  // collide with the world boundaries
  worlds_collide: function(){
    // north
    if ( this.pos.y < this.r ){
      this.vel.y = Math.abs( this.vel.y );
    }
    // south
    if ( this.pos.y > Physics.height - this.r ){
      this.vel.y = -Math.abs( this.vel.y );
    }
    // east
    if ( this.pos.x > Physics.width - this.r ){
      this.vel.x = -Math.abs( this.vel.x );
    }
    // west
    if ( this.pos.x < this.r ){
      this.vel.x = Math.abs( this.vel.x );
    }
  },
  // update svg element position
  render: function(){
    this.dom.attr('cx', this.pos.x );
    this.dom.attr('cy', this.pos.y );
  },
  // draw the shape on a canvas context
  draw: function( ctx ){
      ctx.beginPath();
      ctx.arc( this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000';
      ctx.stroke();
  },
  // world deregistration
  destruct: function(){
    delete Physics.bodies[ this.index ];
  }
});
