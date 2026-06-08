import { GameObject } from "./GameObject.js";

export class Bullet extends GameObject {
    constructor(x, y, angle, owner) {
        super(x, y, 7.5, 7.5, "blue");

        this.damage = 10;
        this.speed = 30;
        this.angle = angle;
        this.owner = owner;
    }
}
