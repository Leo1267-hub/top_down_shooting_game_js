export const IMAGE_ASSETS = [
    { name: "ammo", url: "static/images/ammo.png" },
    { name: "hull", url: "static/images/Hull_02.png" },
    { name: "gun", url: "static/images/gun.png" },
    { name: "trackA", url: "static/images/Track_2_A.png" },
    { name: "trackB", url: "static/images/Track_2_B.png" },
    { name: "exhaust", url: "static/images/Exhaust_Fire.png" },
    { name: "normalEnemy", url: "static/images/mine_drone_idle.png" },
    { name: "normalEnemyCooldown", url: "static/images/mine_drone_cooldown.png" },
    { name: "normalEnemyAttack", url: "static/images/mine_drone_exploding.png" },
    { name: "shootingEnemy", url: "static/images/elec_drone_attack.png" },
    { name: "bullet", url: "static/images/electrical_area.png" },
    { name: "map", url: "static/images/map.png" },
    { name: "plant", url: "static/images/plant.png" },
    { name: "boss", url: "static/images/boss.png" },
    { name: "mine", url: "static/images/bomb.png" }
];

export const AUDIO_ASSETS = [
    { name: "towerMove", url: "static/sounds/Turret.ogg" },
    { name: "shootingEnemy", url: "static/sounds/Machinegun.ogg" },
    { name: "shoot", url: "static/sounds/Gun.ogg" },
    { name: "engine", url: "static/sounds/Engineidle.ogg" },
    { name: "engineShift", url: "static/sounds/Enginehigh.ogg" },
    { name: "reload", url: "static/sounds/reload.mp3" },
    { name: "backgroundMusic", url: "static/sounds/background.wav" }
];

export const GAME_ASSETS = [
    ...IMAGE_ASSETS.map((asset) => ({ ...asset, type: "image" })),
    ...AUDIO_ASSETS.map((asset) => ({ ...asset, type: "audio" }))
];
