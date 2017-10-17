export default class Ship {
    constructor(x, y, canvas) {
        this.position = {x: x, y: y, dirX: 0, dirY: 1};
        this.speedVector = {x: 0, y: 0};
        this.canvas = canvas;
        this.thrusters = false;
        this.thrustersForce = 1;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);

    }

    update() {

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
        ctx.fillStyle = 'black';
        // ctx.fillRect(this.x1, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x1, this.y);
        ctx.restore();
    }
}
