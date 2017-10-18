import Projectile from "./projectile";

export default class Ship {
    constructor(game) {
        this.canvas = game.canvas;
        this.position = {x: this.canvas.width / 2, y: this.canvas.height / 2, direction: Math.PI / 2};
        this.speedVector = {x: 0, y: 0};
        this.game = game;
        this.thrusters = false;
        this.thrustersForce = 1;
        this.maxSpeed = 5;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.steer = this.steer.bind(this);
        this.shoot = this.shoot.bind(this);

    }

    shoot() {
        this.game.projectiles.push(new Projectile(this.game,this.position.x,this.position.y,this.position.direction));
    }


    steer(direction) {
        let beta = null;
        if (direction === "left") {
            beta = Math.PI / 16;

        } else if (direction === "right") {
            beta = -Math.PI / 16;

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
        let oldTx = this.speedVector.x;
        let oldTy = this.speedVector.y;

        if (this.thrusters) {
            this.speedVector.x += Math.cos(this.position.direction) * this.thrustersForce;
            this.speedVector.y += Math.sin(this.position.direction) * this.thrustersForce;
        }
        // if (Math.pow(this.speedVector.x, 2) + Math.pow(this.speedVector.y, 2) > Math.pow(this.maxSpeed, 2)) {
        //     this.speedVector.x = oldTx;
        //     this.speedVector.y = oldTy;
        // }

        if (this.position.x + this.speedVector.x > this.canvas.gameWidth) {
            this.position.x = this.canvas.gameWidth;
            this.speedVector.x = 0;
        }
        else if (this.position.x + this.speedVector.x < 0) {
            this.position.x = 0;
            this.speedVector.x = 0;
        }
        else
            this.position.x += this.speedVector.x;

        if (this.position.y - this.speedVector.y > this.canvas.gameHeigth) {
            this.position.y = this.canvas.gameHeigth;
            this.speedVector.y = 0;
        }
        else if (this.position.y - this.speedVector.y < 0) {
            this.position.y = 0;
            this.speedVector.y = 0;
        }
        else
            this.position.y -= this.speedVector.y;

    }

    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.position.direction+Math.PI/2);
        ctx.moveTo(0, -8);
        ctx.lineTo(4, 8);
        ctx.lineTo(-4, 8);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
