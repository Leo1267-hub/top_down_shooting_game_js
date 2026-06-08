import { GameObject } from "./GameObject.js";

export class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 75, 75, "cyan");

        this.xChange = 0;
        this.yChange = 0;
        this.energy = 100;
        this.rotation_angle = (3 * Math.PI) / 2;
        this.gun_rotation_angle = (3 * Math.PI) / 2;
        this.health = 100;
        this.bullets_in_clip = 30;
        this.amount_bullets = 0;
        this.reloading = false;
        this.max_health = 100;
        this.gunOffsetX = -85;
        this.gunOffsetY = -20;
        this.is_moving = false;
        this.invulnerability = false;
        this.used_cheats = false;
        this.amount_of_mines = 2;
    }
}
