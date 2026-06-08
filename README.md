# Iron Siege — Top-Down Survival Shooter

Iron Siege is a browser-based top-down survival shooter built with JavaScript, HTML5 Canvas, Flask, and SQLite. The player controls an armoured vehicle, survives enemy waves, manages ammunition and health, and competes for a leaderboard score.

## Features

- Real-time player movement and turret rotation
- HTML5 Canvas rendering with sprite-based game objects
- Melee enemies, ranged enemies, plants, mines, and boss encounters
- Projectile combat, reloading, ammo pickups, health pickups, and energy management
- Collision detection between the player, enemies, bullets, pickups, and hazards
- Sound effects and background music
- Flask authentication flow with login, registration, sessions, and leaderboard persistence

## Tech Stack

- JavaScript
- HTML5 Canvas
- CSS
- Python
- Flask
- SQLite

## Project Goals

This project is being refactored from a monolithic JavaScript file into a cleaner modular architecture. The goal is to make the codebase easier to maintain, test, extend, and explain in a technical interview.

Planned architecture:

```text
static/js/
├── main.js
├── config.js
├── core/
│   ├── Game.js
│   ├── AssetLoader.js
│   ├── InputManager.js
│   └── Collision.js
├── entities/
│   ├── GameObject.js
│   ├── Player.js
│   ├── Enemy.js
│   ├── ShootingEnemy.js
│   ├── Boss.js
│   ├── Bullet.js
│   ├── Mine.js
│   └── Pickup.js
├── systems/
│   ├── RenderSystem.js
│   ├── CombatSystem.js
│   ├── SpawnSystem.js
│   ├── AudioSystem.js
│   └── UISystem.js
└── utils/
    ├── math.js
    └── random.js
```

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Leo1267-hub/top_down_shooting_game_js.git
cd top_down_shooting_game_js
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the Flask app:

```bash
flask run
```

5. Open the local Flask URL in your browser.

## Controls

| Action | Key |
| --- | --- |
| Move | WASD / Arrow Keys |
| Rotate / Aim | Game controls defined in-game |
| Shoot | Game controls defined in-game |
| Reload | Game controls defined in-game |
| Place Mine | Game controls defined in-game |

## Development Notes

The first version of the game was implemented in a single JavaScript file. The current development focus is improving maintainability by separating the game loop, entities, rendering, input, collision detection, spawning, audio, and UI logic into dedicated modules.

## CV Summary

Refactored and developed a browser-based top-down survival shooter using JavaScript, HTML5 Canvas, Flask, and SQLite, with real-time movement, enemy AI, projectile combat, collision detection, pickups, boss waves, authentication, and leaderboard persistence.
