import { GameObject } from "./GameObject.js";

export class AmmoPickup extends GameObject {
    constructor(x, y, amount = 30) {
        super(x, y, 20, 20, "brown");

        this.amount = amount;
        this.frameX = 1;
        this.frameY = 1;
    }
}

export class HealthPickup extends GameObject {
    constructor(x, y, health_to_add = 30) {
        super(x, y, 20, 20, "red");

        this.health_to_add = health_to_add;
        this.frameX = 0;
        this.frameY = 0;
    }
}

// Temporary compatibility exports for the original class names used in script.js.
export { AmmoPickup as Ammo, HealthPickup as Health_ammo };
