import { GameObject } from "./GameObject.js";

export class Plant extends GameObject {
    constructor(x, y, width = 40, height = 40) {
        super(x, y, width, height, "yellow");

        this.damage = 5;
        this.last_time_hit = Date.now();
    }
}
