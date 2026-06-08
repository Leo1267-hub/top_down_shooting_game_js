# JavaScript Refactor Plan

The original game logic lives in `static/script.js`. That file currently contains entity definitions, asset setup, input handling, rendering, collision detection, spawning, combat, UI updates, and the main game loop.

The refactor is being done in small steps so the game remains playable after each change.

## Completed

- Added professional game page structure.
- Rewrote the README for a CV-ready project presentation.
- Added modular entity classes under `static/js/entities/`.
- Added reusable random helper under `static/js/utils/random.js`.
- Added `static/js/main.js` as the future modular entry point.

## Current Entity Modules

```text
static/js/entities/
├── GameObject.js
├── Player.js
├── Enemy.js
├── ShootingEnemy.js
├── Boss.js
├── Plant.js
├── Bullet.js
├── Mine.js
├── Pickup.js
└── index.js
```

## Next Migration Step

At the top of `static/script.js`, add:

```js
import {
    Player,
    Enemy,
    Shooting_enemy,
    Boss,
    Plant,
    Bullet,
    Mine,
    Ammo,
    Health_ammo
} from "./js/entities/index.js";
```

Then remove the old inline class definitions from `script.js`:

- `Game_object`
- `Player`
- `Enemy`
- `Boss`
- `Plant`
- `Shooting_enemy`
- `Bullet`
- `Mine`
- `Ammo`
- `Health_ammo`

The game factory functions can then keep their existing names:

```js
function create_enemy() {
    return new Enemy(randint(0, canvas.width - 35), randint(0, canvas.height - 35));
}

function create_shooting_enemy() {
    return new Shooting_enemy(randint(0, canvas.width - 35), randint(0, canvas.height - 35));
}
```

## After That

Split systems out of `script.js`:

```text
static/js/core/
├── Game.js
├── InputManager.js
├── AssetLoader.js
└── Collision.js

static/js/systems/
├── RenderSystem.js
├── CombatSystem.js
├── SpawnSystem.js
├── AudioSystem.js
└── UISystem.js
```

## CV Framing

The important CV angle is that this is no longer just a small game. It becomes a refactoring and architecture project:

> Refactored a monolithic JavaScript browser game into a modular ES module architecture with separated entities, utilities, rendering, input, combat, spawning, and UI systems.
