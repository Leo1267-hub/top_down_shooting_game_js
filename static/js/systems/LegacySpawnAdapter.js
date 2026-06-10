import { SpawnSystem } from "./SpawnSystem.js";

function resolveCanvas() {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
        throw new Error("Cannot create SpawnSystem: canvas element was not found.");
    }

    return canvas;
}

function createSpawnSystem(canvas = resolveCanvas()) {
    return new SpawnSystem(canvas);
}

const spawnApi = {
    createSpawnSystem,
    createEnemy(canvas) {
        return createSpawnSystem(canvas).createEnemy();
    },
    createShootingEnemy(canvas) {
        return createSpawnSystem(canvas).createShootingEnemy();
    },
    createBoss(canvas) {
        return createSpawnSystem(canvas).createBoss();
    },
    createPlant(canvas) {
        return createSpawnSystem(canvas).createPlant();
    },
    createAmmoPickup(canvas) {
        return createSpawnSystem(canvas).createAmmoPickup();
    },
    createHealthPickup(canvas) {
        return createSpawnSystem(canvas).createHealthPickup();
    }
};

// Runtime bridge for the legacy game while spawn logic is migrated.
// Existing factory functions in legacyGame.js still run, but the new system
// can now be inspected and adopted incrementally.
window.gameSpawning = spawnApi;

export { spawnApi };
