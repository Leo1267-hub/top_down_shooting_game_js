let canvas;
let context;
let xhttp;

let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let request_id;

let player_x;
let player_y;

let enemy_x;
let enemy_y;

let dx;
let dy;

let angle;

let centre_x;
let centre_y;

let rotate_left = false;
let rotate_right = false;

let max_energy = 100;
let energy_consumption_rate = 0.5;
let energy_recover_rate = 0.2; //energy recovered when shift isnt pressed

let current_track_frame = 0;
//ammo
let ammo_per_row = 3;
let ammo_size = 32;

//images
let map_image = new Image();
let ammo_image = new Image();
let hull = new Image();
let gun = new Image();
let track_a = new Image();
let track_b = new Image();
let exhaust = new Image();
let normal_enemies_image = new Image();
let normal_enemies_cooldown_image = new Image();
let normal_enemies_attack_image = new Image();
let shooting_enemies_image = new Image();
let bullet_image = new Image();
let plant_image = new Image();
let boss_image = new Image();
let mine_image = new Image();

// sounds
let sounds = [];
let tower_move_sound = new Audio();
sounds.push(tower_move_sound);
let shooting_enemies_sound = new Audio();
sounds.push(shooting_enemies_sound);
let shoot_sound = new Audio();
sounds.push(shoot_sound);
let engine_sound = new Audio();
sounds.push(engine_sound);
let engine_shift_sound = new Audio();
sounds.push(engine_shift_sound);
let reload_sound = new Audio();
sounds.push(reload_sound);
let background_music = new Audio();
sounds.push(background_music);

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let shift = false;
let shoot = false;
let laser = true;
let place_mine = false;
let atLeastOneMineIsPlaced = false;


let bullets_html;
let kills = 0;

let last_time_shoot = 0;
let shoot_cooldown = 250; // 1/4 second of cooldown 
let shooting_enemy_cooldown = 750; //3/4 second

let reloading_time = 2000; //time to reload is 2 seconds
let start_to_reload;
let reloading_on_press = false;

let enemey_cooldown_max_time = 1000; //enemy cooldown for 1 seconds 
let enemey_attack_max_time = 100; //0.1 seconds for attacking animation
let max_boss_time = 6000; //spawn boss every minute

// timer
let minutes = "00";
let seconds = "00";
let total_seconds = 0;

let spawn_at_15 = false;

let offset = 20;
let last_time_mine_placed;
// define all classes
// about classes is taken from:
// https://www.youtube.com/watch?v=2ZphE5HcQPQ&t=179s
class Game_object {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

// let player = {
//     x: 0, //declorating coordinates of the 
//     y: 150,
//     width: 75, //size of the square
//     height: 75,
//     xChange: 0,
//     yChange: 0,
//     energy: 100,
//     rotation_angle: 0, //rotation angle in radians
//     health: 100,
//     bullets_in_clip: 30,
//     amount_bullets: 0,
//     reloading: false
// }

class Player extends Game_object {
    constructor(x, y) {
        // super is calling the constructor of Game_object 
        // about super is taken:
        // https://www.youtube.com/watch?v=2ZphE5HcQPQ&t=2066s
        super(x, y, 75, 75, 'cyan');
        this.xChange = 0;
        this.yChange = 0;
        this.energy = 100;
        this.rotation_angle = (3 * Math.PI) / 2; //for hull
        this.gun_rotation_angle = (3 * Math.PI) / 2;
        this.health = 100;
        this.bullets_in_clip = 30;
        this.amount_bullets = 0;
        this.reloading = false;
        this.max_health = 100;
        this.gunOffsetX = -85;
        this.gunOffsetY = -20;
        this.is_moving = false;
        this.invulnerability = false;
        this.used_cheats = false;
        this.amount_of_mines = 2;
    }
}

// function create_enemy() {
//     return {
//         x: randint(0, canvas.width - 35),
//         y: randint(0, canvas.height - 35),
//         width: 35,
//         height: 35,
//         yChange: 0,
//         xChange: 0,
//         waiting: true,
//         last_update: Date.now(),
//         next_update: randint(1000, 5000), //randomly between 1 to 5 seconds (because it counts in milliseconds)
//         detection_radius: 200, //200px
//         health: 20,
//         damage: 10,
//         cooldown: false,
//         cooldown_start_time: 0
//     }
// }

class Enemy extends Game_object {
    constructor(x, y, width = 35, height = 45, health = 20, max_health = 20, detection_radius = 200, frameX = 0, frameY = 0) {
        super(x, y, width, height, 'red');
        this.yChange = 0;
        this.xChange = 0;
        this.waiting = true;
        this.last_update = Date.now();
        this.next_update = randint(1000, 5000);
        this.detection_radius = detection_radius;
        this.health = health;
        this.max_health = max_health;
        this.damage = 10;
        this.cooldown = false;
        this.cooldown_start_time = 0;
        this.frameX = frameX;
        this.frameY = frameY;
        this.attack = false;
        this.attack_start_time = 0;
    }
}

class Boss extends Game_object {
    constructor(x, y, width = 85, height = 75, health = 100, max_health = 100) {
        super(x, y, width, height, 'red');
        this.last_update = Date.now();
        this.next_update = randint(1000, 5000);
        this.health = health;
        this.max_health = max_health;
        this.damage = 30;
        this.last_time_spawn = Date.now();
        this.spawn_enemies_time = randint(10000, 20000);
        this.last_time_shoot = Date.now();
        this.shoot_time = randint(1000, 15000);
        this.last_time_spawn_plant = Date.now();
        this.spawn_plant_time = randint(2000, 10000);
        this.enough_plants = false;
    }
}

class Plant extends Game_object {
    constructor(x, y, width = 40, height = 40) {
        super(x, y, width, height, 'yellow');
        this.damage = 5;
        this.last_time_hit = Date.now();
    }
}

// function create_shooting_enemy() {
//     return {
//         x: randint(0, canvas.width - 35),
//         y: randint(0, canvas.height - 35),
//         width: 30,
//         height: 30,
//         yChange: 0,
//         xChange: 0,
//         waiting: true,
//         last_update: Date.now(),
//         next_update: randint(1000, 5000), //randomly between 1 to 5 seconds (because it counts in milliseconds)
//         detection_radius: 200, //200px
//         health: 30,
//         damage: 10,
//         detection_radius: 350,
//         shooting_radius: 300,
//         shooting: false
//     }
// }
class Shooting_enemy extends Enemy {
    constructor(x, y) {
        super(x, y, 40, 40, 30, 30, 350, 0, 0);
        this.shooting_radius = 300;
        this.shoot = false;
        this.color = 'yellow';
        this.last_time_shoot = 0;
        this.need_kit = false;
        this.bullets_in_reserve = 30;
        this.need_bullet_kit = false;
    }
}

// function create_bullet() {
//     return {
//         x: player.x + player.width / 2, //appears in the players centre
//         y: player.y + player.height / 2,
//         width: 10,
//         height: 5,
//         damage: 10,
//         speed: 30,
//         angle: player.rotation_angle //bullet initial direction
//     }
// }
class Bullet extends Game_object {
    constructor(x, y, angle, owner) {
        super(x, y, 7.5, 7.5, 'blue');
        this.damage = 10;
        this.speed = 30;
        this.angle = angle;
        this.owner = owner;
    }
}

class Mine extends Game_object {
    constructor(x, y, start_time, mine_is_placed, damage = 50, explode_radius = 400) {
        super(x, y, 15, 15, 'yellow');
        this.damage = damage;
        this.explode_radius = explode_radius;
        this.mine_is_placed = mine_is_placed;
        this.start_time = start_time;
    }
}

// function create_bullet_ammo() {
//     return {
//         amount: 30,
//         x: randint(10, canvas.width - 20),
//         y: randint(10, canvas.height - 20),
//         width: 20,
//         height: 20,
//         frameX: 1,
//         frameY: 1,
//     }
// }
class Ammo extends Game_object {
    constructor(x, y, amount = 30) {
        super(x, y, 20, 20, 'brown');
        this.amount = amount;
        this.frameX = 1;
        this.frameY = 1;
    }
}

class Health_ammo extends Game_object {
    constructor(x, y, health_to_add = 30) {
        super(x, y, 20, 20, 'red');
        this.health_to_add = health_to_add;
        this.frameX = 0;
        this.frameY = 0;
    }
}

let bullet_ammo_list = [];
let health_ammo_list = [];
let normal_enemies = [];
let bullets = [];
let shooting_enemies = [];
let enemies = [];
let bosses = [];
let plants = [];
let mines = [];

let player;
let enemy1;
let enemy2;
let enemy3;
let shooting_enemy1;
let shooting_enemy2;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.querySelector("canvas");
    //                   find         canvas
    context = canvas.getContext('2d');

    player = new Player(0, 150);

    // enemy1 = create_enemy();
    // enemy2 = create_enemy();
    // enemy3 = create_enemy();
    // normal_enemies.push(enemy1, enemy2, enemy3);

    // creating 3 normal enemies
    for (let i = 1; i <= 3; i++) {
        normal_enemies.push(create_enemy());
    }

    // shooting_enemy1 = create_shooting_enemy();
    // shooting_enemy2 = create_shooting_enemy();
    // shooting_enemies.push(shooting_enemy1, shooting_enemy2);
    // concat is taken from:
    // https://www.w3schools.com/jsref/jsref_concat_array.asp
    enemies = normal_enemies.concat(shooting_enemies);

    player.x = (canvas.width / 2) - player.width / 2;
    player.y = (canvas.height / 2) - player.height / 2;

    window.addEventListener('keydown', activate, false);
    window.addEventListener('keyup', deactivate, false);

    init_time();

    load_assets([
        { 'var': ammo_image, 'url': 'static/images/ammo.png' },
        { 'var': hull, 'url': 'static/images/Hull_02.png' },
        { 'var': gun, 'url': 'static/images/gun.png' },
        { 'var': track_a, 'url': 'static/images/Track_2_A.png' },
        { 'var': track_b, 'url': 'static/images/Track_2_B.png' },
        { 'var': exhaust, 'url': 'static/images/Exhaust_Fire.png' },
        { 'var': normal_enemies_image, 'url': 'static/images/mine_drone_idle.png' },
        { 'var': normal_enemies_cooldown_image, 'url': 'static/images/mine_drone_cooldown.png' },
        { 'var': normal_enemies_attack_image, 'url': 'static/images/mine_drone_exploding.png' },
        { 'var': shooting_enemies_image, 'url': 'static/images/elec_drone_attack.png' },
        { 'var': bullet_image, 'url': 'static/images/electrical_area.png' },
        { 'var': map_image, 'url': 'static/images/map.png' },
        { 'var': plant_image, 'url': 'static/images/plant.png' },
        { 'var': boss_image, 'url': 'static/images/boss.png' },
        { 'var': tower_move_sound, 'url': 'static/sounds/Turret.ogg' },
        { 'var': shooting_enemies_sound, 'url': 'static/sounds/Machinegun.ogg' },
        { 'var': shoot_sound, 'url': 'static/sounds/Gun.ogg' },
        { 'var': engine_sound, 'url': 'static/sounds/Engineidle.ogg' },
        { 'var': engine_shift_sound, 'url': 'static/sounds/Enginehigh.ogg' },
        { 'var': mine_image, 'url': 'static/images/bomb.png' },
        { 'var': reload_sound, 'url': 'static/sounds/reload.mp3' },
        { 'var': background_music, 'url': 'static/sounds/background.wav' }
    ], draw);
    background_music.loop = true;
    background_music.volume = 0.4;
    background_music.play();
}


function draw() {


    request_id = window.requestAnimationFrame(draw); //store the animation in variable
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    if (normal_enemies.length < 3) {
        normal_enemies.push(create_enemy());
    }

    if ((shooting_enemies.length < 2) && (total_seconds > 15)) {
        shooting_enemies.push(create_shooting_enemy())
    }
    enemies = normal_enemies.concat(shooting_enemies);

    //draw the background
    draw_background();

    display_time();

    if (bosses.length !== 0) {
        draw_boss();
        handle_boss(now);
    }

    if (plants) {
        draw_plants();
        check_for_collision_plants(now);
    }

    centre_x = player.x + player.width / 2;
    centre_y = player.y + player.height / 2;
    // draw the player
    draw_player(centre_x, centre_y);

    // draw the gun rotation
    draw_gun(centre_x, centre_y);

    // draw the laser
    if (laser === true) {
        draw_laser(centre_x, centre_y);
    }

    // let bullet_x = player.x + player.width / 2 + offset * Math.cos(player.gun_rotation_angle);
    // let bullet_y = player.y + player.height / 2 + offset * Math.sin(player.gun_rotation_angle);

    // create shooting enemy
    if (total_seconds === 15 && !spawn_at_15) {
        init_shooting_enemy();
        spawn_at_15 = true;
    }

    if (total_seconds !== 0 && total_seconds % 60 === 0 && bosses.length === 0) {
        bosses.push(create_boss());
    }

    if (place_mine && player.amount_of_mines > 0) {
        mines.push(new Mine(centre_x, centre_y, now, true));
        atLeastOneMineIsPlaced = true;
        player.amount_of_mines--;
        place_mine = false;
    }
    if (atLeastOneMineIsPlaced) {
        draw_mine(now);
    }

    handle_shooting(now, centre_x, centre_y);

    draw_reloading();

    update_enemy_movement(now);

    update_shooting_enemy_movement(now);

    medical_and_ammo_for_shooting_enemies();

    //Draw the enemy
    draw_normal_enemies();

    //Draw the shooting_enemies
    draw_shooting_enemies();

    //Draw the bullets
    draw_bullets();

    //Draw the bullet_ammo + health_ammo
    draw_bullet_ammo_medkit();

    //Reloading
    handle_reloading(now);

    //check for collision for bullet_ammo
    check_for_collision_bullet_ammo();

    //check for collision for health_ammo
    check_for_collision_medkit();

    // check for collision
    check_for_collision_with_bullet_playerEnemy();

    //check if the enemy collides with player
    check_for_collision_with_playerEnemy(now);

    //update the player
    update_player();

}



function draw_mine(now) {
    for (let mine of mines) {
        if (mine.mine_is_placed) {
            // context.fillStyle = mine.color;
            // context.fillRect(mine.x, mine.y, mine.width, mine.height);
            context.drawImage(mine_image, 0, 0, 62, 64, mine.x, mine.y, mine.width, mine.height);
        }
        if (((now - mine.start_time) >= 3000) && mine.mine_is_placed) {
            let targets = normal_enemies.concat(bosses, shooting_enemies);
            let damaged_enemies = [];
            for (let enemy of targets) {
                let enemy_x = enemy.x + enemy.width / 2;
                let enemy_y = enemy.y + enemy.height / 2;
                let mine_x = mine.x + mine.width / 2;
                let mine_y = mine.y + mine.height / 2;
                dx = mine_x - enemy_x;
                dy = mine_y - enemy_y;
                if (compute_distance(dx, dy) <= mine.explode_radius) {
                    enemy.health -= mine.damage;
                    damaged_enemies.push(enemy);
                }
            }
            mine.mine_is_placed = false;
            let mine_index = mines.indexOf(mine);
            mines.splice(mine_index, 1);
            // about ForEach:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
            damaged_enemies.forEach(enemy => {
                if (enemy.health <= 0) {
                    kills++;
                    delete_enemy(enemy);
                }
            });

        }
    }
}

function delete_enemy(enemy) {
    // Remove if the health is less than 0
    // about splice taken from:
    // https://www.w3schools.com/jsref/jsref_splice.asp
    let enemy_index = enemies.indexOf(enemy);
    enemies.splice(enemy_index, 1);
    // about includes taken from:
    // https://www.w3schools.com/jsref/jsref_includes_array.asp#:~:text=The%20includes()%20method%20returns,()%20method%20is%20case%20sensitive.
    if (normal_enemies.includes(enemy)) {
        enemy_index = normal_enemies.indexOf(enemy);
        normal_enemies.splice(enemy_index, 1);
    } else if (bosses.includes(enemy)) {
        enemy_index = normal_enemies.indexOf(enemy);
        bosses.splice(enemy_index, 1);
        plants = [];
    } else {
        enemy_index = shooting_enemies.indexOf(enemy);
        shooting_enemies.splice(enemy_index, 1);
    }
}

function handle_boss(now) {
    for (let boss of bosses) {
        if ((now - boss.last_time_spawn) >= boss.spawn_enemies_time) {
            boss.spawn_enemies_time = randint(5000, 20000)
            boss.last_time_spawn = now;
            for (let i = 1; i <= 2; i++) {
                normal_enemies.push(create_enemy());
            }
            shooting_enemies.push(create_shooting_enemy());
        }
        if ((now - boss.last_time_shoot) >= boss.shoot_time) {
            boss.last_time_shoot = now;
            boss.shoot_time = randint(1000, 15000)
            let boss_x = boss.x + boss.width / 2;
            let boss_y = boss.y + boss.height / 2;
            // 360 / 8 = 45 degree
            // 45 in radians
            let radians = 45 * (Math.PI / 180);
            for (let i = 1; i <= 8; i++) {
                // every new bullet has different angle (45 degree between each of them)
                let boss_bullet = new Bullet(boss_x, boss_y, (i * radians), 'boss');
                bullets.push(boss_bullet);
            }
        }
        if (((now - boss.last_time_spawn) >= boss.spawn_plant_time) && !boss.enough_plants) {
            for (let i = 1; i <= 2; i++) {
                plants.push(create_plant());
            }
            boss.enough_plants = true;
        }

    }
}

function draw_plants() {
    for (let plant of plants) {
        // context.fillStyle = plant.color;
        // context.fillRect(plant.x, plant.y, plant.width, plant.height);
        context.drawImage(plant_image, 0, 0, 30, 28, plant.x, plant.y, plant.width, plant.height);
    }
}

function check_for_collision_plants(now) {
    for (let plant of plants) {
        // hit once in 1.5 second
        if (collides(plant, player) && ((now - plant.last_time_hit) >= 1500) && !player.invulnerability) {
            player.health -= plant.damage;
            plant.last_time_hit = now;
        }
    }
}

function init_shooting_enemy() {
    // creating 2 shooting enemies
    for (let i = 1; i <= 2; i++) {
        shooting_enemies.push(create_shooting_enemy());
    }
}

function display_time() {
    context.font = "20px serif";
    context.fillStyle = "white";
    context.fillText(minutes + ":" + seconds, 10, 60);
}

function draw_background() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#6abe30';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(map_image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

function draw_player() {
    // all this canvas context property were found here:
    // https://www.w3schools.com/tags/ref_canvas.asp

    //draw the hull without rotation
    context.save(); //Saves the state of the current drawing context and all its attributes

    context.translate(centre_x, centre_y); // this moves the origin of the canvas to the players centre

    // draw the exhaust
    if (shift && player.is_moving && player.energy > 0) {
        context.drawImage(exhaust, 0, 0, 128, 128, (-player.width / 4) + 8, (player.height / 4) + 3, 50, 50);
        context.drawImage(exhaust, 0, 0, 128, 128, (- player.width / 4) - 21, (player.height / 4) + 3, 50, 50);
    }

    // draw tracks
    let current_track = current_track_frame === 0 ? track_a : track_b;
    context.drawImage(current_track, 0, 0, 42, 246, (-player.width / 2) + 10, -player.height / 2, 10, player.height);
    context.drawImage(current_track, 0, 0, 42, 246, (player.width / 2) - 20, -player.height / 2, 10, player.height);


    context.drawImage(hull, 0, 0, 256, 256, -player.width / 2, -player.height / 2, player.width, player.height);


    context.restore(); //reset the canvas origin after drawing the player
}

function draw_gun() {
    context.save(); //Saves the state of the current drawing context and all its attributes

    context.translate(centre_x, centre_y); // this moves the origin of the canvas to the players centre

    context.rotate(player.gun_rotation_angle); //rotates the tower of the tank

    //context.fillStyle = player.color;
    //context.fillRect(-player.width / 2, -player.height / 2, player.width, player.height); //draw the player at the centre of the canvas origin
    context.drawImage(gun, 0, 0, 436, 300, -player.width / 2, -player.height / 2, player.width, player.height);

    context.restore(); //reset the canvas origin after drawing the player
}

function draw_laser() {
    //a little bit of code is taken from:
    // https://stackoverflow.com/questions/23598547/draw-a-line-from-x-y-with-a-given-angle-and-length
    // its modified
    context.setLineDash([]);
    context.strokeStyle = '#E5E4E2';
    context.beginPath();
    let laser_x = player.x + player.width / 2 + offset * Math.cos(player.gun_rotation_angle);
    let laser_y = player.y + player.height / 2 + offset * Math.sin(player.gun_rotation_angle);
    context.moveTo(laser_x, laser_y);
    context.lineTo(centre_x + 1500 * Math.cos(player.gun_rotation_angle), centre_y + 1500 * Math.sin(player.gun_rotation_angle));
    context.stroke();
}

function handle_shooting(now, centre_x, centre_y) {
    if (shoot && ((now - last_time_shoot) >= shoot_cooldown) && player.bullets_in_clip > 0 && player.reloading === false) {
        shoot_sound.playbackRate = 5.0;
        shoot_sound.volume = 0.5;
        shoot_sound.play();
        // if (shoot_sound.currentTime === 0.2) {
        //     shoot_sound.currentTime = 0.0;
        // }
        bullets.push(create_bullet());
        shoot = false;
        last_time_shoot = now;
        // decrement by 1
        player.bullets_in_clip--;
        // console.log(player.bullets);

        // if player has no bullets it will draw a line to the closest ammo kit
    } else if (player.bullets_in_clip === 0 && player.amount_bullets === 0) {
        let closest_distance = 5000;
        let closest_x;
        let closest_y;
        // find the closest one
        for (let bullet_ammo of bullet_ammo_list) {

            let bullet_x = bullet_ammo.x + bullet_ammo.width / 2;
            let bullet_y = bullet_ammo.y + bullet_ammo.height / 2;
            dx = player_x - bullet_x;
            dy = player_y - bullet_y;
            let distance = compute_distance(dx, dy);
            if (distance < closest_distance) {
                closest_distance = distance;
                closest_x = bullet_x;
                closest_y = bullet_y;
            }
        }
        // about dashes:
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
        context.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        context.strokeStyle = '#FFD700';
        context.beginPath();

        context.moveTo(centre_x, centre_y);
        context.lineTo(closest_x, closest_y);
        context.stroke();

    }
}




function draw_reloading() {
    // let top_up_amount = player.amount_bullets >= 30 ? 30 : player.amount_bullets;
    // bullets_html = document.querySelector('#bullets');
    let what_to_show = player.reloading === false ? player.bullets_in_clip + "/" + player.amount_bullets : 'reloading';
    let show_kills = "kills: " + kills;
    // bullets_html.innerHTML = what_to_show;
    // let score_html = document.querySelector('#kills');
    // score_html.innerHTML = "kills: " + kills;
    context.font = '20px sans-serif';
    context.fillStyle = 'white';
    context.fillText(what_to_show, 10, 85);
    context.fillText(show_kills, 10, 110);

}

function update_enemy_movement(now) {
    for (let enemy of enemies) {
        if (enemy.cooldown === false) {
            //Now i will include feature that when the player within the enemy radius it will run to the player

            //calculate the distance between the player and the enemy

            //first we need to find the centre of the player and the centre of the enemy
            player_x = player.x + player.width / 2;
            player_y = player.y + player.height / 2;

            enemy_x = enemy.x + enemy.width / 2;
            enemy_y = enemy.y + enemy.height / 2;

            dx = player_x - enemy_x;
            dy = player_y - enemy_y;

            let distance = compute_distance(dx, dy);

            if (distance < enemy.detection_radius) {
                if (shooting_enemies.includes(enemy) && distance < enemy.shooting_radius && enemy.need_kit === false) {
                    enemy.shoot = true;
                } else {
                    // code for calculating the Xchange and Ychange is taken from this video, its a little bit modified
                    // https://www.youtube.com/watch?v=C4_iRLlPNFc&t=4256s
                    angle = Math.atan2(dy, dx);
                    enemy.waiting = false;
                    enemy.xChange = Math.cos(angle) * 6; //speed towards player (6 represents speeds)
                    enemy.yChange = Math.sin(angle) * 6;
                }
            }
            // this allow the enemies to move in random direction and stand at random period of time
            else if ((now - enemy.last_update) > enemy.next_update) {
                enemy.waiting = !enemy.waiting; //change the state
                if (enemy.waiting === false) {
                    enemy.frameX = (enemy.frameX + 1) % 3;
                    enemy.xChange = randint(-4, 4); // the range between -4 and 4 prevents the enemy to move too fast 
                    enemy.yChange = randint(-4, 4);
                }

                enemy.last_update = now; //reset timer
                enemy.next_update = randint(1000, 5000); //set next random interval
            }
        }

    }
}

function update_shooting_enemy_movement(now) {
    for (let enemy of shooting_enemies) {
        // display number of bullets on top of the enemy
        context.font = '10px sans-serif';
        context.fillStyle = 'white';
        context.fillText(enemy.bullets_in_reserve, (enemy.x + enemy.width / 2) - 5, enemy.y - 15);

        if (enemy.shoot === true && (now - enemy.last_time_shoot) > shooting_enemy_cooldown && enemy.need_kit === false && enemy.bullets_in_reserve > 0) {
            // about play back speed:
            //https://stackoverflow.com/questions/23618845/controlling-audio-speed-of-a-mp3-file
            shooting_enemies_sound.playbackRate = 2.0;
            shooting_enemies_sound.volume = 0.4;
            shooting_enemies_sound.play();
            enemy.bullets_in_reserve--;
            enemy.xChange = 0;
            enemy.yChange = 0;
            player_x = player.x + player.width / 2;
            player_y = player.y + player.height / 2;

            enemy_x = enemy.x + enemy.width / 2;
            enemy_y = enemy.y + enemy.height / 2;

            dx = player_x - enemy_x;
            dy = player_y - enemy_y;

            let enemy_bullet = new Bullet(enemy_x, enemy_y, Math.atan2(dy, dx), 'shooting_enemy');
            bullets.push(enemy_bullet);
            enemy.shoot = false;
            enemy.last_time_shoot = now;
        }
        if (enemy.bullets_in_reserve <= 0) {
            enemy.need_bullet_kit = true;
        } else {
            enemy.need_bullet_kit = false;
        }
        // if the shooting_enemy has at max 15 hp and in its detection distance is kit, then it goes and get it
        if (enemy.health <= 15) {
            enemy.need_kit = true;
        } else {
            enemy.need_kit = false;
        }
    }
}

function medical_and_ammo_for_shooting_enemies() {
    for (let enemy of shooting_enemies) {
        if (enemy.need_kit) {
            for (let kit of health_ammo_list) {
                let kit_x = kit.x + kit.width / 2;
                let kit_y = kit.y + kit.height / 2;

                enemy_x = enemy.x + enemy.width / 2;
                enemy_y = enemy.y + enemy.height / 2;

                dx = kit_x - enemy_x;
                dy = kit_y - enemy_y;

                if (compute_distance(dx, dy) < enemy.detection_radius) {
                    enemy.shoot = false;
                    enemy.waiting = false;
                    angle = Math.atan2(dy, dx);
                    enemy.xChange = Math.cos(angle) * 6; //speed towards player (6 represents speeds)
                    enemy.yChange = Math.sin(angle) * 6;
                    if (collides(enemy, kit)) {
                        enemy.need_kit = false;
                        enemy.health += kit.health_to_add;
                        if (enemy.health > enemy.max_health) {
                            enemy.health = enemy.max_health;
                        }
                        let health_ammo_index = health_ammo_list.indexOf(kit);
                        health_ammo_list.splice(health_ammo_index, 1);

                    }
                } else {
                    enemy.need_kit = false;
                }
            }
        }
        if (enemy.need_bullet_kit) {
            for (let kit of bullet_ammo_list) {
                let kit_x = kit.x + kit.width / 2;
                let kit_y = kit.y + kit.height / 2;

                enemy_x = enemy.x + enemy.width / 2;
                enemy_y = enemy.y + enemy.height / 2;

                dx = kit_x - enemy_x;
                dy = kit_y - enemy_y;

                if (compute_distance(dx, dy) < enemy.detection_radius) {
                    enemy.shoot = false;
                    enemy.waiting = false;
                    angle = Math.atan2(dy, dx);
                    enemy.xChange = Math.cos(angle) * 6; //speed towards player (6 represents speeds)
                    enemy.yChange = Math.sin(angle) * 6;
                    if (collides(enemy, kit)) {
                        enemy.need_bullet_kit = false;
                        enemy.bullets_in_reserve += 30;
                        let bullet_ammo_index = bullet_ammo_list.indexOf(kit);
                        bullet_ammo_list.splice(bullet_ammo_index, 1);
                    }
                } else {
                    enemy.need_bullet_kit = false;
                    enemy.waiting = false;
                }
            }
        }
    }
}

function draw_normal_enemies() {
    for (let enemy of normal_enemies) {
        if (enemy.waiting === false) {
            enemy.x += enemy.xChange;
            enemy.y += enemy.yChange;
            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
                enemy.xChange *= -1;
            }
            if (enemy.y < 0 || enemy.y + enemy.height > canvas.height) {
                enemy.yChange *= -1;
            }
        }
        if (enemy.attack === false) {
            let enemy_image = enemy.cooldown === false ? normal_enemies_image : normal_enemies_cooldown_image;
            // context.fillStyle = enemy_color;
            context.drawImage(enemy_image, enemy.frameX * 16, 0, 16, 21, enemy.x, enemy.y, enemy.width, enemy.height);
            // context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            context.drawImage(normal_enemies_attack_image, 0, 0, 18, 22, enemy.x, enemy.y, enemy.width, enemy.height);
        }
        //Draw the health bar
        // this rectangle draws first and acts like a background for the next health bar
        context.fillStyle = 'tomato';
        context.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);

        //this health bar going to change dynamically
        context.fillStyle = 'aquamarine';
        context.fillRect(enemy.x, enemy.y - 10, (enemy.health / enemy.max_health) * enemy.width, 5);
    }
}

function draw_shooting_enemies() {
    for (let enemy of shooting_enemies) {
        if (enemy.waiting === false) {
            enemy.x += enemy.xChange;
            enemy.y += enemy.yChange;
            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
                enemy.xChange *= -1;
            }
            if (enemy.y < 0 || enemy.y + enemy.height > canvas.height) {
                enemy.yChange *= -1;
            }
        }
        if (enemy.shoot === true) {
            enemy.frameX = (1 + enemy.frameX) % 5;
            context.drawImage(shooting_enemies_image, enemy.frameX * 32, enemy.frameY * 32, 32, 32, enemy.x, enemy.y, enemy.width, enemy.height);

        } else {
            context.drawImage(shooting_enemies_image, 0, 0, 32, 32, enemy.x, enemy.y, enemy.width, enemy.height);
        }

        context.fillStyle = 'tomato';
        context.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);

        //this health bar going to change dynamically
        context.fillStyle = 'aquamarine';
        context.fillRect(enemy.x, enemy.y - 10, (enemy.health / enemy.max_health) * enemy.width, 5);
    }
}

function draw_boss() {
    for (let boss of bosses) {
        // context.fillStyle = boss.color;
        // context.fillRect(boss.x, boss.y, boss.width, boss.height);
        context.drawImage(boss_image, 0, 0, 137, 114, boss.x, boss.y, boss.width, boss.height);

        context.fillStyle = 'tomato';
        context.fillRect(boss.x, boss.y - 10, boss.width, 5);

        //this health bar going to change dynamically
        context.fillStyle = 'aquamarine';
        context.fillRect(boss.x, boss.y - 10, (boss.health / boss.max_health) * boss.width, 5);
    }
}


function draw_bullets() {
    for (let bullet of bullets) {
        let bullet_color = bullet.owner === 'boss' ? 'red' : bullet.color;
        context.fillStyle = bullet_color;
        let add_to_angle = bullet.owner === 'boss' ? 0.09 : 0;
        bullet.angle += add_to_angle;
        // i used same logic here as for the enemies 
        // again: 
        // https://www.youtube.com/watch?v=C4_iRLlPNFc&t=4256s
        bullet.x += bullet.speed * Math.cos(bullet.angle); //speed multiply by the xChange
        bullet.y += bullet.speed * Math.sin(bullet.angle);

        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        // context.drawImage(bullet_image, 0, 0, 32, 32, bullet.x, bullet.y, bullet.width, bullet.height);


        // if (bullet.x > canvas.width && bullet.y > canvas.height && bullet.x < 0 && bullet.y < 0) {
        //   index_bullet = bullets.indexOf(bullet);
        //   delete bullets[index_bullet];
        //   console.log(bullets);
        // }
    }

    // .filters allows to filter the bullets list by creating a new array (bullets) and iterates the bullets array and if bullet satisfy the condition then it adds to a bullets list
    // .filter information is taken form 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    bullets = bullets.filter((bullet) => (bullet.x < canvas.width && bullet.y < canvas.height && bullet.x > 0 && bullet.y > 0));
}

function draw_bullet_ammo_medkit() {
    if (bullet_ammo_list.length < 3) {
        bullet_ammo_list.push(create_bullet_ammo());
    }

    if (health_ammo_list.length < 3) {
        health_ammo_list.push(create_health_ammo());
    }


    for (let bullet_ammo of bullet_ammo_list) {
        context.fillStyle = bullet_ammo.color;
        context.drawImage(ammo_image, bullet_ammo.frameX * ammo_size, bullet_ammo.frameY * ammo_size, ammo_size, ammo_size, bullet_ammo.x, bullet_ammo.y, bullet_ammo.width, bullet_ammo.height);

        // context.fillRect(bullet_ammo.x, bullet_ammo.y, bullet_ammo.width, bullet_ammo.height);
    }
    for (let health_ammo of health_ammo_list) {
        context.fillStyle = health_ammo.color;
        context.drawImage(ammo_image, health_ammo.frameX * ammo_size, health_ammo.frameY * ammo_size, ammo_size, ammo_size, health_ammo.x, health_ammo.y, health_ammo.width, health_ammo.height);

        // context.fillRect(bullet_ammo.x, bullet_ammo.y, bullet_ammo.width, bullet_ammo.height);
    }
}

function handle_reloading(now) {
    if ((player.bullets_in_clip === 0 && player.amount_bullets > 0 && player.reloading === false) || (reloading_on_press && player.bullets_in_clip !== 30 && player.amount_bullets !== 0 && player.reloading === false)) {
        player.reloading = true;
        start_to_reload = now;
        reloading_on_press = false;
        reload_sound.volume = 0.6;
        reload_sound.play();
        reload_sound.loop = true;
    }

    if ((player.reloading === true && now - start_to_reload) > reloading_time) {
        reload_sound.pause();
        // if (player.amount_bullets >= 30){
        // player.amount_bullets 

        // }
        // console.log('Before');
        // console.log('clip', player.bullets_in_clip, 'reserve', player.amount_bullets);

        let top_up_amount = 30 - player.bullets_in_clip;
        let needs_to_be_added = Math.min(top_up_amount, player.amount_bullets);
        // if (player.bullets_in_clip === 0) {
        //     top_up_amount = player.amount_bullets >= 30 ? 30 : player.amount_bullets;
        // } else if (reloading_on_press) {
        //     top_up_amount = 30 - player.bullets_in_clip;
        // }        //15             //20
        // if (top_up_amount < player.amount_bullets) {
        //     player.bullets_in_clip += top_up_amount;
        //     player.amount_bullets -= top_up_amount;
        // }
        player.bullets_in_clip += needs_to_be_added;
        player.amount_bullets -= needs_to_be_added;
        player.reloading = false;

        // console.log('after');
        // console.log('clip', player.bullets_in_clip, 'reserve', player.amount_bullets);
    }
}

function check_for_collision_bullet_ammo() {
    for (let bullet_ammo of bullet_ammo_list) {
        if (collides(bullet_ammo, player)) {
            player.amount_bullets += bullet_ammo.amount;
            if (player.amount_bullets > 180) {
                player.amount_bullets = 180;
            }
            let bullet_ammo_index = bullet_ammo_list.indexOf(bullet_ammo);
            bullet_ammo_list.splice(bullet_ammo_index, 1);
        }
    }
}

function check_for_collision_medkit() {
    for (let health_ammo of health_ammo_list) {
        for (let enemy of enemies) {
            if (collides(health_ammo, enemy) && enemy.health < enemy.max_health) {
                enemy.health += health_ammo.health_to_add;
                if (enemy.health > enemy.max_health) {
                    enemy.health = enemy.max_health;
                }
                let health_ammo_index = health_ammo_list.indexOf(health_ammo);
                health_ammo_list.splice(health_ammo_index, 1);
            }
        }
        if (collides(health_ammo, player)) {
            player.health += health_ammo.health_to_add;
            if (player.health > player.max_health) {
                player.health = player.max_health;
            }
            let health_ammo_index = health_ammo_list.indexOf(health_ammo);
            health_ammo_list.splice(health_ammo_index, 1);
        }
    }
}

function check_for_collision_with_bullet_playerEnemy() {
    for (let bullet of bullets) {
        for (let enemy of enemies) {
            if (collides(bullet, enemy) && (bullet.owner !== 'shooting_enemy' && bullet.owner !== 'boss')) {
                enemy.health -= bullet.damage;
                if (enemy.health <= 0) {
                    kills++;
                    delete_enemy(enemy);
                }
                // remove the bullet after it collides with enemy
                let bullet_index = bullets.indexOf(bullet);
                bullets.splice(bullet_index, 1);
            }
        }
        if (collides(bullet, player) && bullet.owner !== 'player') {
            if (player.invulnerability === false) {
                player.health -= bullet.damage;
                player.health = Math.max(0, player.health);
            }
            let bullet_index = bullets.indexOf(bullet);
            bullets.splice(bullet_index, 1);
        }
        for (let boss of bosses) {
            if (collides(bullet, boss) && (bullet.owner !== 'boss' && bullet.owner !== 'shooting_enemy')) {
                boss.health -= bullet.damage;

                let bullet_index = bullets.indexOf(bullet);
                bullets.splice(bullet_index, 1);
                if (boss.health <= 0) {
                    kills++;
                    bosses = [];
                    plants = [];
                }
            }
        }
    }
}

function check_for_collision_with_playerEnemy(now) {
    for (let enemy of normal_enemies) {
        if (collides(enemy, player) && enemy.cooldown === false && enemy.attack === false) {
            enemy.attack = true;
            enemy.attack_start_time = now;
        }
        if (enemy.attack === true && (now - enemy.attack_start_time) > enemey_attack_max_time) {
            enemy.attack = false;
            if (player.invulnerability === false) {
                player.health -= enemy.damage;
                // ensures the health doesnt go negative
                player.health = Math.max(0, player.health);
            }
            enemy.cooldown = true;
            enemy.frameX = 0;
            enemy.cooldown_start_time = now;
            enemy.xChange = 0;
            enemy.yChange = 0;
        }
        else if (enemy.attack === true && !((now - enemy.attack_start_time) > enemey_attack_max_time)) {
            enemy.frameX = 0;
        }

        if (enemy.cooldown === true && (now - enemy.cooldown_start_time) > enemey_cooldown_max_time) {
            enemy.cooldown = false;
        }
    }
}

function update_player() {
    if (player.health === 0) {
        stop();
    } else if (player.health <= 40) {
        let closest_distance = 5000;
        let closest_x;
        let closest_y;
        // find the closest one
        for (let kit of health_ammo_list) {

            let kit_x = kit.x + kit.width / 2;
            let kit_y = kit.y + kit.height / 2;
            dx = player_x - kit_x;
            dy = player_y - kit_y;
            let distance = compute_distance(dx, dy);
            if (distance < closest_distance) {
                closest_distance = distance;
                closest_x = kit_x;
                closest_y = kit_y;
            }
        }
        // about dashes:
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
        context.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
        context.strokeStyle = '#DE3163';
        context.beginPath();

        context.moveTo(centre_x, centre_y);
        context.lineTo(closest_x, closest_y);
        context.stroke();

    }

    if (shift && player.energy > 0 && (moveDown || moveLeft || moveRight || moveUp || rotate_left || rotate_right)) {
        player.energy -= energy_consumption_rate;
        engine_sound.pause();
        engine_shift_sound.volume = 0.2;
        engine_shift_sound.play();
        engine_shift_sound.loop = true;
        // max function is taken from:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
        player.energy = Math.max(player.energy, 0); //ensures that the energy doesnt go below 0
    } else if (player.energy < max_energy && !shift) {
        player.energy += energy_recover_rate;
        //ensures that the energy doesnt go higher than max_energy
        player.energy = Math.min(player.energy, max_energy);
        engine_shift_sound.pause();
    }

    // the code below represents the short code for 'if statement' 
    // the idea of Conditional (ternary) operator is taken from: 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator

    let speed_change = shift && player.energy > 0 ? 0.8 : 0.6;

    if ((moveRight || moveDown || moveLeft || moveUp) && !(moveRight && moveDown && moveLeft && moveUp) && !(moveDown && moveUp) && !(moveLeft && moveRight)) {
        player.is_moving = true;
        engine_sound.volume = 0.2;
        engine_sound.play();
        engine_sound.loop = true;
        current_track_frame = (current_track_frame + 1) % 2;
    } else {
        player.is_moving = false;
        engine_sound.pause();
    }

    if (moveRight) {
        player.xChange += speed_change;
    }
    if (moveDown) {
        player.yChange += speed_change;
    }
    if (moveUp) {
        player.yChange -= speed_change;
    }
    if (moveLeft) {
        player.xChange -= speed_change;
    }

    // Update the player
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // physics
    player.xChange = player.xChange * 0.9;//friction
    player.yChange = player.yChange * 0.9;//friction

    // check if the player hits the boundary of the map
    // horizontal
    if (player.x < 0) {
        player.x = 0;
        player.xChange = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.xChange = 0;
    }

    // vertical
    if (player.y < 0) {
        player.y = 0;
        player.yChange = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.yChange = 0;
    }

    // draw energy bar
    context.fillStyle = 'yellow';
    context.fillRect(10, 10, player.energy, 10);

    // draw  health bar
    let color = player.invulnerability === false ? 'red' : '#CC5500';
    context.fillStyle = 'blue';
    context.fillRect(10, 30, 100, 10);
    context.fillStyle = color;
    context.fillRect(10, 30, player.health, 10);

    //update the player rotation
    let rotation_change = shift && player.energy > 0 && (rotate_left || rotate_right) ? 0.08 : 0.05;

    if (rotate_left) {
        player.gun_rotation_angle -= rotation_change; //rotate to the left hand side
    }
    if (rotate_right) {
        player.gun_rotation_angle += rotation_change;
    }
}

function init_time() {
    // about setINterval is taken from:
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
    setInterval(set_time, 1000);
}

function set_time() {
    total_seconds++;
    minutes = check(String(Math.floor(total_seconds / 60)));
    seconds = check(String(total_seconds % 60));

}

function check(time) {
    if (time.length < 2) {
        return "0" + time;
    } else {
        return time;
    }
}

function compute_distance(dx, dy) {
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function create_boss() {
    return new Boss((canvas.width / 2) - 25, (canvas.height / 2) - 25);
}

function create_enemy() {
    return new Enemy(randint(0, canvas.width - 35), randint(0, canvas.height - 35));
}

function create_shooting_enemy() {
    return new Shooting_enemy(randint(0, canvas.width - 35), randint(0, canvas.height - 35));
}

function create_plant() {
    return new Plant(randint(45, canvas.width - 45), randint(45, canvas.height - 45));
}

function create_bullet() {
    // offset is 20 px is how far from the centre the bullet will appear and make it appear more naturally
    // this calculates where the bullet will appear, this offset should be along the direction the player is facing.
    // basically calculating the centre of the player and add the offset that multiplied by the x and y components.
    let bullet_x = player.x + player.width / 2 + offset * Math.cos(player.gun_rotation_angle);
    let bullet_y = player.y + player.height / 2 + offset * Math.sin(player.gun_rotation_angle);
    return new Bullet(bullet_x, bullet_y, player.gun_rotation_angle, 'player');
}

function create_bullet_ammo() {
    return new Ammo(randint(10, canvas.width - 20), randint(10, canvas.height - 20));
}

function create_health_ammo() {
    return new Health_ammo(randint(10, canvas.width - 20), randint(10, canvas.height - 20));
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;

}
function activate(event) {
    let key = event.key;
    if (event.key === 'a' ||
        event.key === 'd' ||
        event.key === 'w' ||
        event.key === 's' ||
        event.key === 'A' ||
        event.key === 'D' ||
        event.key === 'W' ||
        event.key === 'S' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === ' ' || //space
        event.key === 'r' ||
        event.key === 'R' ||
        event.key === 'l' ||
        event.key === 'L' ||
        event.key === 'h' ||
        event.key === 'H' ||
        event.key === '2' ||
        event.key === '@'
    ) {
        event.preventDefault();
    }
    if (key === 'a' || key === 'A') {
        moveLeft = true;
    } else if (key === 'w' || key === 'W') {
        moveUp = true;
    } else if (key === 'd' || key === 'D') {
        moveRight = true;
    } else if (key === 's' || key === 'S') {
        moveDown = true;
    }
    if (key === 'Shift') {
        shift = true;
    }
    if (key === 'ArrowLeft') {
        rotate_left = true;
        tower_move_sound.volume = 0.1;
        // about .loop:
        // https://www.w3schools.com/jsref/prop_audio_loop.asp
        tower_move_sound.loop = true;
        tower_move_sound.play();
    } else if (key === 'ArrowRight') {
        rotate_right = true;
        tower_move_sound.volume = 0.1;
        tower_move_sound.loop = true;
        tower_move_sound.play();
    }
    if (key === ' ') {
        shoot = true;
    }
    if (key === 'r' || key === 'R') {
        reloading_on_press = true;
    }
    if (key === 'h' || key === 'H') {
        player.invulnerability = !player.invulnerability;
        player.used_cheats = true;
    }
    if (key === 'l' || key === 'L') {
        laser = !laser;
    }
    if (key === '2' || key === '@') {
        place_mine = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === 'a' || key === 'A') {
        moveLeft = false;
    } else if (key === 'w' || key === 'W') {
        moveUp = false;
    } else if (key === 'd' || key === 'D') {
        moveRight = false;
    } else if (key === 's' || key === 'S') {
        moveDown = false;
    }
    if (key === 'Shift') {
        shift = false;
    }
    if (key === 'ArrowLeft') {
        rotate_left = false;
        tower_move_sound.pause();
    } else if (key === 'ArrowRight') {
        rotate_right = false;
        tower_move_sound.pause();
    }
    if (key === ' ') {
        shoot = false;
    }
    if (key === 'r' || key === 'R') {
        reloading_on_press = false;
    }
    if (key === '2' || key === '@') {
        place_mine = false;
    }
}

function collides(obj1, obj2) {
    if (obj1.x + obj1.width < obj2.x ||
        obj2.x + obj2.width < obj1.x ||
        obj1.y > obj2.y + obj2.height ||
        obj2.y > obj1.y + obj1.height) {
        return false;
    } else {
        return true;
    }
}

function stop() {
    window.removeEventListener('keydown', activate);
    window.removeEventListener('keyup', deactivate);
    window.cancelAnimationFrame(request_id); //which animation we are canceling
    for (let sound of sounds) {
        sound.pause();
    }
    let score = total_seconds + kills;
    let cheats_output;
    if (player.used_cheats) {
        cheats_output = 'Yes';
    } else {
        cheats_output = 'No';
    }
    // engine_shift_sound.volume = 0.0;
    // engine_sound.volume = 0.0;
    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = "TOTAL SCORE: " + score;
    let link_element = document.querySelector('#again');
    link_element.innerHTML = 'PLAY AGAIN?';
    let home_element = document.querySelector('#home');
    home_element.innerHTML = 'HOME';

    let data = new FormData();
    data.append("score", score);
    data.append("cheats", cheats_output);

    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    // xhttp.open("POST", "/store_score", true);
    xhttp.open("POST", "/~bl17/cgi-bin/ca2/run.py/store_score", true);
    xhttp.send(data);
}

function handle_response() {
    if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
            if (xhttp.responseText === "success") {
                console.log("Yes");
            } else {
                console.log("No");
            }
        }
    }
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function () {
        console.log('loaded');
        num_assets -= 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement) {
            console.log('img');
            element.addEventListener('load', loaded, false);
        } else if (element instanceof HTMLAudioElement) {
            console.log('audio');
            element.addEventListener('canplaythrough', loaded, false)
        }
        element.src = asset.url;
    }
}

