import Projectile from "./projectile";

export default class Ship {
    constructor(game) {
        this.canvas = game.canvas;
        this.position = {x: this.canvas.width / 2, y: this.canvas.height / 2, direction: Math.PI / 2};
        this.velocity = {x: 0, y: 0};
        this.game = game;
        this.thrusters = false;
        this.thrustersForce = 0.5;
        this.maxSpeed = 7;
        this.lastShot = Date.now();
        this.shotInterval = 200;
        this.directionShift = Math.PI / 24;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.steer = this.steer.bind(this);
        this.shoot = this.shoot.bind(this);

    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot >= this.shotInterval) {
            this.game.projectiles.push(new Projectile(this.game, this.position.x, this.position.y, this.position.direction, this.velocity));
            this.lastShot = now;
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
        }
        let xx = Math.pow(this.velocity.x, 2);
        let yy = Math.pow(this.velocity.y, 2);
        if (xx + yy > Math.pow(this.maxSpeed, 2)) {
            let norm = Math.sqrt(xx + yy);
            this.velocity.x = (this.velocity.x / norm) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / norm) * this.maxSpeed;
        }

        if (this.position.x + this.velocity.x > this.canvas.gameWidth) {
            this.position.x =  0;
        }
        else if (this.position.x + this.velocity.x < 0) {
            this.position.x = this.canvas.gameWidth;
        }
        else
            this.position.x += this.velocity.x;

        if (this.position.y - this.velocity.y > this.canvas.gameHeight) {
            this.position.y =  0;
        }
        else if (this.position.y - this.velocity.y < 0) {
            this.position.y = this.canvas.gameHeight;
        }
        else
            this.position.y -= this.velocity.y;

    }

    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.position.direction + Math.PI / 2);
        ctx.moveTo(0, -8);
        ctx.lineTo(4, 8);
        ctx.lineTo(-4, 8);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
