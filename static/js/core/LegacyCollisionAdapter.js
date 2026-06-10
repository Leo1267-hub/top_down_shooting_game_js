import {
    collides,
    distance,
    distanceBetween,
    centerOf
} from "./Collision.js";

const collisionApi = {
    collides,
    distance,
    distanceBetween,
    centerOf
};

// Runtime bridge for the legacy game while collision logic is migrated.
// New modules can use named imports from Collision.js, while browser debugging
// and transitional legacy code can access the same helpers through window.gameCollision.
window.gameCollision = collisionApi;

export { collisionApi };
