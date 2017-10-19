export default class Asteroid {
    constructor(game,id,x,y, radius, direction, vx, vy) {
        this.id = id;
        this.game = game;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;


        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }


    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.x + this.vx > this.game.canvas.gameWidth) {
            this.x =  0;
        }
        else if (this.x + this.vx < 0) {
            this.x = this.game.canvas.gameWidth;
        }
        else
            this.x += this.vx;

        if (this.y - this.vy > this.game.canvas.gameHeight) {
            this.y =  0;
        }
        else if (this.y - this.vy < 0) {
            this.y = this.game.canvas.gameHeight;
        }
        else
            this.y -= this.vy;
    }
}