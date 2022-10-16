export const constants = {
  canvas: {
    ratio: 16 / 9,
    fraction: 0.8, // unused
  },
  friction: 0.89,
  world: {
    width: 1000,
    height: 700,
  },
  player: {
    width: 20,
    height: 35,
    headSize: 10,
    healthMax: 200,
    health: 100,
    acceleration: {
      x: 1.1,
      y: 1.1,
    },
    maxSpeed: 3.3,
    consumables: {
      initial: {
        bomb: 7,
        medpack: 4,
      },
      max: {
        bomb: 10,
        medpack: 6,
      },
      effect: {
        bomb: 100,
        medpack: 60,
      },
      range: {
        bomb: 400,
      },
    },
  },
  enemy: {
    maxCount: 100,
    spawnDelay: 2000,
    spawnGroup: 10,
  },
  weaponSpawns: {
    maxCount: 5,
    spawnDelay: 3000,
  },
};
