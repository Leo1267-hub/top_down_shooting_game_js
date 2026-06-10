import { centerOf } from "../core/Collision.js";

export class RenderSystem {
    constructor(canvas, context, assets = {}) {
        this.canvas = canvas;
        this.context = context;
        this.assets = assets;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground(mapImage) {
        this.clear();
        this.context.fillStyle = "#6abe30";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (mapImage) {
            this.context.drawImage(
                mapImage,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
        }
    }

    drawHealthBar(entity, color = "aquamarine") {
        this.context.fillStyle = "tomato";
        this.context.fillRect(entity.x, entity.y - 10, entity.width, 5);

        this.context.fillStyle = color;
        this.context.fillRect(
            entity.x,
            entity.y - 10,
            (entity.health / entity.max_health) * entity.width,
            5
        );
    }

    drawPlayerBars(player) {
        this.context.fillStyle = "yellow";
        this.context.fillRect(10, 10, player.energy, 10);

        this.context.fillStyle = "blue";
        this.context.fillRect(10, 30, 100, 10);

        this.context.fillStyle = player.invulnerability ? "#CC5500" : "red";
        this.context.fillRect(10, 30, player.health, 10);
    }

    drawText(text, x, y, font = "20px sans-serif", color = "white") {
        this.context.font = font;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }

    drawLaser(player, length = 1500, offset = 20) {
        const playerCenter = centerOf(player);
        const laserX = playerCenter.x + offset * Math.cos(player.gun_rotation_angle);
        const laserY = playerCenter.y + offset * Math.sin(player.gun_rotation_angle);

        this.context.setLineDash([]);
        this.context.strokeStyle = "#E5E4E2";
        this.context.beginPath();
        this.context.moveTo(laserX, laserY);
        this.context.lineTo(
            playerCenter.x + length * Math.cos(player.gun_rotation_angle),
            playerCenter.y + length * Math.sin(player.gun_rotation_angle)
        );
        this.context.stroke();
    }

    drawSprite(image, source, target) {
        if (!image) return;

        this.context.drawImage(
            image,
            source.x,
            source.y,
            source.width,
            source.height,
            target.x,
            target.y,
            target.width,
            target.height
        );
    }
}
