var Render = {
  init: function(){
    // background
    Render.bg = new Canvas( document.body )
      .size( Physics.width + 2, Physics.height + 2 )
      .style({
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 1
      })
      .draw( Render.grid );
    // midground
    Render.mg = new Canvas( document.body )
      .size( Physics.width, Physics.height )
      .style({
        position: 'absolute',
        top: '1px',
        left: '1px',
        zIndex: 2
      });
    // foreground
    Render.fg = new Canvas( document.body )
      .size( Physics.width, Physics.height )
      .style({
        position: 'absolute',
        top: '1px',
        left: '1px',
        zIndex: 3
      });
    // mini map
    Render.map = new Canvas( document.body )
      .size( Physics.width/16, Physics.height/16 )
      .style({
        position: 'absolute',
        top: '1px',
        left: ( Physics.width + 1 )+'px',
        zIndex: 4
      });
  },
  grid: function( ctx ){
    // ctx.transform( 1, 0, .75, 1, 0, 0 );
    ctx.beginPath();
    // vertical lines
    for ( var i = 1; i < this.w; i+=32 ){
      ctx.moveTo( i, 0 );
      ctx.lineTo( i, this.h );
    }
    // horizontal lines
    for ( var i = 1; i < this.h; i+=32 ){
      ctx.moveTo( 0, i );
      ctx.lineTo( this.w, i );
    }
    ctx.lineWidth = .5;
    ctx.strokeStyle = 'rgba(0,0,0,.25)';
    ctx.stroke();
    ctx.closePath();
  }


};
