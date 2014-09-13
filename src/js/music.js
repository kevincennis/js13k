(function( global ) {

  /*
   * Private stuffz
   */

  var enharmonics = 'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb',
    middleC = 440 * Math.pow( Math.pow( 2, 1 / 12 ), -9 ),
    numeric = /^[0-9.]+$/,
    octaveOffset = 4,
    space = /\s+/,
    num = /(\d+)/,
    offsets = {};

  // populate the offset lookup (note distance from C, in semitones)
  enharmonics.split('|').forEach(function( val, i ) {
    val.split('-').forEach(function( note ) {
      offsets[ note ] = i;
    });
  });

  /*
   * Note class
   *
   * new Note ('A4 q') === 440Hz, quarter note
   * new Note ('- e') === 0Hz (basically a rest), eigth note
   * new Note ('A4 es') === 440Hz, dotted eighth note (eighth + sixteenth)
   * new Note ('A4 0.0125') === 440Hz, 32nd note (or any arbitrary
   * divisor/multiple of 1 beat)
   *
   */

  // create a new Note instance from a string
  function Note( str ) {
    var couple = str.split( space );
    // frequency, in Hz
    this.frequency = Note.getFrequency( couple[ 0 ] ) || 0;
    // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
    this.duration = Note.getDuration( couple[ 1 ] ) || 0;
  }

  // convert a note name (e.g. 'A4') to a frequency (e.g. 440.00)
  Note.getFrequency = function( name ) {
    var couple = name.split( num ),
      distance = offsets[ couple[ 0 ] ],
      octaveDiff = ( couple[ 1 ] || octaveOffset ) - octaveOffset,
      freq = middleC * Math.pow( Math.pow( 2, 1 / 12 ), distance );
    return freq * Math.pow( 2, octaveDiff );
  };

  // convert a duration string (e.g. 'q') to a number (e.g. 1)
  // also accepts numeric strings (e.g '0.125')
  // and compund durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
  Note.getDuration = function( symbol ) {
    return numeric.test( symbol ) ? parseFloat( symbol ) :
      symbol.toLowerCase().split('').reduce(function( prev, curr ) {
        return prev + ( curr === 'w' ? 4 : curr === 'h' ? 2 :
          curr === 'q' ? 1 : curr === 'e' ? 0.5 :
          curr === 's' ? 0.25 : 0 );
      }, 0 );
  };

  typeof module !== 'undefined' && ( module.exports = Note );

  /*
   * Sequence class
   */

  // create a new Sequence
  function Sequence( ac, tempo, arr ) {
    if ( ac ) {
      this.ac = ac;
      this.createFxNodes();
      this.tempo = tempo || 120;
      this.loop = true;
      this.smoothing = 0;
      this.staccato = 0;
      this.notes = [];
      this.push.apply( this, arr || [] );
    }
  }

  // create gain and EQ nodes, then connect 'em
  Sequence.prototype.createFxNodes = function() {
    var eq = [ [ 'bass', 100 ], [ 'mid', 1000 ], [ 'treble', 2500 ] ],
      prev = this.gain = this.ac.createGain();
    this.wet = this.ac.createGain();
    this.dry = this.ac.createGain();
    eq.forEach(function( config, filter ) {
      filter = this[ config[ 0 ] ] = this.ac.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = config[ 1 ];
      prev.connect( prev = filter );
    }.bind( this ));
    prev.connect( this.wet );
    prev.connect( this.dry );
    return this;
  };

  // accepts Note instances or strings (e.g. 'A4 e')
  Sequence.prototype.push = function() {
    Array.prototype.forEach.call( arguments, function( note ) {
      this.notes.push( note instanceof Note ? note : new Note( note ) );
    }.bind( this ));
    return this;
  };

  // recreate the oscillator node (happens on every play)
  Sequence.prototype.createOscillator = function() {
    this.stop();
    this.osc = this.ac.createOscillator();
    this.osc.type = this.waveType || 'square';
    this.osc.connect( this.gain );
    return this;
  };

  // schedules this.notes[ index ] to play at the given time
  // returns an AudioContext timestamp of when the note will *end*
  Sequence.prototype.scheduleNote = function( index, when ) {
    var duration = 60 / this.tempo * this.notes[ index ].duration,
      cutoff = duration * ( 1 - ( this.staccato || 0.00000000001 ) );

    this.setFrequency( this.notes[ index ].frequency, when );

    if ( this.smoothing && this.notes[ index ].frequency ) {
      this.slide( index, when, cutoff );
    }

    this.setFrequency( 0, when + cutoff );
    return when + duration;
  };

  // get the next note
  Sequence.prototype.getNextNote = function( index ) {
    return this.notes[ index < this.notes.length - 1 ? index + 1 : 0 ];
  };

  // how long do we wait before beginning the slide? (in seconds)
  Sequence.prototype.getSlideStartDelay = function( duration ) {
    return duration - Math.min( duration, 60 / this.tempo * this.smoothing );
  };

  // slide the note at <index> into the next note at the given time,
  // and apply staccato effect if needed
  Sequence.prototype.slide = function( index, when, cutoff ) {
    var next = this.getNextNote( index ),
      start = this.getSlideStartDelay( cutoff );
    this.setFrequency( this.notes[ index ].frequency, when + start );
    this.rampFrequency( next.frequency, when + cutoff );
    return this;
  };

  // set frequency at time
  Sequence.prototype.setFrequency = function( freq, when ) {
    this.osc.frequency.setValueAtTime( freq, when );
    return this;
  };

  // ramp to frequency at time
  Sequence.prototype.rampFrequency = function( freq, when ) {
    this.osc.frequency.linearRampToValueAtTime( freq, when );
    return this;
  };

  // run through all notes in the sequence and schedule them
  Sequence.prototype.play = function( when ) {
    when = typeof when === 'number' ? when : this.ac.currentTime;

    this.createOscillator();
    this.osc.start( when );

    this.notes.forEach(function( note, i ) {
      when = this.scheduleNote( i, when );
    }.bind( this ));

    this.osc.stop( when );
    this.osc.onended = this.loop ? this.play.bind( this, when ) : null;

    return this;
  };

  // stop playback, null out the oscillator, cancel parameter automation
  Sequence.prototype.stop = function() {
    if ( this.osc ) {
      this.osc.onended = null;
      this.osc.stop( 0 );
      this.osc.frequency.cancelScheduledValues( 0 );
      this.osc = null;
    }
    return this;
  };

  typeof module !== 'undefined' && ( module.exports = Sequence );

  global.Note = Note;
  global.Sequence = Sequence;

}( typeof window !== 'undefined' ? window : this ) );


// audiocontext, beats per minute, overall game volume
var ac, tempo = 128, volume = 0.5;

if ( window.AudioContext || window.webkitAudioContext ) {
 ac = new ( window.AudioContext || window.webkitAudioContext )();
}

var Music = {

  init: function() {
    if ( ac ) {
      this.ac = ac;
      this.osc = this.ac.createOscillator();
      this.compressor = this.ac.createDynamicsCompressor();
      this.output = this.ac.createGain();
      this.output.connect( this.ac.destination );
      this.output.gain.value = volume;

      this.reverb = this.ac.createConvolver();
      this.reverb.buffer = this.createReverb( 2 );
      this.reverb.connect( this.compressor );

      this.collision1.dry.connect( this.output );
      this.collision1.gain.gain.value = 0.4;
      this.collision1.loop = false;

      this.collision2.dry.connect( this.output );
      this.collision2.gain.gain.value = 0.4;
      this.collision2.loop = false;

      this.osc.frequency.value = 0;
      this.osc.connect( this.compressor );
      this.osc.start();

      this.kick.wet.connect( this.reverb );
      this.bass.wet.connect( this.reverb );
      this.lead.wet.connect( this.reverb );
      this.counterpoint.wet.connect( this.reverb );
      this.pad1.wet.connect( this.reverb );
      this.pad2.wet.connect( this.reverb );
      this.kick.dry.connect( this.compressor );
      this.bass.dry.connect( this.compressor );
      this.lead.dry.connect( this.compressor );
      this.counterpoint.dry.connect( this.compressor );
      this.pad1.dry.connect( this.compressor );
      this.pad2.dry.connect( this.compressor );

      this.compressor.ratio.value = 4;
      this.compressor.threshold.value = -12;
      this.compressor.connect( this.output );

      this.bass.staccato = 0.25;
      this.bass.waveType = 'sawtooth';
      this.bass.treble.type = 'lowpass';
      this.bass.treble.frequency.value = 2500;
      this.bass.mid.gain.value = -2;

      this.lead.smoothing = 0.06;
      this.lead.gain.gain.value = 0.35;
      this.lead.wet.gain.value = 1.5;

      this.counterpoint.smoothing = 0.06;
      this.counterpoint.gain.gain.value = 0.22;

      this.pad1.gain.gain.value = 0.25;
      this.pad1.wet.gain.value = 3;
      this.pad1.waveType = 'sawtooth';

      this.pad2.gain.gain.value = 0.20;
      this.pad2.wet.gain.value = 3;
      this.pad2.waveType = 'sawtooth';

      this.kick.waveType = 'sine';
      this.kick.smoothing = 0.8;
      this.kick.gain.gain.value = 2.0;
      this.kick.bass.frequency.value = 60;
      this.kick.bass.gain.value = 10;
      this.kick.mid.frequency.value = 100;
      this.kick.mid.gain.value = 5;
      this.kick.wet.gain.value = 0.3;
    }
  },

  play: function() {
    var now, delay;
    if ( this.ac ) {
      now = this.ac.currentTime;
      delay = now + ( 60 / tempo * 16 );
      this.lead.play( now );
      this.counterpoint.play( delay );
      this.bass.play( delay );
      this.kick.play( delay );
      this.pad1.play( delay );
      this.pad2.play( delay );
    }
  },

  stop: function() {
    if ( this.ac ) {
      this.lead.stop();
      this.counterpoint.stop();
      this.bass.stop();
      this.kick.stop();
      this.pad1.stop();
      this.pad2.stop();
    }
  },

  mute: function() {
    if ( this.ac ) {
      if ( this.muted ) {
        this.muted = false;
        this.output.gain.value = volume;
      } else {
        this.muted = true;
        this.output.gain.value = 0;
      }
    }
  },

  collide: function( descend ) {
    if ( this.ac ) {
      this.collision1.stop();
      this.collision2.stop();
      if ( descend ) {
        this.collision2.play();
      } else {
        this.collision1.play();
      }
    }
  },

  createReverb: function( duration, decay ) {
    var sr = ac.sampleRate,
      len = sr * duration,
      impulse = this.ac.createBuffer( 2, len, sr ),
      impulseL = impulse.getChannelData( 0 ),
      impulseR = impulse.getChannelData( 1 ),
      i = 0;

    if ( !decay ) {
      decay = 2.0;
    }
    for ( ; i < len; ++i ) {
      impulseL[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - i / len, decay );
      impulseR[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - i / len, decay );
    }
    return impulse;
  },

  bass: new Sequence( ac, tempo, [
    'C2  e',
    'C2  e',
    'C2  e',
    'C2  e',
    'C2  e',
    'C2  e',
    'C2  e',
    'G2  e',

    'G2  e',
    'G2  e',
    'G2  e',
    'G2  e',
    'G2  e',
    'G2  e',
    'G2  e',
    'E2  e',

    'E2  e',
    'E2  e',
    'E2  e',
    'E2  e',
    'E2  e',
    'E2  e',
    'E2  e',
    'G2  e',

    'G2  e',
    'G2  e',
    'G2  e',
    'D2  e',
    'D2  e',
    'D2  e',
    'D2  e',
    'C2  e'
  ]),

  lead: new Sequence( ac, tempo, [
    '_  e',
    'G4 e',
    'G5 e',
    'G4 e',
    'D5 e',
    'C5 e',
    'B4 e',
    'C5 e',

    '_  e',
    'G4 e',
    'D5 e',
    'E5 e',
    'D5 e',
    'C5 e',
    'B4 e',
    'A4 e',

    '_  e',
    'G4 e',
    'G5 e',
    'G4 e',
    'D5 e',
    'C5 e',
    'B4 e',
    'C5 e',

    '_  e',
    'G4 e',
    'D5 e',
    'E5 e',
    'D5 e',
    'B4 e',
    'A4 e',
    'G4 e',
  ]),

  counterpoint: new Sequence( ac, tempo, [
    'E4 3',
    'F#4 e',
    'D4 3.5',
    'B3 e',
    'G4 3.5',
    'E4 e',
    'B4 h',
    'A4 q',
    'G4  e',
    'F#4 e',
    'E4 e'
  ]),

  kick: new Sequence( ac, tempo, [
    'G2 0.01',
    'C2 0.19',
    '-  0.80'
  ]),

  pad1: new Sequence( ac, tempo, [
    'G3 3.5',
    'G3 4',
    'G3 4',
    'G3 4',
    'G3 0.5'
  ]),

  pad2: new Sequence( ac, tempo, [
    'C4 3.5',
    'B3 4',
    'E4 4',
    'B3 2',
    'D4 2',
    'C4 0.5'
  ]),

  collision1: new Sequence( ac, 220, [
    'G3 s',
    'D4 s',
    'G4 s'
  ]),

  collision2: new Sequence( ac, 220, [
    'G4 s',
    'D4 s',
    'G3 s'
  ])

};


