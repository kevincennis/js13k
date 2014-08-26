
// physics manager
var Physics = {
  width: 800,
  height: 400,
  init: function(){
    // this.dom = new SVG('svg');
    // this.dom.attr('width', this.width );
    // this.dom.attr('height', this.height );
    // document.body.appendChild( this.dom.elem );
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild( this.canvas );
  },
  // all interacting objects
  bodies: [],
  // iterate all bodies
  each: function( callback ){
    for ( var i=0, len = Physics.bodies.length; i<len; i++){
      if ( Physics.bodies[i] != null ){
        callback( Physics.bodies[i], i );
      }
    }
  },
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
    var checked = {}, i, j, len = Physics.bodies.length, body, obj;
    for ( i = 0; i < len; i++ ){
      if ( Physics.bodies[i] != null ){
        body = Physics.bodies[i];
        for ( j = 0; j < len; j++ ){
          if ( Physics.bodies[j] != null ){
            obj = Physics.bodies[j];
            // don't conflict with yourself or if it was already checked
            if ( body === obj || checked[ obj.index +':'+ body.index ] ){
              continue;
            }
            // collision detected...
            if ( Physics.overlap( body, obj ) === true ){
              // console.log( Physics.overlap( body, obj ), body, obj );
              // body.dom.attr('fill','#731');
              Physics.impulse( body, obj );
            }
            checked[ body.index +':'+ obj.index ] = true;
          }
        }
        body.worlds_collide();
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
    this.ctx.clearRect( 0, 0, this.width, this.height );
    for ( var i=0, len = Physics.bodies.length; i<len; i++){
      if ( Physics.bodies[i] != null ){
        // Physics.bodies[i].render();
        Physics.bodies[i].draw( this.ctx );
      }
    }
  }
};

// a base class for physics bodies
var Physic = subclass({
  r: 4, // radius
  fill: '#137',
  // world registration
  construct: function(){
    // initialize vectors
    this.pos = new Vect(
      this.r + Math.random() * ( Physics.width - 2 * this.r ),
      this.r + Math.random() * ( Physics.height - 2 * this.r )
    );
    this.vel = new Vect( Math.random()/2, Math.random()/2 );
    this.acc = new Vect( 0, .005 );
    this.init.apply( this, arguments );
    this.index = Physics.bodies.push( this ) - 1;
  },
  // no-op, override in subclasses
  init: function( c ){
    // this.create( c );
    this.fill = c;
  },
  // inject an svg element
  create: function( c ){
    this.dom = new SVG('circle');
    this.dom.attr('r', this.r );
    this.dom.attr('fill', c || '#137');
    Physics.dom.elem.appendChild( this.dom.elem );
  },
  // move the properties a step of time (+/-)
  step: function( dt ){
    // calculate the velocity
    // if ( Math.abs( this.vel.x ) < 1e-2 ){
    //  this.vel.x = 0;
    // }
    // else this.vel.x += this.acc.x * dt;
    // if ( Math.abs( this.vel.y ) < 1e-2 ){
    //  this.vel.y = 0;
    // }
    // else this.vel.y += this.acc.y * dt;
    // calculate the velocity
    // this.vel.add( this.acc.x * dt, this.acc.y * dt );
    // calculate the position
        this.pos.add( this.vel.x * dt, this.vel.y * dt );
        // console.log( this.vel );
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
  },
  // physical properties
  pos: { x:0, y:0 }, // position
  vel: { x:0, y:0 }, // velocity
  acc: { x:0, y:0 }, // acceleration
  dens: .5, // density
  rest: 1, // restitution
  mass: 1, // mass ( volume * density )
});
