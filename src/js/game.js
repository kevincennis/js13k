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
    Game.load( level[0] );

    // while ( Physics.bodies.length < 400 ){
    //  new Physic(r);
    // }



    // simple dead-on collision
    // Physic.prototype.dens = 10;
    var obj1 = new Physic( FIRE, 507.5, 828.5, 39, true );
    obj1.vel.set( 0, 1.5 ); //Math.random()-.5
  },
  // render a level...
  load: function( level ){
    var rows = 11, cols, r = 39, d = 2*r, h = 2*d/root3, x, y, obj;
    for ( var row = 0; row < rows; row++ ){
      cols = row % 2 ? 13 : 12;
      x = row % 2 ? r : d;
      y = h/2 + (3*h/4) * row;
      if ( !level.field[ row ] ) break;
      for ( var col = 0; col < cols; col++ ){
        if ( obj = level.field[ row ][ col ] ){
          new Physic( obj, x + d * col, y, r-1, true );
        }
      }
    }


    // // render the playing field...
    // for ( var i = 0; i < level.field.length; i++ ){
    //   new Physic(
    //     level.field[i][0],
    //     level.field[i][1],
    //     level.field[i][2],
    //     level.field[i][3],
    //     true
    //   );
    // }
    // render the batters box
    for ( var i = 0; i < level.balls.length; i++ ){
      new Physic(
        level.balls[i],
        39 + 39 * 2 * i,
        Physics.height-39,
        38
      );
    }

  }
};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

