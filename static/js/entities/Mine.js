import { GameObject } from "./GameObject.js";

export class Mine extends GameObject {
    constructor(x, y, start_time, mine_is_placed, damage = 50, explode_radius = 400) {
        super(x, y, 15, 15, "yellow");

        this.damage = damage;
        this.explode_radius = explode_radius;
        this.mine_is_placed = mine_is_placed;
        this.start_time = start_time;
    }
}
