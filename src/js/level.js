var level = [];

level[1] = {
  balls: [
    FIRE, AIR, WATER, EARTH
  ],
  field: [
    [],
    [ 0, 0, 0, 0, 0, 0, FIRE ],
    [ 0, 0, 0, 0, 0, FIRE, FIRE ],
    [ 0, 0, 0, 0, 0, FIRE, 0, FIRE ],
    [ 0, 0, 0, 0, FIRE, 0, 0, FIRE ],
    [ 0, 0, 0, 0, FIRE, 0, 0, 0, FIRE ],
    [ 0, 0, 0, FIRE, 0, 0, 0, 0, FIRE ],
    [ 0, 0, 0, FIRE, FIRE, FIRE, FIRE, FIRE, FIRE, FIRE ],
  ],
  solve: {
    fire: 0,
    air: 0,
    water: 0,
    earth: Math.floor( 29*29*Math.PI*18.5 )
  }
};

level[2] = {
  balls: [
    FIRE, AIR, WATER, EARTH
  ],
  field: [
    [],
    [ 0, 0, 0, 0, 0, 0, AIR ],
    [ 0, 0, 0, 0, 0, AIR, AIR ],
    [ 0, 0, 0, 0, 0, AIR, 0, AIR ],
    [ 0, 0, 0, 0, AIR, 0, 0, AIR ],
    [ 0, 0, 0, AIR, AIR, AIR, AIR, AIR, AIR, AIR ],
    [ 0, 0, 0, AIR, 0, 0, 0, 0, AIR ],
    [ 0, 0, 0, AIR, AIR, AIR, AIR, AIR, AIR, AIR ],
  ],
  solve: {
    fire: Math.floor( 29*29*Math.PI*23.5 ),
    air: 0,
    water: 0,
    earth: 0
  }
};

level[3] = {
  balls: [
    FIRE, AIR, WATER, EARTH
  ],
  field: [
    [],
    [ 0, 0, 0, WATER, WATER, WATER, WATER, WATER, WATER, WATER ],
    [ 0, 0, 0, WATER, 0, 0, 0, 0, WATER ],
    [ 0, 0, 0, 0, WATER, 0, 0, 0, WATER ],
    [ 0, 0, 0, 0, WATER, 0, 0, WATER ],
    [ 0, 0, 0, 0, 0, WATER, 0, WATER ],
    [ 0, 0, 0, 0, 0, WATER, WATER ],
    [ 0, 0, 0, 0, 0, 0, WATER ],
  ],
  solve: {
    fire: 0,
    air: 1e9,
    water: 0,
    earth: 0
  }
};

level[4] = {
  balls: [
    FIRE, AIR, WATER, EARTH
  ],
  field: [
    [],
    [ 0, 0, 0, EARTH, EARTH, EARTH, EARTH, EARTH, EARTH, EARTH ],
    [ 0, 0, 0, EARTH, 0, 0, 0, 0, EARTH ],
    [ 0, 0, 0, EARTH, EARTH, EARTH, EARTH, EARTH, EARTH, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, 0, EARTH, 0, EARTH ],
    [ 0, 0, 0, 0, 0, EARTH, EARTH ],
    [ 0, 0, 0, 0, 0, 0, EARTH ],
  ],
  solve: {
    fire: 1e9,
    air: 0,
    water: 0,
    earth: 0
  }
};
