
// physics manager
var Physics = {
  width: 1024,
  height: 512,
  init: function(){

  },
  // all interacting objects
  bodies: [],
  // time step all bodies in motion, detect and resolve collisions
  motion: function( dt ){
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
        obj1.step( dt );
        obj1.draw( Render.fg.ctx );
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



    // Calculate relative velocity

    var pos_norm = a.pos.clone().sub( b.pos ).norm();

    // Calculate relative velocity in terms of the normal direction
    var velAlongNormal = pos_norm.dot( a.vel.clone().sub( b.vel ) );

    // Do not resolve if velocities are separating
    if ( velAlongNormal > 0 ){
      return;
    }
    // Calculate restitution
    var e = Math.min( a.rest, b.rest );

    // Calculate impulse scalar
    var j = -( 1 + e ) * velAlongNormal;
    j /= a.inv_mass + b.inv_mass;

    // Apply impulse
    var impulse = pos_norm.clone().mult( j );
    a.vel.add( impulse.clone().mult( a.inv_mass ) );
    b.vel.sub( impulse.clone().mult( b.inv_mass ) );
    // position correction for overlaps
    var percent = 0.5, // usually 20% to 80%
    slop = 0.1, // usually 0.01 to 0.1
    penetration = a.r + b.r - a.pos.clone().sub( b.pos ).length(),
    depth = Math.max( penetration - slop, slop ),
    correction = pos_norm.mult( ( depth / ( a.inv_mass + b.inv_mass ) ) * percent );

    a.force.add( correction.clone().mult( a.inv_mass ) );
    b.force.sub( correction.clone().mult( b.inv_mass ) );

  }

};

// a base class for physics bodies
var Physic = subclass({

  // physical properties
  r: 32, // radius
  pos: { x:0, y:0 }, // position - coordinate vector
  vel: { x:0, y:0 }, // velocity - change in position
  force: { x:0, y:0 }, // additional applied forces
  dens: .5, // density
  rest: .75, // restitution
  fric: .005, // friction
  mass: null, // mass ( volume * density ) calculated

  // world registration
  construct: function( x, y, r ){
    this.r = r || this.r;
    this.mass = Math.PI * this.r * this.r * this.dens;
    this.inv_mass = 1 / this.mass;
    // initialize vectors
    this.pos = new Vect( x, y );
    this.vel = new Vect(0,0);
    this.acc = new Vect(0,0);
    this.force = new Vect(0,0);
    this.init.apply( this, arguments );
    this.index = Physics.bodies.push( this ) - 1;
  },
  // no-op, override in subclasses
  init: function(){ },

  // move the properties a step of time (+/-)
  step: function( dt ){
    // the object is moving...
    if ( this.vel.dot() > 0 ){
      // apply a change in velocity due to friction
      this.vel.mult( 1-this.fric ).min( 1e-3 );
      // calculate the change in position
      this.pos.add( this.vel.clone().mult( dt ) );
    }
    this.pos.add( this.force );
    // console.log( this.vel );
    this.force.x = 0;
    this.force.y = 0;
  },

  // collide with the world boundaries
  worlds_collide: function(){
    // north
    if ( this.pos.y < this.r ){
      this.vel.y = Math.abs( this.vel.y );
      this.force.y = this.r - this.pos.y;
    }
    // south
    if ( this.pos.y > Physics.height - this.r ){
      this.vel.y = -Math.abs( this.vel.y );
      this.force.y = Physics.height - this.r - this.pos.y;
    }
    // east
    if ( this.pos.x > Physics.width - this.r ){
      this.vel.x = -Math.abs( this.vel.x );
      this.force.x = Physics.width - this.r - this.pos.x;
    }
    // west
    if ( this.pos.x < this.r ){
      this.vel.x = Math.abs( this.vel.x );
      this.force.x = this.r - this.pos.x;
    }
  },
  // draw the shape on a canvas context
  draw: function( ctx ){
      ctx.drawImage(
        master_circle( this.r ), // source
        this.pos.x - this.r, // x pos
        this.pos.y - this.r // y pos
      );
      Render.map.ctx.beginPath();
      Render.map.ctx.arc( this.pos.x/16, this.pos.y/16, this.r/16, 0, 2 * Math.PI, false);
      Render.map.ctx.fillStyle = 'rgba(11,30,77,1)';
      Render.map.ctx.fill();
      Render.map.ctx.closePath();
  },
  // world deregistration
  destruct: function(){
    delete Physics.bodies[ this.index ];
  }
});

function master_circle ( r ){
  if ( !master_circle[r] ){
    master_circle[r] = new Canvas()
      .size( 2*r, 2*r )
      .draw(function( ctx ){
        // circle fill...
        ctx.beginPath();
        ctx.arc( r, r, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(11,30,77,.25)';
        ctx.fill();
        ctx.closePath();
        // circle stroke...
        ctx.beginPath();
        ctx.arc( r, r, r-1, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.closePath();
        // circle inset...
        ctx.beginPath();
        // var angle = 2 * Math.PI / 3;
        // ctx.moveTo( r + Math.sin( 0 * angle ) * (r/3), r + Math.cos( 0 * angle ) * (r/3) );
        // ctx.lineTo( r + Math.sin( 1 * angle ) * (r/3), r + Math.cos( 1 * angle ) * (r/3) );
        // ctx.lineTo( r + Math.sin( 2 * angle ) * (r/3), r + Math.cos( 2 * angle ) * (r/3) );
        // ctx.lineTo( r + Math.sin( 0 * angle ) * (r/3), r + Math.cos( 0 * angle ) * (r/3) );
        // ctx.closePath();
        // ctx.lineWidth = 2;
        // ctx.lineJoin = 'round';
        // ctx.strokeStyle = '#000';
        // ctx.stroke();
      });
  }
  return master_circle[r].elem;
}

