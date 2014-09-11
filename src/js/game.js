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
    Render.fx.fill();
    Render.map.clear();
    // update Physics calculations
    Physics.motion( delta );
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

    Game.dragStartMouse = new Vect( 0, 0 );
    Game.dragStartPos = new Vect( 0, 0 );
    Game.dragLastPos = new Vect( 0, 0 );
    Game.bindEvents();

    Game.load( level[0] );
  },
  // render a level...
  load: function( level ){

    // render the playing field along hexgrid...
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

    // render the batters box
    for ( var i = 0; i < level.balls.length; i++ ){
      new Physic(
        level.balls[i],
        39 + 39 * 2 * i,
        Physics.height-39,
        38
      );
    }

  },

  bindEvents: function() {
    // drag start
    Render.fg.elem.addEventListener('mousedown', function( e ) {
      if ( Game.paused ){
        Game.pause();
      }
      var i = 0, len = Physics.bodies.length, body, a, b, c;
      if ( e.pageY > Physics.height - 200 ) {
        for ( ; i < len; ++i ) {
          body = Physics.bodies[ i ];
          if ( body && !body.active ) {
            a = ( e.pageX - 10 ) - body.pos.x;
            b = ( e.pageY - 10 ) - body.pos.y;
            c = a * a + b * b;
            if ( c <= body.r * body.r ) {
              body.launching = false;
              Game.dragging = body;
              Game.dragLastTime = Date.now();
              Game.dragCurrTime = Date.now();
              Game.dragStartMouse.set( e.pageX - 10, e.pageY - 10 );
              Game.dragStartPos.set( body.pos.x, body.pos.y );
              Game.dragLastPos.set( body.pos.x, body.pos.y );
              return;
            }
          }
        }
      }
      Game.dragging = false;
    }, false);
    // drag
    window.addEventListener('mousemove', function( e ) {
      var body, dt, dx, dy;
      if ( body = Game.dragging ) {
        dt = Date.now() - Game.dragTime;
        dx = ( e.pageX - 10 ) - Game.dragStartMouse.x;
        dy = ( e.pageY - 10 ) - Game.dragStartMouse.y;
        Game.dragLastTime = Game.dragCurrTime;
        Game.dragCurrTime = Date.now();
        Game.dragLastPos.set( body.pos.x, body.pos.y );
        body.pos.set(
          Math.max( body.r, Math.min( Physics.width - body.r, Game.dragStartPos.x + dx ) ),
          Math.min( Physics.height - body.r, Game.dragStartPos.y + dy )
        );
        if ( body.pos.y < Physics.height - 200 ){
          Game.release();
        }
      }
    }, false);
    // dragend
    window.addEventListener('mouseup', Game.release, false);
  },

  release: function(){
    var now = Date.now(), body = Game.dragging, dt, dx, dy;
    if ( !Game.dragging ) {
      return;
    }
    Game.dragging = null;
    body.launching = true;
    if ( now - Game.dragCurrTime > 50 ) {
      return;
    }
    dt = ( Game.dragCurrTime - Game.dragLastTime );
    dx = body.pos.x - Game.dragLastPos.x;
    dy = body.pos.y - Game.dragLastPos.y;
    body.vel.set( ( dx / dt ) || 0, ( dy / dt ) || 0 );
    body.vel.x = body.vel.x > 0 ? Math.min( body.vel.x, 3 ) : Math.max( body.vel.x, -3 );
    body.vel.y = body.vel.y > 0 ? Math.min( body.vel.y, 3 ) : Math.max( body.vel.y, -3 );
  }
};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
