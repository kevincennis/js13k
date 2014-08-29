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
    Render.fg.clear();
    Render.map.clear();
    // update Physics calculations
    Physics.motion( delta );
    // update element positions
    // Render.fg.draw( Physics.render );
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
    Render.init();
    Game.load( level[1] );
    var r = 32;
    // while ( Physics.bodies.length < 400 ){
    //  new Physic(r);
    // }
    // simple dead-on collision
    var obj1 = new Physic( 768, 256, r );
    obj1.vel.set( -1, 0 );
  },
  // render a level...
  load: function( arr ){
    // for ( var i = 0; i < arr.length; i++ ){
    //   Physic.apply( this, arr[i] );
    // }
    var r = 32, w = 16, h = 8, y, x;
    // row...
    for ( y = 0; y < h; y++ ){
      // column...
      for ( x = 0; x <= w; x++ ){
        // bitmask...
        if ( arr[ y ] & ( 1 << x ) ){
          new Physic(
            x * 2 * r + r,
            y * 2 * r + r,
            r
          );
        }
      }
    }
  }

};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

