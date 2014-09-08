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
    // Render.fg.draw( Render.hexgrid );
    Render.fx.fill();
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
    // window.onscroll = function(){
    //   var total_dist = Physics.height + 10 - Render.stars.h;
    //   var percent = Math.min( window.pageYOffset / ( Physics.height+10-screen.height), 1 );
    //   var dist = percent * total_dist;
    //   console.log( total_dist, percent, dist );
    //   Render.stars.style({
    //     top:  dist + 'px'
    //   });
    // };
    Physics.init();
    Render.init();
    // Game.load( level[3] );
    var r = 32;
    // while ( Physics.bodies.length < 400 ){
    //  new Physic(r);
    // }

    new Physic( 'air', 507.5, 338.5, 39 );

    new Physic( 'water', 468.5, 271, 39 );
    new Physic( 'water', 546.5, 271, 39 );

    new Physic( 'water', 429.5, 203.5, 39 );
    new Physic( 'earth', 507.5, 203.5, 39 );
    new Physic( 'water', 585.5, 203.5, 39 );

    new Physic( 'air', 390.5, 136, 39 );
    new Physic( 'water', 468.5, 136, 39 );
    new Physic( 'water', 546.5, 136, 39 );
    new Physic( 'air', 624.5, 136, 39 );

    // simple dead-on collision
    // Physic.prototype.dens = 10;
    var obj1 = new Physic( 'fire', 507.5, 428.5, 39 );
    obj1.vel.set( 0, 3 ); //Math.random()-.5
  },
  // render a level...
  load: function( arr ){
    // for ( var i = 0; i < arr.length; i++ ){
    //   Physic.apply( this, arr[i] );
    // }
    var elems = ['air','water','earth'];
    var r = 39, w = 16, h = 8, y, x;
    // row...
    for ( y = 0; y < h; y++ ){
      // column...
      for ( x = 0; x <= w; x++ ){
        // bitmask...
        if ( arr[ y ] & ( 1 << x ) ){
          new Physic(
            elems[ Math.round( Math.random() * 2 ) ],
            .5 + Math.round( ( x * 2 * r + r ) / 78 ) * 78,
            .5 + Math.round( ( y * 2 * r + r ) / 90 ) * 90,
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

