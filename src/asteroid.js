import Game from "./game";

export default class Asteroid {
    constructor(game, id, x, y, radius, direction, vx, vy) {
        this.id = id;
        this.game = game;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.velocity = {x: vx, y: vy};
        this.radius = radius;


        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isShot = this.isShot.bind(this);
        this.split = this.split.bind(this);
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
        if (this.x + this.velocity.x > this.game.canvas.gameWidth) {
            this.x = 0;
        }
        else if (this.x + this.velocity.x < 0) {
            this.x = this.game.canvas.gameWidth;
        }
        else
            this.x += this.velocity.x;

        if (this.y - this.velocity.y > this.game.canvas.gameHeight) {
            this.y = 0;
        }
        else if (this.y - this.velocity.y < 0) {
            this.y = this.game.canvas.gameHeight;
        }
        else
            this.y -= this.velocity.y;
    }

    isShot(projectile) {
        return Math.pow(this.x - projectile.x, 2) + Math.pow(this.y - projectile.y, 2) < this.radius * this.radius;
    }

    split() {
        if (this.radius > this.game.minAsteroidSize) {
            let ratio = Math.random();
            while (ratio < 0.25) ratio = Math.random();
            let r1 = Math.floor(ratio) * this.radius;
            let r2 = Math.floor(1 - ratio) * this.radius;
            let id1 = this.game.idGenerator.next().value;
            let id2 = this.game.idGenerator.next().value;
            let x1 = this.x;
            let x2 = this.x;
            let y1 = this.y;
            let y2 = this.y;
            let vx1 = this.velocity.x;
            let vx2 = -this.velocity.x;
            let vy1 = -this.velocity.y;
            let vy2 = this.velocity.y;
            let dir = Math.random() * 2 * Math.PI;
//TODO
            this.game.asteroids.set(id1, new Asteroid(this.game, id1, x1, y1, r1, dir, vx1, vy1));
            this.game.asteroids.set(id2, new Asteroid(this.game, id2, x2, y2, r2, dir, vx2, vy2));
        }
    }

    static areColliding(a, b) {
        return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) < Math.pow(a.radius + b.radius, 2);

    }

    static handleCollision(a, b) {
        let collisionVector = {
            x: a.x - b.x,
            y: a.y - b.y,
        };
        let collisionAngle = Math.atan2(collisionVector.x, collisionVector.y);
        let overlap = a.radius + b.radius - Game.magnitudeVector(collisionVector);
        collisionVector = Game.normalizeVector(collisionVector);
        a.x += collisionVector.x * overlap / 2;
        a.y += collisionVector.y * overlap / 2;
        b.x -= collisionVector.x * overlap / 2;
        b.y -= collisionVector.y * overlap / 2;

        let newA = Game.rotateVector(a.velocity, collisionAngle);
        let newB = Game.rotateVector(b.velocity, collisionAngle);
        let tmp = newA.x;
        newA.x = newB.x;
        newB.x = tmp;
        newA = Game.rotateVector(newA, -collisionAngle);
        newB = Game.rotateVector(newB, -collisionAngle);
        a.velocity = newA;
        b.velocity = newB;

    }
}