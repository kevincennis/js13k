var level = [];

// tutorial
level[0] = {
  balls: [
    FIRE
  ],
  field: [
    [],
    [ 0, 0, 0, 0, 0, 0, FIRE ],
    [],
    [ 0, 0, 0, 0, 0, 0, AIR ],
    [],
    [ 0, 0, 0, 0, 0, 0, WATER ],
    [],
    [ 0, 0, 0, 0, 0, 0, EARTH ],
  ],
  solve: AIR
};

level[1] = {
  balls: [
    FIRE, FIRE, FIRE
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
  solve: AIR
};

level[2] = {
  balls: [
    FIRE, FIRE, FIRE
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
  solve: AIR
};

level[3] = {
  balls: [
    FIRE, FIRE, FIRE
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
  solve: AIR
};

level[4] = {
  balls: [
    FIRE, FIRE, FIRE
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
  solve: AIR
};
