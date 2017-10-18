export default class Projectile {
    constructor(game, x, y, direction, initialVelocity) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.game = game;
        this.speed = 10;
        this.initialX = initialVelocity.x;
        this.initialY = initialVelocity.y;
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }


    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.direction + Math.PI);
        ctx.fillRect(0, 0, 6, 2);
        ctx.restore();
    }

    update() {
        this.x += Math.cos(this.direction) * this.speed + this.initialX;
        this.y -= Math.sin(this.direction) * this.speed + this.initialY;

        if (this.x >= 0 && this.x <= this.game.canvas.gameWidth && this.y >= 0 && this.y <= this.game.canvas.gameHeight)
            this.game.newProjectiles.push(this);
    }

}
