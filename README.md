# Crimsonstate

- OOP &amp; gamedev experiment inspired by Crimsonland.
- For learning: code quality equally important as gameplay.

## Design

- Arena/twin-stick shooter concept, but with **infinite** procedurally generated world.
- Top-down 2d, standard keyboard & mouse controls.
- Enemies assault player from all sides, movement and kiting important.
- Pick up weapons, abilities & power-ups.
- Upgrades & unlocks?

## Code

### Short term todo

asap: refactor draw & update, center camera on player, draw world edge (redo after camera change), buffer only one non-movement key at a time to greatly simplify conditionals (controls.specialBuffer = "esc" || "activate" || "")

then: enemies/entities, damage model, weapon

### Features

| class               | feature                   | details                                        | status             |
| ------------------- | ------------------------- | ---------------------------------------------- | ------------------ |
| Game                | loop & hierarchy          |                                                | :heavy_check_mark: |
| Controls            | intercept & buffer input  |                                                | :heavy_check_mark: |
| Player              | movement                  |                                                | :heavy_check_mark: |
| Player              | collision                 |                                                |                    |
| World               | world constructor         | only determines max area for now               | :heavy_check_mark: |
| Game                | draw world border         |                                                | :heavy_check_mark: |
| Menu Controls       | pause game                | conditional update in Game                     | :heavy_check_mark: |
| Menu Controls       | select options            | wasd and/or mouse                              | :heavy_check_mark: |
| Game Menu Controls  | start/reset               | hotkey too?                                    | :heavy_check_mark: |
| Game Player         | camera follows player     |                                                |                    |
| Game/Save           | settings/score/unlocks?   | localstate JSON                                |                    |
| Enemy/Entity        | spawn outside vision      |                                                |                    |
| Enemy/Entity        | move towards player       |                                                |                    |
| Player Enemy        | take damage               |                                                |                    |
| Game/other??        | win/lose conditions       | lose: death                                    |                    |
| Player              | use ability               | screen (visible enemies) wipe?                 |                    |
| Weapon              | spawn in world            |                                                |                    |
| Player              | pick up weapon            |                                                |                    |
| Weapon              | attach to player          |                                                |                    |
| Projectile          | move & collide            | reuse player code (inheritance?)               |                    |
| Enemy/Entity        | ranged/melee attacks      | vector math enemy -> player                    |                    |
| Weapon              | fire projectile           | vector math player -> aim direction            |                    |
| World Player Entity | powerups                  | activated on collision,various effects         |                    |
| Player ??           | upgrades                  | xp, pause and select stat++ and/or ability     |                    |
| World               | hazards                   | fire/lightning etc, damage based on delta time |                    |
| World               | static entities (terrain) | with collision                                 |                    |
| World               | varying visuals           | random gradients at first for some variance    |                    |
| World               | area cells                | 3x3 or 5x5 matrix, player always in center     |                    |
| World               | procedural generation     | seeded world, find algorithm                   |                    |
| World               | infinite area             | generate cells around player (outside vision)  |                    |
| Graphics            | sprites/pixel art         | find free stuff with consistent theme          |                    |
| Sound               | sound effects             | find free library with good sound design       |                    |
| Sound               | music                     | freely licensed doom/metal-ish                 |                    |
| Save (optional)     | auth and/or database      | Netlify serverless/AWS lambda & MongoDB Atlas  |                    |
| _code_              | tests                     | Jest                                           |                    |
| _code_              | CI/CD                     | Netlify?                                       |                    |
| _content_           | more variety              | more enemies, weapons, worlds(?) etc           |                    |

### Structure so far

```js
Game
|-- canvas
|-- Debug
|-- Menu
|-- Controls
|-- Player
|    |-- health
|    |-- width/height
|    |-- position = {x,y}
|    |-- movePlayer()
| World
| Enemies/Entities?
```
