
// physics manager
var Physics = {
  width: 1014,
  height: 1170,
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
              // if ( obj1.type == 'air' && obj2.type == 'fire' ){
              //   obj1.type = 'fire';
              //   obj2.destruct();
              // }
              // if ( obj1.type == 'fire' && obj2.type == 'air' ){
              //   obj2.type = 'fire';
              //   obj2.destruct();
              // }
              // if ( obj1.type == 'water' && obj2.type == 'fire' ){
              //   obj1.destruct();
              //   obj2.destruct();
              // }
              // if ( obj1.type == 'fire' && obj2.type == 'water' ){
              //   obj1.destruct();
              //   obj2.destruct();
              // }
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
  construct: function( type, x, y, r ){
    this.type = type;
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
        master_circle( this.r, this.type ), // source
        this.pos.x - this.r, // x pos
        this.pos.y - this.r // y pos
      );
      // update the minimap
      Render.map.ctx.beginPath();
      Render.map.ctx.arc( this.pos.x/8, this.pos.y/8, this.r/8, 0, 2 * Math.PI, false);
      Render.map.ctx.fillStyle = Render.colors[ this.type ];
      Render.map.ctx.fill();
      Render.map.ctx.closePath();
      // update the background effects
      Render.fx.ctx.lineWidth = 2;
      Render.fx.ctx.strokeStyle = Render.colors[ this.type ];
      Render.fx.ctx.shadowOffsetX = 0;
      Render.fx.ctx.shadowOffsetY = 0;
      Render.fx.ctx.shadowBlur = 8;
      Render.fx.ctx.shadowColor = Render.colors[ this.type ];

      Render.fx.ctx.beginPath();
      Render.fx.ctx.arc( this.pos.x, this.pos.y, this.r, 0, twoPI, false);
      Render.fx.ctx.stroke();
      Render.fx.ctx.closePath();

      Render.fx.ctx.shadowBlur = 0;
  },
  // world deregistration
  destruct: function(){
    delete Physics.bodies[ this.index ];
  }
});

