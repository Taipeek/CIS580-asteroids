import Projectile from "./projectile";

export default class Ship {
    constructor(game) {
        this.canvas = game.canvas;
        this.position = {x: this.canvas.width / 2, y: this.canvas.height / 2, direction: Math.PI / 2};
        this.velocity = {x: 0, y: 0};
        this.game = game;
        this.thrusters = false;
        this.thrustersForce = 0.2;
        this.maxSpeed = 7;
        this.lastShot = Date.now();
        this.shotInterval = 150;
        this.directionShift = Math.PI / 24;
        this.width = 4;
        this.length = 6;
        this.invulnerability = 3000;
        this.timeInvulnerable = 0;
        this.shootSound = new Audio("shoot.wav");
        this.crashSound = new Audio("shit.wav");


        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.steer = this.steer.bind(this);
        this.shoot = this.shoot.bind(this);
        this.isCrashed = this.isCrashed.bind(this);
        this.resetPosotion = this.resetPosotion.bind(this);
        this.isNear = this.isNear.bind(this);
        this.warp = this.warp.bind(this);

    }

    isCrashed(asteroid) {
        if (this.timeInvulnerable !== 0) {
            if (Date.now() - this.timeInvulnerable > this.invulnerability) {
                this.timeInvulnerable = 0;
            } else {
                return false;
            }
        }
        if (Math.pow(this.position.x - asteroid.position.x, 2) + Math.pow(this.position.y - this.length - asteroid.position.y, 2) < asteroid.radius * asteroid.radius
            || Math.pow(this.position.x - 4 - asteroid.position.x, 2) + Math.pow(this.position.y + this.length - asteroid.position.y, 2) < asteroid.radius * asteroid.radius
            || Math.pow(this.position.x + 4 - asteroid.position.x, 2) + Math.pow(this.position.y + this.length - asteroid.position.y, 2) < asteroid.radius * asteroid.radius) {
            this.crashSound.play();
            return true;
        }
        return false;
    }

    isNear(x, y) {
        return Math.pow(this.position.x - x, 2) + Math.pow(this.position.y - this.length - y, 2) < this.game.maxAsteroidSize * this.game.maxAsteroidSize;
    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot >= this.shotInterval) {
            this.game.projectiles.push(new Projectile(this.game, this.position.x, this.position.y, this.position.direction, this.velocity));
            this.lastShot = now;
            this.shootSound.play();
        }
    }

    warp() {
        if (this.game.gameState.warpsLeft > 0) {
            this.game.gameState.warpsLeft--;
            this.timeInvulnerable = Date.now();
            this.position.x = Math.random() * this.game.canvas.gameWidth;
            this.position.y = Math.random() * this.game.canvas.gameHeight;
        }
    }


    steer(direction) {
        let beta = null;
        if (direction === "left") {
            beta = this.directionShift;

        } else if (direction === "right") {
            beta = -this.directionShift;

        }
        this.position.direction += beta;
    }

    resetPosotion() {
        this.position = {x: this.canvas.width / 2, y: this.canvas.height / 2, direction: Math.PI / 2};
        this.velocity = {x: 0, y: 0};
    }

    update() {
        if (this.game.keyBoard["left"]) {
            this.steer("left");
        } else if (this.game.keyBoard["right"]) {
            this.steer("right");
        }

        if (this.game.keyBoard["shoot"])
            this.shoot();


        if (this.thrusters) {
            this.velocity.x += Math.cos(this.position.direction) * this.thrustersForce;
            this.velocity.y += Math.sin(this.position.direction) * this.thrustersForce;
        } else {
            this.velocity.x *= 0.99;
            this.velocity.y *= 0.99;
        }
        let xx = Math.pow(this.velocity.x, 2);
        let yy = Math.pow(this.velocity.y, 2);
        if (xx + yy > Math.pow(this.maxSpeed, 2)) {
            let norm = Math.sqrt(xx + yy);
            this.velocity.x = (this.velocity.x / norm) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / norm) * this.maxSpeed;
        }

        if (this.position.x + this.velocity.x > this.canvas.gameWidth) {
            this.position.x = 0;
        }
        else if (this.position.x + this.velocity.x < 0) {
            this.position.x = this.canvas.gameWidth;
        }
        else
            this.position.x += this.velocity.x;

        if (this.position.y - this.velocity.y > this.canvas.gameHeight) {
            this.position.y = 0;
        }
        else if (this.position.y - this.velocity.y < 0) {
            this.position.y = this.canvas.gameHeight;
        }
        else
            this.position.y -= this.velocity.y;

    }

    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "grey";
        if (this.timeInvulnerable !== 0 && (Date.now() - this.timeInvulnerable) % 300 > 150) {
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
        }
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.position.direction + Math.PI / 2);
        ctx.moveTo(0, -this.length);
        ctx.lineTo(this.width, this.length);
        ctx.lineTo(-this.width, this.length);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}
