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

// This file is the new modular entry point for the game refactor.
// The next migration step is to move the existing game loop from static/script.js
// into this file and replace the old inline entity classes with these imports.

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

export const Utils = {
    randInt
};
