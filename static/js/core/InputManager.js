export class InputManager {
    constructor(target = window) {
        this.target = target;

        this.keys = {
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            shift: false,
            shoot: false,
            rotateLeft: false,
            rotateRight: false,
            reload: false,
            toggleLaser: false,
            toggleInvulnerability: false,
            placeMine: false
        };

        this.preventedKeys = new Set([
            "a", "A", "d", "D", "w", "W", "s", "S",
            "ArrowLeft", "ArrowRight", " ",
            "r", "R", "l", "L", "h", "H", "2", "@"
        ]);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    attach() {
        this.target.addEventListener("keydown", this.handleKeyDown, false);
        this.target.addEventListener("keyup", this.handleKeyUp, false);
    }

    detach() {
        this.target.removeEventListener("keydown", this.handleKeyDown, false);
        this.target.removeEventListener("keyup", this.handleKeyUp, false);
    }

    handleKeyDown(event) {
        const key = event.key;

        if (this.preventedKeys.has(key)) {
            event.preventDefault();
        }

        if (key === "a" || key === "A") this.keys.moveLeft = true;
        if (key === "d" || key === "D") this.keys.moveRight = true;
        if (key === "w" || key === "W") this.keys.moveUp = true;
        if (key === "s" || key === "S") this.keys.moveDown = true;
        if (key === "Shift") this.keys.shift = true;
        if (key === "ArrowLeft") this.keys.rotateLeft = true;
        if (key === "ArrowRight") this.keys.rotateRight = true;
        if (key === " ") this.keys.shoot = true;
        if (key === "r" || key === "R") this.keys.reload = true;
        if (key === "h" || key === "H") this.keys.toggleInvulnerability = true;
        if (key === "l" || key === "L") this.keys.toggleLaser = true;
        if (key === "2" || key === "@") this.keys.placeMine = true;
    }

    handleKeyUp(event) {
        const key = event.key;

        if (key === "a" || key === "A") this.keys.moveLeft = false;
        if (key === "d" || key === "D") this.keys.moveRight = false;
        if (key === "w" || key === "W") this.keys.moveUp = false;
        if (key === "s" || key === "S") this.keys.moveDown = false;
        if (key === "Shift") this.keys.shift = false;
        if (key === "ArrowLeft") this.keys.rotateLeft = false;
        if (key === "ArrowRight") this.keys.rotateRight = false;
        if (key === " ") this.keys.shoot = false;
        if (key === "r" || key === "R") this.keys.reload = false;
        if (key === "2" || key === "@") this.keys.placeMine = false;
    }

    consumeToggleLaser() {
        return this.consume("toggleLaser");
    }

    consumeToggleInvulnerability() {
        return this.consume("toggleInvulnerability");
    }

    consume(action) {
        const value = this.keys[action];
        this.keys[action] = false;
        return value;
    }
}
