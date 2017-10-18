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
        this.x+= this.vx;
        this.y+= this.vy;
    }
}