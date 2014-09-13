var root3 = Math.sqrt(3),
  twoPI = 2 * Math.PI,
  deg60 = twoPI / 6,
  deg120 = deg60 * 2,
  deg180 = deg60 * 3,
  deg240 = deg60 * 4,
  deg300 = deg60 * 5,
  deg360 = deg60 * 6;

var Render = {
  // layers of canvas...
  init: function(){
    // html fill...
    document.body.style.background = '#000000';
    // starfield background
    // Render.stars = new Canvas( document.body )
    //   .size( screen.width, Physics.height+220 )
    //   .css({
    //     position: 'absolute',
    //     top: '0px',
    //     left: '0px',
    //     zIndex: 2
    //   }).draw( Render.starfield );
    // background effects
    Render.fx = new Canvas( document.body )
      .size( Physics.width, Physics.height-200 )
      .css({
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        border: '1px solid rgba(128,128,255,.5)',
        marginBottom: '10px'
      })
      .set({
        fillStyle: 'rgba(0,0,0,.25)'
      })
      .path()
      .rect();
    // foreground
    Render.fg = new Canvas( document.body )
      .size( Physics.width, Physics.height )
      .css({
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 3,
        border: '1px solid rgba(128,128,255,.5)',
        background: 'url('+ Render.hexgrid( Physics.width/26 ) +') repeat'
      });
      });
    // // mini map
    // Render.map = new Canvas( document.body )
    //   .size( Physics.width/8, Physics.height/8 )
    //   .css({
    //     position: 'fixed',
    //     top: Physics.margin + 'px',
    //     left: ( Physics.width + 22 )+'px',
    //     zIndex: 4,
    //     border: Physics.border + 'px solid rgba(128,128,255,.5)',
    //     background: 'rgba(8,0,16,.5)',
    //   });
    // solution tracker
    Render.goal = new Canvas( document.body )
      .size( Physics.width/8, Physics.height * 7/8 -10 )
      .css({
        position: 'fixed',
        top: Math.round( Physics.height/8 + 20 )+'px',
        left: ( Physics.width + 22 )+'px',
        zIndex: 4,
        border: '1px solid rgba(128,128,255,.5)',
        background: 'rgba(8,0,16,.5)',
      });
  },
  message: function( msg, desc ){
    Render.fg.draw(function( ctx ){
      // dimesnions...
      var x = Physics.width/2, y = ( Physics.height - 200 )/2,
      w = Physics.width, h = Physics.height - 200;
      // background knockout...
      ctx.fillStyle = 'rgba(8,0,16,.5)';
      ctx.fillRect( x - w/2, y-h/2, w, h );
      // headline...
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(128,128,255,.75)';
      ctx.fillText( msg, x, y );
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(128,128,255,1)';
      ctx.strokeText( msg, x, y );
      // description...
      ctx.font = '18px monospace';
      ctx.fillText( desc, x, y + 36 );
    });
  },
  gradient: function( ctx, type, x, y, r ){
    var grad = ctx.createRadialGradient(x,y,1,x,y,r);
    // grad.addColorStop(1, Render.colors[ type ] );
    // grad.addColorStop(1, 'rgba(255,255,255,1)' );
    grad.addColorStop(1, 'rgba(0,0,0,1)');
    grad.addColorStop(.5, 'rgba(54,54,54,.5)');
    // grad.addColorStop(0, 'rgba(0,0,0,1)');
    return grad;
  },
  // isometric grid background image
  hexgrid: function( radius ){
    var diameter = 2 * radius,
    height = 2 * diameter / root3,
    // widths
    d0 = snap( 0 ),
    d50 = snap( diameter * .50 ),
    d100 = snap( diameter ),
    // heights...
    h0 = snap( -1 ),
    h25 = snap( height * .25 ),
    h50 = snap( height * .50 ),
    h75 = snap( height * .75 ),
    h100 = snap( height ),
    r = 1; // vertices
    return new Canvas()
      .size( Math.floor( diameter ), Math.floor( height ) )
      .set({
        lineWidth: 1,
        lineCap: 'square',
        strokeStyle: 'rgba(128,128,255,.25)',
        fillStyle: 'rgba(128,128,255,.25)'
      })
      .path()
      .move( d0, h0 )
      .line( d0, h100 )
      .line( d100, h50 )
      .line( d0, h0 )
      .move( d50, h0 )
      .line( d50, h100 )
      .move( d100, h0 )
      .line( d0, h50 )
      .line( d100, h100 )
      .stroke()
      .path()
      .move( d0, h0 ).circ( r )
      .move( d0, h50 ).circ( r )
      .move( d0, h100 ).circ( r )
      .move( d50, h25 ).circ( r )
      .move( d50, h75 ).circ( r )
      .move( d100, h0 ).circ( r )
      .move( d100, h50 ).circ( r )
      .move( d100, h100 ).circ( r )
      .fill()
      .url();
  },
  starfield: function( ctx ){
      this.path().set({ fillStyle: '#FFF' });
      for ( var i=0, n = Math.sqrt( this.w * this.h ); i < n; i++ ){
        this.move( Math.random() * this.w, Math.random() * this.h )
          .circ( Math.random() * 2 );
      }
      this.fill();
  },
  colors: {
    fire:  '#F73',
    air:   '#EEF',
    water: '#1AF',
    earth: '#3F8'
  }
};

function master_circle ( obj ){
  var r = obj.r, type = obj.type,
    x = r + 8, y = r + 8, m = 8;//r/3;
  if ( !master_circle[ r + type ] ){
    master_circle[ r + type ] = new Canvas()
      .size( 2 * x, 2 * y )
      .draw(function( ctx ){
        // circle fill...
        ctx.beginPath();
        ctx.arc( x, y, r, 0, twoPI, false);
        ctx.fillStyle = Render.gradient( ctx, type, x, y, r ); // 'rgba(0,0,0,.25)';
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = obj.color;
        ctx.stroke();
        // circle inset...
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // upward triangle
        if ( obj.mask & ( FIRE | AIR ) ){
          ctx.moveTo( x, y - m );
          ctx.lineTo( x - m * root3/2, y + m/2 );
          ctx.lineTo( x + m * root3/2, y + m/2 );
          ctx.lineTo( x, y - m );
          ctx.closePath();
        }
        // downward triangle
        if ( obj.mask & ( WATER | EARTH ) ){
          ctx.moveTo( x, y + m );
          ctx.lineTo( x - m * root3/2, y - m/2 );
          ctx.lineTo( x + m * root3/2, y - m/2 );
          ctx.lineTo( x, y + m );
          ctx.closePath();
        }
        // horizontal bar
        if ( obj.mask & ( EARTH | AIR ) ){
          ctx.moveTo( x - m * root3/2, y );
          ctx.lineTo( x + m * root3/2, y );
          ctx.closePath();
        }
        // dark outline
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000';
        ctx.stroke();
        // color line
        ctx.lineWidth = 2;
        ctx.strokeStyle = obj.color;
        ctx.stroke();
      });
  }
  return master_circle[ r + type ].elem;
}

function slave_circle ( obj, i ){
  var r = obj.r, type = obj.type,
  x = r + 12, y = r + 12;
  if ( !slave_circle[ r + type ] ){
    slave_circle[ r + type ] = new Canvas()
      .size( 2 * x, 2 * y )
      .set({
        lineWidth: 2,
        strokeStyle: obj.color,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 12,
        shadowColor: obj.color
      })
      .path()
      .circ( r, x, y )
      .stroke();
  }
  return slave_circle[ r + type ].elem;
}
