import { GameObject } from "./GameObject.js";
import { randInt } from "../utils/random.js";

export class Enemy extends GameObject {
    constructor(
        x,
        y,
        width = 35,
        height = 45,
        health = 20,
        max_health = 20,
        detection_radius = 200,
        frameX = 0,
        frameY = 0
    ) {
        super(x, y, width, height, "red");

        this.yChange = 0;
        this.xChange = 0;
        this.waiting = true;
        this.last_update = Date.now();
        this.next_update = randInt(1000, 5000);
        this.detection_radius = detection_radius;
        this.health = health;
        this.max_health = max_health;
        this.damage = 10;
        this.cooldown = false;
        this.cooldown_start_time = 0;
        this.frameX = frameX;
        this.frameY = frameY;
        this.attack = false;
        this.attack_start_time = 0;
    }
}
