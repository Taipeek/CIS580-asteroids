import Game from "./game";

export default class Asteroid {
    constructor(game, id, x, y, radius, direction, vx, vy) {
        this.id = id;
        this.game = game;
        this.direction = direction;
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
        this.radius = radius;
        this.m = Math.PI * this.radius * this.radius;
        this.points = [];
        this.collisionSound = new Audio("ahit.wav");
        this.isShotSound = new Audio("mhit.wav");
        for (let x = -radius; x <= radius; x += 4) {
            let y = Math.sqrt(radius * radius - x * x) + ((Math.random() > 0.5 ? 1 : -1) * this.radius / 10);
            let x2 = x + ((Math.random() > 0.5 ? 1 : -1) * this.radius / 10);
            this.points.push({x: x2, y: y});
        }
        for (let x = radius; x > -radius; x -= 5) {
            let y = -Math.sqrt(radius * radius - x * x) + ((Math.random() > 0.5 ? 1 : -1) * this.radius / 10);
            let x2 = x + ((Math.random() > 0.5 ? 1 : -1) * this.radius / 10);
            this.points.push({x: x2, y: y});
        }

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.isShot = this.isShot.bind(this);
        this.split = this.split.bind(this);
    }


    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.translate(this.position.x, this.position.y);
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        this.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(this.points[0].x, this.points[0].y);

        // ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
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
    }

    isShot(projectile) {
        if (Math.pow(this.position.x - projectile.x, 2) + Math.pow(this.position.y - projectile.y, 2) < this.radius * this.radius) {
            this.isShotSound.play();
            return true;
        }
        return false;
    }

    split() {
        if (this.radius > this.game.minAsteroidSize) {
            let ratio = Math.random();
            while (ratio < 0.30 || ratio > 0.65) ratio = Math.random();
            let r1 = Math.floor(ratio * this.radius);
            let r2 = Math.floor((1 - ratio) * this.radius);
            let id1 = this.game.idGenerator.next().value;
            let id2 = this.game.idGenerator.next().value;
            let x1 = this.position.x;
            let x2 = this.position.x;
            let y1 = this.position.y;
            let y2 = this.position.y;
            let vx1 = this.velocity.x;
            let vx2 = -this.velocity.x;
            let vy1 = -this.velocity.y;
            let vy2 = this.velocity.y;
            let dir = Math.random() * 2 * Math.PI;
            let a1 = new Asteroid(this.game, id1, x1, y1, r1, dir, vx1, vy1);
            let a2 = new Asteroid(this.game, id2, x2, y2, r2, dir, vx2, vy2);
            this.game.asteroids.set(id1, a1);
            this.game.asteroids.set(id2, a2);
        }
    }

    static areColliding(a, b) {
        if (Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2) < Math.pow(a.radius + b.radius, 2)) {
            a.collisionSound.play();
            return true;
        }
        return false;
    }

    static handleCollision(a, b) {
        let collisionVector = {
            x: a.position.x - b.position.x,
            y: a.position.y - b.position.y,
        };
        let collisionAngle = Math.atan2(collisionVector.x, collisionVector.y);
        let overlap = a.radius + b.radius - Game.magnitudeVector(collisionVector);
        collisionVector = Game.normalizeVector(collisionVector);
        a.position.x += collisionVector.x * overlap / 2;
        a.position.y += collisionVector.y * overlap / 2;
        b.position.x -= collisionVector.x * overlap / 2;
        b.position.y -= collisionVector.y * overlap / 2;

        let newA = Game.rotateVector(a.velocity, collisionAngle); //working so far
        let newB = Game.rotateVector(b.velocity, collisionAngle);
        let tmp = newA.x;
        newA.x = newB.x;
        newB.x = tmp;
        newA = Game.rotateVector(newA, -collisionAngle);
        newB = Game.rotateVector(newB, -collisionAngle);
        a.velocity = newA;
        b.velocity = newB;

       /* let va = Game.magnitudeVector(a.velocity);
        let vb = Game.magnitudeVector(b.velocity);
        let vamvb = Game.substractVectors(a.velocity, b.velocity);
        let vbmva = Game.substractVectors(a.velocity, b.velocity);
        let c1 = Game.substractVectors(a.position, b.position);
        let c2 = Game.substractVectors(b.position, a.position);

        let vaNewx = a.velocity.x - (2 * b.m / (a.m + b.m)) * ((vamvb.x * c1.x + vamvb.y * c1.y) / Game.squareVector(c1)) * (c1.x);
        let vaNewy = a.velocity.y - (2 * b.m / (a.m + b.m)) * ((vamvb.x * c1.x + vamvb.y * c1.y) / Game.squareVector(c1)) * (c1.y);
        let vbNewx = b.velocity.x - (2 * a.m / (a.m + b.m)) * ((vbmva.x * c2.x + vbmva.y * c2.y) / Game.squareVector(c2)) * (c2.x);
        let vbNewy = b.velocity.y - (2 * a.m / (a.m + b.m)) * ((vbmva.x * c2.x + vbmva.y * c2.y) / Game.squareVector(c2)) * (c2.y);


        let aold = a.velocity;
        let bold = b.velocity;
        a.velocity = {x: vaNewx, y: vaNewy};
        b.velocity = {x: vbNewx, y: vbNewy};
        if (a.m * Game.magnitudeVector(a.velocity) + b.m * Game.magnitudeVector(b.velocity) === a.m * Game.magnitudeVector(aold) + b.m * Game.magnitudeVector(bold)) {
            console.log(true);
        }
        console.log(a.velocity, b.velocity);*/


        /*let const1 =  2*b.m/(a.m+b.m)*((a.velocity.x-b.velocity.x)*(c1.x)+(a.velocity.y-b.velocity.y)*(c1.y));

        let tmp_a = (c1.x);
        let tmp_b = (c1.x);

        const1/=tmp_a*tmp_a+tmp_b*tmp_b;

        a.velocity.x = a.velocity.x-const1*(c1.x);
        a.velocity.y = a.velocity.y-const1*(c2.x);

        let const2 =  2*a.m/(a.m+b.m)*((b.velocity.x-a.velocity.x)*(c2.x)+(b.velocity.y-a.velocity.y)*(c2.y));

        tmp_a = (c1.x);
        tmp_b = (c1.y);

        const2/=tmp_b*tmp_b+tmp_a*tmp_a;

        b.velocity.x = b.velocity.x-const1*(c2.x);
        b.velocity.y = b.velocity.y-const1*(c2.y);*/



        /*let v1 = Game.magnitudeVector(a.velocity);
        let v2 = Game.magnitudeVector(b.velocity);

        a.velocity.x = (v1*Math.cos(a.direction-collisionAngle)*(a.m-b.m)
            +(2*b.m*v2*Math.cos(b.direction-collisionAngle)))*Math.cos(collisionAngle)/(a.m+b.m)
            +v1*Math.sin(a.direction-collisionAngle)*Math.cos(collisionAngle+Math.PI/2);

        a.velocity.y = (v1*Math.cos(a.direction-collisionAngle)*(a.m-b.m)
            +(2*b.m*v2*Math.cos(b.direction-collisionAngle)))*Math.sin(collisionAngle)/(a.m+b.m)
            +v1*Math.sin(a.direction-collisionAngle)*Math.sin(collisionAngle+Math.PI/2);

        b.velocity.x = (v2*Math.cos(b.direction-collisionAngle)*(b.m-a.m)
            +(2*a.m*v1*Math.cos(a.direction-collisionAngle)))*Math.cos(collisionAngle)/(a.m+b.m)
            +v2*Math.sin(b.direction-collisionAngle)*Math.cos(collisionAngle+Math.PI/2);

        b.velocity.y = (v2*Math.cos(b.direction-collisionAngle)*(b.m-a.m)
            +(2*a.m*v1*Math.cos(a.direction-collisionAngle)))*Math.sin(collisionAngle)/(a.m+b.m)
            +v2*Math.sin(b.direction-collisionAngle)*Math.sin(collisionAngle+Math.PI/2);*/
    }
}