var props = {},
// bitmasks for element types...
FIRE = 1,
AIR = 2,
WATER = 4,
EARTH = 8;

// physics manager
var Physics = {
  width: 780,
  height: 860,
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
            if ( Physics.overlap( obj1, obj2 ) ){
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
      if ( !a.active || !b.active ){
        return false;
      }
      var r = a.r + b.r,
      x = a.pos.x - b.pos.x,
      y = a.pos.y - b.pos.y;
      return ( r * r ) > ( x * x + y * y );
  },
  // apply forces and interactions
  impulse: function( a, b ) {
    // vector direction between centers
    var pos_norm = a.pos.clone().sub( b.pos ).norm(),
    // Calculate relative velocity in terms of the normal direction
    velAlongNormal = pos_norm.dot( a.vel.clone().sub( b.vel ) ),
    // approximate the force of collision for matter transfer
    depth = Math.sqrt( velAlongNormal * velAlongNormal * a.mass * b.mass );
    depth = Math.max(
      Math.min( Math.PI * depth, a.area(), b.area() ), 1234
    );
    // matter interaction
    switch ( a.mask | b.mask ){
      case FIRE | WATER:
      case AIR | EARTH:
        a.area( -depth );
        b.area( -depth );
        break;
      case FIRE | AIR:
        a.area( a.mask & FIRE ? +depth : -depth );
        b.area( b.mask & FIRE ? +depth : -depth );
        break;
      case EARTH | FIRE:
        a.area( a.mask & EARTH ? +depth : -depth );
        b.area( b.mask & EARTH ? +depth : -depth );
        break;
      case WATER | EARTH:
        a.area( a.mask & WATER ? +depth : -depth );
        b.area( b.mask & WATER ? +depth : -depth );
        break;
      case AIR | WATER:
        a.area( a.mask & AIR ? +depth : -depth );
        b.area( b.mask & AIR ? +depth : -depth );
        break;
    }
    // Do not resolve if velocities are separating
    if ( velAlongNormal > 0 ){
      return;
    }

    // Calculate restitution
    var e = ( a.rest + b.rest ) / 2, // avg
    // Calculate impulse scalar
    j = -( 1 + e ) * velAlongNormal / ( a.inv_mass + b.inv_mass );
    // add to acceleration, as change in velocity
    impulse = pos_norm.clone().mult( j );
    // apply (repelling) impulse
    a.vel.add( impulse.clone().mult( a.inv_mass ) );
    b.vel.sub( impulse.clone().mult( b.inv_mass ) );

    // how much overlap...
    var penetration = a.r + b.r - a.pos.clone().sub( b.pos ).length(),
    percent = 0.5, // usually 20% to 80%
    slop = 1, // usually 0.01 to 0.1
    correction = Math.max( penetration - slop, slop );
    correction /= a.inv_mass + b.inv_mass;
    correction = pos_norm.mult( correction * percent );
    // positional correction for overlaps
    a.force.add( correction.clone().mult( a.inv_mass ) );
    b.force.sub( correction.clone().mult( b.inv_mass ) );

  }

};

props[ FIRE ] = {
  type: 'fire',
  color: '#F73',
  // dens: .3, // density
  // rest: .99, // restitution
  // fric: .001, // friction
};

props[ AIR ] = {
  type: 'air',
  color: '#EEF',
  // dens: .3, // density
  // rest: .88, // restitution
  // fric: .002, // friction
};

props[ WATER ] = {
  type: 'water',
  color: '#1AF',
  // dens: .5, // density
  // rest: .77, // restitution
  // fric: .003, // friction
};

props[ EARTH ] = {
  type: 'earth',
  color: '#3F8',
  // dens: .6, // density
  // rest: .66, // restitution
  // fric: .004, // friction
};

// a base class for physics bodies
var Physic = subclass({
  // identify the element...
  mask: 0,
  type: null,
  // physical properties
  r: 38, // radius
  min: 16, // minimum radius
  pos: { x:0, y:0 }, // position - coordinate vector
  vel: { x:0, y:0 }, // velocity - change in position
  force: { x:0, y:0 }, // additional applied forces
  dens: .6, // density
  rest: .9, // restitution
  fric: 0, // friction
  mass: null, // mass ( volume * density ) calculated

  // world registration
  construct: function( type, x, y, r, active ){
    this.mask |= type;
    this.r = r || this.r;
    this.set( props[ type ] );
    // initialize vectors
    this.pos = new Vect( x, y );
    this.vel = new Vect(0,0);
    this.acc = new Vect(0,0);
    this.force = new Vect(0,0);
    this.init.apply( this, arguments );
    this.index = Physics.bodies.push( this ) - 1;
    this.active = active || false;
    // is the body in the process of being flicked into play?
    this.launching = false;
  },
  set: function( opts ){
    extend.call( this, opts );
    if ( this.r > this.min ){
      this.mass = this.area() * this.dens;
      this.inv_mass = 1 / this.mass;
    }
  },
  // no-op, override in subclasses
  init: function(){ },

  // move the properties a step of time (+/-)
  step: function( dt ){
    if ( this.r < this.min ){
      this.destruct();
    }

    // the object is moving...
    if ( this.vel.dot() > 0 ){
      // apply a change in velocity due to friction
      // this.vel.mult( 1-this.fric ).min( 1e-3 );
      // calculate the change in position
      this.pos.add( this.vel.clone().mult( dt ) );
    }
    // make a "launching" body active once it enters the "real" world
    if ( this.launching && this.pos.y < Physics.height - 200 - this.r ) {
      this.active = true;
      this.launching = false;
    }
    this.pos.add( this.force );
    // console.log( this.vel );
    this.force.x = 0;
    this.force.y = 0;
  },

  // collide with the world boundaries
  worlds_collide: function(){
    if ( !this.active && !this.launching ){
      return;
    }
    // north
    if ( this.pos.y < this.r ){
      this.vel.y = Math.abs( this.vel.y );
      this.force.y = this.r - this.pos.y;
    }
    // south (doesn't apply to launching bodies)
    var south = this.launching ? Physics.height : Physics.height - 200;
    if ( this.pos.y > south - this.r ){
      this.vel.y = -Math.abs( this.vel.y );
      this.force.y = south - this.r - this.pos.y;
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
  // change the area by an amount +/-
  area: function( delta ){
    // current area...
    var area = Math.PI * this.r * this.r;
    if ( isNum( delta ) ){
      area = Math.max( this.min, area + delta );
      // calculate and set a new radius...
      this.set({r: Math.sqrt( area / Math.PI ) });
    }
    return area;
  },
  // draw the shape on a canvas context
  draw: function( ctx ){
      if ( this.r < this.min ){
        return;
      }
      ctx.drawImage(
        master_circle( this ), // source
        this.pos.x - this.r - 8, // x pos
        this.pos.y - this.r - 8 // y pos
      );
      // update the minimap
      Render.map.ctx.beginPath();
      Render.map.ctx.arc( this.pos.x/8, this.pos.y/8, this.r/8, 0, 2 * Math.PI, false);
      Render.map.ctx.fillStyle = this.color;
      Render.map.ctx.fill();
      Render.map.ctx.closePath();

      // update the background effects
      Render.fx.ctx.drawImage(
        slave_circle( this ), // source
        this.pos.x - this.r - 12, // x pos
        this.pos.y - this.r - 12 // y pos
      );
  },
  // world deregistration
  destruct: function(){
    delete Physics.bodies[ this.index ];
  }
});
