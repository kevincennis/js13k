var level = [];

level[1] = {
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
    earth: Physics.unit2(18)
  }
};

level[2] = {
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
    fire: Physics.unit2(23),
    air: 0,
    water: 0,
    earth: 0
  }
};

level[3] = {
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
    fire: Physics.unit2(20),
    air: 0,
    water: 0,
    earth: 0
  }
};

level[4] = {
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
    fire: 0,
    air: 0,
    water: Physics.unit2(19),
    earth: 0
  }
};

level[5] = {
  field: [
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, WATER, WATER, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
    [ 0, 0, 0, 0, EARTH, 0, 0, EARTH ],
  ],
  solve: {
    fire: Physics.unit2(18),
    air: 0,
    water: Physics.unit2(1),
    earth: 0
  }
};
