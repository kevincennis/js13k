
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


    var cr = Math.min( a.rest, b.rest );

    var unit_normal = a.pos.clone().sub( b.pos ).norm(),
    unit_tangent = unit_normal.clone().rotate();

    var anorm = unit_normal.dot( a.vel );
    var bnorm = unit_normal.dot( b.vel );

    var anorm2 = cr * ( anorm * (a.mass - b.mass) + 2 * b.mass * bnorm) / (a.mass + b.mass);
    var bnorm2 = cr * ( bnorm * (b.mass - a.mass) + 2 * a.mass * anorm) / (a.mass + b.mass);

    var avect1 = unit_normal.clone().mult( anorm2 );
    var bvect1 = unit_normal.clone().mult( bnorm2 );

    var avect2 = unit_tangent.clone().mult( unit_tangent.dot( a.vel ) );
    var bvect2 = unit_tangent.clone().mult( unit_tangent.dot( b.vel ) );

    a.vel = avect1.add( avect2 );
    b.vel = bvect1.add( bvect2 );

    // positional correction of overlaps
    a.force.set( unit_normal.x, unit_normal.y );
    b.force.set( -unit_normal.x, -unit_normal.y );
    // Game.pause();
  },
  render: function(){
    Physics.ctx.clearRect( 0, 0, Physics.width, Physics.height );
    // Physics.ctx.fillStyle = 'rgba(255,255,255,.2)';
    // Physics.ctx.fillRect( 0, 0, Physics.width, Physics.height );
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
  rest: .75, // restitution
  mass: 1, // mass ( volume * density )

  // world registration
  construct: function(r){
    this.r = r || this.r;
    this.mass = Math.PI * this.r * this.r * this.dens;
    // initialize vectors
    this.pos = new Vect(
      this.r + Math.random() * ( Physics.width - 2 * this.r ),
      this.r + Math.random() * ( Physics.height - 2 * this.r )
    );
    this.vel = new Vect();// Math.random()/2-.25, Math.random()/2-.25 );
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
    this.vel.add( this.acc );
    // calculate the change in position
    this.pos.add( this.vel.clone().mult( dt ) ).add( this.force );
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
  },
  // world deregistration
  destruct: function(){
    delete Physics.bodies[ this.index ];
  }
});

function master_circle ( r ){
  if ( !master_circle[r] ){
    master_circle[r] = document.createElement('canvas');
    var ctx = master_circle[r].getContext('2d');

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
  }
  return master_circle[r];
}

