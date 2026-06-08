import { GameObject } from "./GameObject.js";
import { randInt } from "../utils/random.js";

export class Boss extends GameObject {
    constructor(x, y, width = 85, height = 75, health = 100, max_health = 100) {
        super(x, y, width, height, "red");

        this.last_update = Date.now();
        this.next_update = randInt(1000, 5000);
        this.health = health;
        this.max_health = max_health;
        this.damage = 30;
        this.last_time_spawn = Date.now();
        this.spawn_enemies_time = randInt(10000, 20000);
        this.last_time_shoot = Date.now();
        this.shoot_time = randInt(1000, 15000);
        this.last_time_spawn_plant = Date.now();
        this.spawn_plant_time = randInt(2000, 10000);
        this.enough_plants = false;
    }
}
