// control everything
var Game = {
  start: function(){
    Game.setup();
    // the intial timestamp
    Game.started = 0;
    // begin time stepping...
    Game.pause();
  },
  paused: true,
  pause: function(){
    if ( Game.paused ){
      Game.paused = false;
      Game.ticked = 0;
      reqAnimFrame( Game.loop );
    }
    else Game.paused = true;
  },
  step: function( delta ){
    Physics.collisions();
    // update Physics calculations
    Physics.motion( delta );
    // update element positions
    Physics.render();
  },
  loop: function( timestamp ){
    if ( Game.paused ){
      return;
    }
    if ( Game.ticked ){
      // how much time has elapsed
      delta = timestamp - Game.ticked;
      Game.step( delta );
    }
    Game.ticked = timestamp;
    // recurse...
    reqAnimFrame( Game.loop );
  },
  setup: function(){
    window.onblur = function(){
      Game.paused = true;
    };
    Physics.init();
    var r = 16;
    while ( Physics.bodies.length < 50 ){
     new Physic(r);
    }
    // simple dead-on collision
    var obj1 = new Physic(r);
    obj1.pos = new Vect( 256, 256 );
    obj1.vel = new Vect( .25, 0 );
    var obj2 = new Physic(r);
    obj2.pos = new Vect( 512, 224 );
    obj2.vel = new Vect( 0, 0 );
    // var obj3 = new Physic();
    // obj3.pos = new Vect( 768, 256 );
    // obj3.vel = new Vect( 0, 0 );
  }
};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

