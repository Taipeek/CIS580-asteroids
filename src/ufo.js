import Projectile from "./projectile";

export default class Ufo {
    constructor(game, id, x, y, vx, vy) {
        this.id = id;
        this.game = game;
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
        this.points = [];
        this.isShotSound = new Audio("mhit.wav");
        this.shootSound = new Audio("shoot.wav");
        this.shotInterval = 1500;
        this.xRadius = 25;
        this.yRadius = 5;
        this.lastShot = 0;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isShot = this.isShot.bind(this);
        this.shoot = this.shoot.bind(this);
    }


    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "green";
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.xRadius, this.yRadius, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, -2, 7, 7, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.position.x + this.velocity.x > this.game.canvas.gameWidth) {
            this.position.x = 0;
        }
        else if (this.position.x + this.velocity.x < 0) {
            this.position.x = this.game.canvas.gameWidth;
        }
        else
            this.position.x += this.velocity.x;

        if (this.position.y - this.velocity.y > this.game.canvas.gameHeight) {
            this.position.y = 0;
        }
        else if (this.position.y - this.velocity.y < 0) {
            this.position.y = this.game.canvas.gameHeight;
        }
        else
            this.position.y -= this.velocity.y;
        this.shoot();
    }

    isShot(projectile) {
        if (Math.pow(this.position.x - projectile.x, 2) / (this.xRadius * this.xRadius) + Math.pow(this.position.y - projectile.y, 2) / (this.yRadius * this.yRadius) < 1) {
            this.isShotSound.play();
            return true;
        }
        return false;
    }

    shoot() {
        let now = Date.now();
        if (now - this.lastShot >= this.shotInterval) {
            let shipDirection = Math.atan2(this.game.ship.position.x - this.position.x, this.game.ship.position.y - this.position.y) - Math.PI / 2 + (Math.random() * Math.PI / 32);
            this.game.projectiles.push(new Projectile(this.game, this.position.x, this.position.y, shipDirection, {
                x: 0,
                y: 0
            }, true));
            this.lastShot = now;
            this.shootSound.play();
        }
    }


}
