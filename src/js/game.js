// control everything
var Game = {
  start: function(){
    Music.init();
    Render.init();
    Game.bindEvents();
    // begin the next level
    Game.load( localStorage.getItem('level') || 0 );
    Music.play();
  },
  lvl: 0,
  level: null,
  paused: true,
  pause: function(){
    if ( Game.paused ){
      Game.paused = false;
      Game.ticked = 0;
      reqAnimFrame( Game.loop );
      // Music.play();
    }
    else {
      Game.paused = true;
    }
  },
  step: function( delta ){
    Render.fg.clear();
    Render.fx.fill();
    Render.map.clear();
    // update Physics calculations
    Physics.motion( delta );
  },
  loop: function( timestamp ){
    if ( Game.level.solved ){
      Render.message('COMPLETE','click to continue');
      return;
    }
    if ( Game.paused ){
      Render.message('PAUSED','click to resume');
      // Music.stop();
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

  // render a level...
  load: function( num ){
    Physics.reset();
    // Music.play();
    Render.fg.clear();
    // read and bump the level number
    num = Game.lvl = num || ++Game.lvl;
    // load level data
    Game.level = level[ num ];
    localStorage.setItem( 'level', num );
    // prepare the playing field along hexgrid...
    var rows = 11, cols, r = Physics.width/26, d = 2*r, h = 2*d/root3, x, y, obj;
    for ( var row = 0; row < rows; row++ ){
      cols = row % 2 ? 13 : 12;
      x = row % 2 ? r : d;
      y = h/2 + (3*h/4) * row;
      if ( !Game.level.field[ row ] ) break;
      for ( var col = 0; col < cols; col++ ){
        if ( obj = Game.level.field[ row ][ col ] ){
          new Physic( obj, x + d * col, y, r-1, true );
        }
      }
    }
    // prepare the batters box
    for ( var i = 0; i < Game.level.balls.length; i++ ){
      new Physic(
        Game.level.balls[i],
        r + r * 2 * i,
        Physics.height-r,
        r-1
      );
    }
    // show a message...
    Render.message('Level '+ num, 'click to start' );
  },
  // check the matter against the goal
  solution: function( obj ){
    // look for successful completion
    var complete = true;
    if ( Game.level.solve.fire > obj[ FIRE ] ){
      complete = false;
    }
    if ( Game.level.solve.air > obj[ AIR ] ){
      complete = false;
    }
    if ( Game.level.solve.water > obj[ WATER ] ){
      complete = false;
    }
    if ( Game.level.solve.earth > obj[ EARTH ] ){
      complete = false;
    }
    if ( complete === true ){
      Game.paused = true;
      Game.level.solved = true;
      return;
    }
    // look for unresolvable conditions...

  },

  bindEvents: function() {
    window.onblur = function(){
      Game.paused = true;
    };
    // initialize interaction props
    Game.dragStartMouse = new Vect( 0, 0 );
    Game.dragStartPos = new Vect( 0, 0 );
    Game.dragLastPos = new Vect( 0, 0 );
    // drag start
    Render.fg.elem.addEventListener('mousedown', function( e ) {
      if ( Game.level.solved ){
        Game.load();
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
              body.vel.x = body.vel.y = 0;
              // unpause/resume
              if ( Game.paused ){
                Game.pause();
              }
              return;
            }
          }
        }
      }
      Game.dragging = false;
      Game.pause();
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
    var now = Date.now(), body = Game.dragging, dt, dx, dy,
      limit = 3, ratio = 1;
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

    // speed limits
    if ( Math.abs( body.vel.x ) > limit ) {
      ratio = limit / Math.abs( body.vel.x );
    } else if ( Math.abs( body.vel.y ) > 1 ) {
      ratio = limit / Math.abs( body.vel.y );
    }

    body.vel.mult( ratio );
    // body.vel.x = body.vel.x > 0 ? Math.min( body.vel.x, 3 ) : Math.max( body.vel.x, -3 );
    // body.vel.y = body.vel.y > 0 ? Math.min( body.vel.y, 3 ) : Math.max( body.vel.y, -3 );
  }
};

// animation
var reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
