export default class Ship {
    constructor(game) {
        this.canvas = game.canvas;
        this.position = {x: this.canvas.width/2, y: this.canvas.height/2, dirX: 0, dirY: 1};
        this.speedVector = {x: 0, y: 0};
        this.game = game;
        this.thrusters = false;
        this.thrustersForce = 0.01;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.steer = this.steer.bind(this);
        this.shoot = this.shoot.bind(this);

    }

    shoot() {
        return null;
    }


    steer(direction) {
        var beta = null;
        if (direction === "left") {
            beta = Math.PI / 10240;

        } else if (direction === "right") {
            beta = Math.PI / 10240;

        }
        let x =  this.position.dirX;
        let y =  this.position.dirY;
        this.position.dirX = Math.cos(beta) * x - Math.sin(beta)* y;
        this.position.dirY = Math.sin(beta) * y + Math.cos(beta)* x;
        console.log(this.position);
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
            this.speedVector.x += this.position.dirX * this.thrustersForce;
            this.speedVector.y += this.position.dirY * this.thrustersForce;
        }


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

        if (this.position.y + this.speedVector.y > this.canvas.gameHeigth) {
            this.position.y = this.canvas.gameHeigth;
            this.speedVector.y = 0;
        }
        else if (this.position.y + this.speedVector.y < 0) {
            this.position.y = 0;
            this.speedVector.y = 0;
        }
        else
            this.position.y += this.speedVector.y;

    }

    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.atan2(this.position.dirX, this.position.dirY));
        ctx.moveTo(0, -8);
        ctx.lineTo(4, 8);
        ctx.lineTo(-4, 8);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
