import { Enemy } from "./Enemy.js";

export class ShootingEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, 40, 40, 30, 30, 350, 0, 0);

        this.shooting_radius = 300;
        this.shoot = false;
        this.color = "yellow";
        this.last_time_shoot = 0;
        this.need_kit = false;
        this.bullets_in_reserve = 30;
        this.need_bullet_kit = false;
    }
}

// Temporary compatibility export for the original class name used in script.js.
export { ShootingEnemy as Shooting_enemy };
