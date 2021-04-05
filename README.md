# Crimsonstate

- OOP &amp; gamedev experiment inspired by Crimsonland.
- For learning: code quality equally important as gameplay.

## Design

- Arena/twin-stick shooter concept, but with **infinite** procedurally generated world.
- Top-down 2d, standard keyboard & mouse controls.
- Enemies assault player from all sides, movement and kiting important.
- Pick up weapons, abilities & power-ups.
- Level up and select upgrades & stats.
- Per-profile unlocks & stats - saved to localstate and/or DB.

## Code

### Tech

TypeScript, Canvas

### Partial TODO

asap: entity collision detection, damage inflicted, weapon spawns/pickup

then: static entities (terrain, water, plants, hazards, fire, traps), aoe damage?

consider: sprites, art library, music, sound effects

### Features

| class                | feature                    | details                                         | status             |
| -------------------- | -------------------------- | ----------------------------------------------- | ------------------ |
| Game                 | loop & hierarchy           |                                                 | :heavy_check_mark: |
| Controls             | intercept & buffer input   |                                                 | :heavy_check_mark: |
| Player               | movement                   |                                                 | :heavy_check_mark: |
| Player               | entity collision           |                                                 |                    |
| World                | world constructor          | only determines max area for now                | :heavy_check_mark: |
| Game                 | world edge                 | draw & collision                                | :heavy_check_mark: |
| Game Menu Controls   | pause game                 | conditional update in Game                      | :heavy_check_mark: |
| Menu Controls        | select options             | wasd and/or mouse                               | :heavy_check_mark: |
| Game Menu Controls   | start/reset                | hotkey too?                                     | :heavy_check_mark: |
| Game Player          | camera follows player      |                                                 | :heavy_check_mark: |
| HUD                  | hud draw method            | extract from Game                               | :heavy_check_mark: |
| Entity               | movement v2                | direction & acceleration -> velocity            | :heavy_check_mark: |
| Entity               | friction/drag/deceleration |                                                 | :heavy_check_mark: |
| Game/Save            | settings/score/unlocks?    | localStorage JSON                               |                    |
| Entity Spawner       | generate enemies over time | randomly placed inside world for now            | :heavy_check_mark: |
| Entity               | spawn outside vision       | depends on camera (canvas) size                 | :heavy_check_mark: |
| MovingEntity         | move towards player        |                                                 | :heavy_check_mark: |
| Entity               | take damage & destruction  | enemies.delete(this) should work                |                    |
| Game Player          | win/lose conditions        | lose: death, win: score/kills/time              |                    |
| Player               | use ability                | screen (visible enemies?) wipe, heal item       | :heavy_check_mark: |
| Player               | ability variety            | more consumables and/or cooldown based          |                    |
| Controls Player?     | mouse aim                  | only when mouse inside canvas or not?           | :heavy_check_mark: |
| Weapon Controls      | fire projectile            | mouse1, vector player -> aim direction          | :heavy_check_mark: |
| Game Weapon          | spawn in world             |                                                 |                    |
| Player Weapon        | pick up weapon             | on collision? attached? visuals?                |                    |
| Entity Projectile    | move & collide             | overload entity calculatevector (no friction)   |                    |
| Entity Enemy         | enemy ranged attacks       | vector enemy -> player                          | :heavy_check_mark: |
| World Player Entity  | powerups                   | activated on collision,various effects          |                    |
| Player Game Controls | upgrades                   | xp, pause and select stat++ and/or ability      |                    |
| World                | static entities (terrain)  | with collision                                  |                    |
| World                | hazards                    | fire/lightning etc, damage based on delta time  |                    |
| World                | varying visuals            | random gradients at first for some variance     |                    |
| Graphics             | sprites/pixel art          | find free stuff with consistent theme           |                    |
| Graphics/Particles   | blood, explosions etc.     | visual effect only, despawn after X time?       |                    |
| World                | procedural generation      | seeded world, find algorithm                    |                    |
| World                | area cells                 | 3x3 or 5x5 matrix, player always in center      |                    |
| World                | infinite area              | generate cells around player (outside vision)   |                    |
| Sound                | sound effects              | find free library with good sound design        |                    |
| Sound                | music                      | freely licensed doom/metal-ish                  |                    |
| Save                 | auth and/or database       | Netlify serverless/AWS lambda & MongoDB Atlas   |                    |
| _code_               | tests                      | Jest                                            |                    |
| _code_               | CI/CD                      | Netlify?                                        |                    |
| _content_            | more variety               | more enemies, weapons, upgrades, worlds(?) etc. |                    |

### Structure so far

```js
Game
|-- canvas
|-- Debug
|-- Menu
|-- HUD
|-- Controls
|-- World
|   |-- width/height
|-- MovingEntity/Player
|   |-- health & maxHealth
|   |-- width & height
|   |-- position = {x,y}
|   |-- velocity = Vector
|   |-- acceleration = Vector
|   |-- speed() & maxSpeed
|-- MovingEntity/Enemy
```
