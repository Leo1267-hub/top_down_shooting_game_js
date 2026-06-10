import { Enemy } from "../entities/Enemy.js";
import { Shooting_enemy } from "../entities/ShootingEnemy.js";
import { Boss } from "../entities/Boss.js";
import { Plant } from "../entities/Plant.js";
import { Ammo, Health_ammo } from "../entities/Pickup.js";
import { randInt } from "../utils/random.js";

export class SpawnSystem {
    constructor(canvas) {
        this.canvas = canvas;
    }

    createEnemy() {
        return new Enemy(
            randInt(0, this.canvas.width - 35),
            randInt(0, this.canvas.height - 35)
        );
    }

    createShootingEnemy() {
        return new Shooting_enemy(
            randInt(0, this.canvas.width - 35),
            randInt(0, this.canvas.height - 35)
        );
    }

    createBoss() {
        return new Boss(
            (this.canvas.width / 2) - 25,
            (this.canvas.height / 2) - 25
        );
    }

    createPlant() {
        return new Plant(
            randInt(45, this.canvas.width - 45),
            randInt(45, this.canvas.height - 45)
        );
    }

    createAmmoPickup() {
        return new Ammo(
            randInt(10, this.canvas.width - 20),
            randInt(10, this.canvas.height - 20)
        );
    }

    createHealthPickup() {
        return new Health_ammo(
            randInt(10, this.canvas.width - 20),
            randInt(10, this.canvas.height - 20)
        );
    }

    maintainEnemyCount(enemies, targetCount = 3) {
        while (enemies.length < targetCount) {
            enemies.push(this.createEnemy());
        }
    }

    maintainPickupCount(pickups, createPickup, targetCount = 3) {
        while (pickups.length < targetCount) {
            pickups.push(createPickup.call(this));
        }
    }
}
