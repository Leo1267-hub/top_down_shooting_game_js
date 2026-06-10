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
} from "./entities/index.js";
import { randInt } from "./utils/random.js";
import {
    InputManager,
    AssetLoader,
    collides,
    distance,
    distanceBetween,
    centerOf
} from "./core/index.js";
import {
    SpawnSystem,
    RenderSystem
} from "./systems/index.js";

// Modular entry point for the ongoing game refactor.
// legacyGame.js still runs the existing game while these modules are extracted
// and prepared for a full Game class migration.

export const Entities = {
    Player,
    Enemy,
    Shooting_enemy,
    Boss,
    Plant,
    Bullet,
    Mine,
    Ammo,
    Health_ammo
};

export const Core = {
    InputManager,
    AssetLoader,
    collides,
    distance,
    distanceBetween,
    centerOf
};

export const Systems = {
    SpawnSystem,
    RenderSystem
};

export const Utils = {
    randInt
};
