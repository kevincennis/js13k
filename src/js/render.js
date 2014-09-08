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
    document.body.style.background = '#08000F';
    // starfield background
    Render.stars = new Canvas( document.body )
      .size( screen.width, Physics.height+20 )
      .style({
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 2
      }).draw( Render.starfield );
    // background effects
    Render.fx = new Canvas( document.body )
      .size( Physics.width, Physics.height )
      .css({
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        border: '1px solid rgba(128,128,255,.25)',
        paddingBottom: '10px'
      })
      .set({
        fillStyle: 'rgba(8,0,16,.25)'
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
        background: 'url('+ Render.hexgrid( 39 ) +') repeat'
      });
    // mini map
    Render.map = new Canvas( document.body )
      .size( Physics.width/8, Physics.height/8 )
      .css({
        position: 'fixed',
        top: '10px',
        left: ( Physics.width + 22 )+'px',
        zIndex: 4,
        border: '1px solid rgba(128,128,255,.5)',
        background: 'rgba(8,0,16,.75)',
      });
  },
  gradient: function( ctx, type, r ){
    var grad = ctx.createRadialGradient(r,r,1,r,r,r);
    grad.addColorStop(1, Render.colors[ type ] );
    grad.addColorStop(0.95, 'rgba(0,0,0,1)');
    grad.addColorStop(0.4, 'rgba(42,42,42,.5)');
    grad.addColorStop(0, 'rgba(0,0,0,1)');
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
        strokeStyle: 'rgba(128,128,255,.75)',
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
  },
  // elemental icon shapes
  element: {
    fire: function( ctx, r ){
      // stroke style
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = Render.colors.fire;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(0,0,0,.75)";
      // up triangle
      ctx.beginPath();
      ctx.moveTo( r + Math.sin( deg300 ) * (r/4), r + Math.cos( deg300 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg60 ) * (r/4), r + Math.cos( deg60 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg180 ) * (r/4), r + Math.cos( deg180 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg300 ) * (r/4), r + Math.cos( deg300 ) * (r/4) );
      ctx.closePath();
      ctx.stroke();
    },
    air: function( ctx, r ){
      // stroke style
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = Render.colors.air;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(0,0,0,.75)";
      // up triangle with bar
      ctx.beginPath();
      ctx.moveTo( r + Math.sin( deg300 ) * (r/4), r + Math.cos( deg300 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg60 ) * (r/4), r + Math.cos( deg60 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg180 ) * (r/4), r + Math.cos( deg180 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg300 ) * (r/4), r + Math.cos( deg300 ) * (r/4) );
      ctx.moveTo( r + Math.sin( deg300 ) * (r/4), r + Math.cos( deg300 ) * (r/4) - r/5 );
      ctx.lineTo( r + Math.sin( deg60 ) * (r/4), r + Math.cos( deg60 ) * (r/4) - r/5 );
      ctx.closePath();
      ctx.stroke();
    },
    water: function( ctx, r ){
      // stroke style
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = Render.colors.water;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(0,0,0,.75)";
      // down triangle
      ctx.beginPath();
      ctx.moveTo( r + Math.sin( deg360 ) * (r/4), r + Math.cos( deg360 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg120 ) * (r/4), r + Math.cos( deg120 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg240 ) * (r/4), r + Math.cos( deg240 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg360 ) * (r/4), r + Math.cos( deg360 ) * (r/4) );
      ctx.closePath();
      ctx.stroke();
    },
    earth: function( ctx, r ){
      // stroke style
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = Render.colors.earth;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "rgba(0,0,0,.75)";
      // down triangle with bar
      ctx.beginPath();
      ctx.moveTo( r + Math.sin( deg360 ) * (r/4), r + Math.cos( deg360 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg120 ) * (r/4), r + Math.cos( deg120 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg240 ) * (r/4), r + Math.cos( deg240 ) * (r/4) );
      ctx.lineTo( r + Math.sin( deg360 ) * (r/4), r + Math.cos( deg360 ) * (r/4) );
      ctx.moveTo( r + Math.sin( deg240 ) * (r/4), r + Math.cos( deg240 ) * (r/4) + r/5 );
      ctx.lineTo( r + Math.sin( deg120 ) * (r/4), r + Math.cos( deg120 ) * (r/4) + r/5 );
      ctx.closePath();
      ctx.stroke();
    }
  }
};


function master_circle ( r, type ){
  if ( !master_circle[ r + type ] ){
    master_circle[ r + type ] = new Canvas()
      .size( 2*r, 2*r )
      .draw(function( ctx ){
        // circle fill...
        ctx.beginPath();
        ctx.arc( r, r, r, 0, twoPI, false);
        ctx.fillStyle = Render.gradient( ctx, type, r ); // 'rgba(0,0,0,.25)';
        ctx.fill();
        ctx.closePath();
        // circle inset...
        Render.element[ type ]( ctx, r );
      });
  }
  return master_circle[ r + type ].elem;
}
