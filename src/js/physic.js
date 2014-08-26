
// physics manager
var Physics = {
  width: 800,
  height: 400,
  init: function(){
    this.dom = new SVG('svg');
    this.dom.attr('width', this.width );
    this.dom.attr('height', this.height );
    document.body.appendChild( this.dom.elem );
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
    Physics.each(function( body ){
      body.step( dt );
    });
  },
  // detect and resolve collisions
  collisions: function(){
    Physics.each(function( body ){
      Physics.each(function( obj ){
        // don't conflict with yourself
        if ( body === obj ) return;
        // collision detected...
        if ( Physics.overlap( body, obj ) === true ){
          // console.log( Physics.overlap( body, obj ), body, obj );
          body.dom.attr('fill','#731');
          // Physics.impulse( body, obj );
        }
      });
      body.worlds_collide();
    });
  },
  // do two circles overlap?
  overlap: function( a, b ){
      var r = a.r + b.r,
      x = a.pos.x - b.pos.x,
      y = a.pos.y - b.pos.y;
      return r * r > x * x + y * y;
  },
  impulse: function( a, b ) {
    var dotprod,
    // calculate relative velocity
    rel_vel_x = b.vel.x - a.vel.x,
    rel_vel_y = b.vel.y - a.vel.y,
    // calculate normal position
    rel_pos_x = b.pos.x - a.pos.x,
    rel_pos_y = b.pos.y - a.pos.y,
    // Calculate relative velocity in terms of the normal direction
    dotprod = rel_vel_x * rel_pos_x + rel_vel_y * rel_pos_y;
    console.log( dotprod );
    // Do not resolve if velocities are separating
    if ( dotprod > 0 ){
      return;
    }

    // Calculate restitution
    var e = Math.min( a.rest, b.rest );

    // Calculate impulse scalar
    var j = -(1 + e) * dotprod;
    // j /= 1 / a.mass + 1 / b.mass;

    // Apply impulse

    console.log( a.vel.x, j, rel_pos_x );
    Game.pause();
    a.vel.subtract( j * rel_pos_x, j * rel_pos_y );
    // b.vel.add( 1 / b.mass * impulse.x, 1 / b.mass * impulse.y );
  },
  // render all bodies
  render: function(){
    for ( var i=0, len = Physics.bodies.length; i<len; i++){
      if ( Physics.bodies[i] != null ){
        Physics.bodies[i].render();
      }
    }
  }
};

// a base class for physics bodies
var Physic = subclass({
  r: 8, // radius
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
  init: function(){
    this.create();
  },
  // inject an svg element
  create: function(){
    this.dom = new SVG('circle');
    this.dom.attr('r', this.r );
    this.dom.attr('fill','#137');
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
  // update element position
  render: function(){
    this.dom.attr('cx', this.pos.x );
    this.dom.attr('cy', this.pos.y );
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
