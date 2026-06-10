export function collides(a, b) {
    return !(
        a.x + a.width < b.x ||
        b.x + b.width < a.x ||
        a.y > b.y + b.height ||
        b.y > a.y + a.height
    );
}

export function distance(dx, dy) {
    return Math.sqrt((dx ** 2) + (dy ** 2));
}

export function distanceBetween(a, b) {
    const aX = a.x + a.width / 2;
    const aY = a.y + a.height / 2;
    const bX = b.x + b.width / 2;
    const bY = b.y + b.height / 2;

    return distance(aX - bX, aY - bY);
}

export function centerOf(entity) {
    return {
        x: entity.x + entity.width / 2,
        y: entity.y + entity.height / 2
    };
}
