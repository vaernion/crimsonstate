export const constants = {
  canvas: {
    ratio: 16 / 9,
    fraction: 0.8, // unused
  },
  friction: 0.89,
  world: {
    width: 1500,
    height: 800,
  },
  player: {
    width: 20,
    height: 45,
    headSize: 15,
    health: 50,
    maxHealth: 200,
    acceleration: {
      x: 1.3,
      y: 1.3,
    },
    maxSpeed: 4,
    consumables: {
      initial: {
        bomb: 3,
        medpack: 4,
      },
      max: {
        bomb: 6,
        medpack: 6,
      },
      effect: {
        medpack: 60,
      },
    },
  },
  enemy: {
    maxCount: 10,
    spawnDelay: 2000,
    spawnGroup: 15,
  },
};
