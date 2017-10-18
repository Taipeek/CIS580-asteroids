export default class Projectile {
    constructor(game, x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.game = game;
        this.speed = 3;
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }


    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        ctx.fillRect(0, 0, 3, 1);
        ctx.restore();
    }

    update() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y -= Math.sin(this.direction) * this.speed;

        if (this.x >= 0 && this.x <= this.game.canvas.gameWidth && this.y >= 0 && this.y <= this.game.canvas.gameHeigth)
            this.game.newProjectiles.push(this);
    }

}
