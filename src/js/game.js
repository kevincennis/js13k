// control everything
var Game = {
  start: function(){
    Game.setup();
    // the intial timestamp
    Game.started = Date.now();
    // begin time stepping...
    Game.pause();
  },
  paused: true,
  pause: function(){
    if ( Game.paused ){
      Game.paused = false;
      Game.ticked = Date.now();
      Game.loop();
    }
    else Game.paused = true;
  },
  step: function( delta ){
    // update Physics calculations
    Physics.motion( delta );
    Physics.collisions();
    // update element positions
    Physics.render();
  },
  loop: function(){
    if ( Game.paused ){
      return;
    }
    var now = Date.now(), delta;
    // console.log( now );
    if ( Game.ticked ){
      // how much time has elapsed
      delta = now - Game.ticked;
      Game.step( delta );
    }
    Game.ticked = now;
    // recurse...
    reqAnimFrame( Game.loop );
  },
  setup: function(){
    var p, r = Physic.prototype.r * 3, x, y = r, max = 20, i;

    Physics.init();

    // create some new particles and make sure they don't start
    // out colliding
    while ( y < Physics.height - r ) {
      for ( i = 0, x = r; x < Physics.width - r; x += r ) {
        if ( Physics.bodies.length >= max ) {
          return;
        }
        p = new Physic('#'+ Math.round( 0x111 + 0xEEE * Math.random() ).toString(16) );
        p.pos.set( x, y );
        p.last.set( x, y );
      }
      y += r;
    }

    // simple dead-on collision
    // var obj1 = new Physic('#137');
    // obj1.pos = new Vect( 100, 100 );
    // obj1.vel = new Vect( .25, 0 );
    // var obj2 = new Physic('#713');
    // obj2.pos = new Vect( 700, 100 );
    // obj2.vel = new Vect( -.25, 0 );
  }
};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

