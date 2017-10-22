import Ship from "./ship";
import ScoreBoard from "./scoreBoard";
import Asteroid from "./asteroid";
import Ufo from "./ufo";

export default class Game {
    constructor() {
        //Game state
        this.gameState = {};

        // Create the screen buffer canvas
        this.canvas = document.createElement('canvas');
        this.canvas.gameHeight = 800;
        this.canvas.width = this.canvas.gameWidth = 800;
        this.canvas.height = this.canvas.gameHeight + 20;
        this.gameLoopSpeed = 20;
        this.minAsteroidSpeed = 1;
        this.minAsteroidSize = 17;
        this.maxAsteroidSpeed = 3;
        this.maxAsteroidSize = 50;
        this.asteroidsPerLevel = 10;
        this.gameOverSound = new Audio("gameOver.wav");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.keyBoard = [];
        this.lastUfo = 0;
        this.ufoCooldown = 1000;

        function* idMaker() {
            let index = 0;
            while (true)
                yield index++;
        }

        this.idGenerator = idMaker();


        // Bind class functions
        this.handleKeyDow = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.newGame = this.newGame.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.checkCollisions = this.checkCollisions.bind(this);
        this.checkGameOver = this.checkGameOver.bind(this);
        this.checkNextLevel = this.checkNextLevel.bind(this);
        this.refillAsteroids = this.refillAsteroids.bind(this);
        this.spawnUfo = this.spawnUfo.bind(this);

        // key handlers
        window.onkeydown = this.handleKeyDow;
        window.onkeyup = this.handleKeyUp;

        //initial render
        this.newGame();
        setTimeout(() => {
            //just waiting to load images
            this.render();
        }, 500);
    }

    newGame() {
        this.gameState = {
            status: "new",
            score: 0,
            lives: 3,
            level: 1,
            warpsLeft: 5,
            asteroidSize: () => {
                return this.asteroids.size
            }
        };
        //Create game objects
        this.ship = new Ship(this);
        this.ufo = null;
        this.scoreBoard = new ScoreBoard(0, this.canvas.gameHeight, this.canvas.width, this.canvas.height - this.canvas.gameHeight, this);
        this.projectiles = [];
        this.newProjectiles = [];
        this.asteroids = new Map();
        this.refillAsteroids();
        // Start the game loop
        this.gameLoopInterval = null;
    }

    checkCollisions() {
        this.asteroids.forEach((asteroidA, keyA) => {
            this.asteroids.forEach((asteroidB, keyB) => {
                if (keyB > keyA && Asteroid.areColliding(asteroidA, asteroidB)) {
                    Asteroid.handleCollision(asteroidA, asteroidB);
                }
            });
            if (this.ship.isCrashed(asteroidA)) {
                this.gameState.lives--;
                this.ship.timeInvulnerable = Date.now();
                this.ship.resetPosition();
            }
        });
    }

    refillAsteroids() {
        let rockCount = this.gameState.level * this.asteroidsPerLevel;
        let currentCount = this.asteroids.size;
        if (this.asteroids.size < rockCount) {
            for (let i = 0; i < rockCount - currentCount; i++) {
                let x = Math.random() * this.canvas.gameWidth;
                let y = Math.random() * this.canvas.gameHeight;
                while (this.ship.isNear(x, y)) {
                    x = Math.random() * this.canvas.gameWidth;
                    y = Math.random() * this.canvas.gameHeight;
                }
                let vx = (Math.random() > 0.5 ? 1 : -1) * Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
                let vy = (Math.random() > 0.5 ? 1 : -1) * Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
                let r = Math.floor(Math.max(Math.random() * this.maxAsteroidSize, this.minAsteroidSize));
                let dir = Math.random() * 2 * Math.PI;
                let id = this.idGenerator.next().value;
                this.asteroids.set(id, new Asteroid(this, id, x, y, r, dir, vx, vy));
            }
        }
    }

    handleKeyDown(event) {
        event.preventDefault();
        if (this.gameState.status !== "running") {
            switch (event.key) {
                case ' ':
                    if (this.gameState.status === "over") {
                        this.newGame();
                        return;
                    }
                    this.ship.shoot();
                    this.gameLoopInterval = setInterval(this.gameLoop, this.gameLoopSpeed);
                    this.gameState.status = "running";
                    break;
            }
            return;
        }
        if (event.key === "p") {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.gameState.status = "paused";
            console.log(this);
            this.render();
            return;
        }
        if (event.key === "x" && this.gameState.status === "running") {
            this.ship.warp();
            return;
        }
        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                this.ship.thrusters = true;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keyBoard["left"] = true;
                break;
            case 'd':
            case 'ArrowRight':
                this.keyBoard["right"] = true;
                break;
            case ' ':
            case 'Space':
                this.keyBoard["shoot"] = true;
                break;
        }
    }

    handleKeyUp(event) {
        event.preventDefault();
        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                this.ship.thrusters = false;
                break;
            case 'a':
            case 'ArrowLeft':
                this.keyBoard["left"] = false;
                break;
            case 'd':
            case 'ArrowRight':
                this.keyBoard["right"] = false;
                break;
            case ' ':
            case 'Space':
                this.keyBoard["shoot"] = false;
                break;
        }
    }

    checkGameOver() {
        if (this.gameState.lives === 0) {
            this.gameState.status = "over";
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            this.gameOverSound.play();
            this.scoreBoard.renderGameOver(this.ctx, this.gameState);
        }
    }


    checkNextLevel() {
        if (this.asteroids.size === 0) {
            this.gameState.level++;
            this.refillAsteroids();
        }
    }


    update() {
        if (this.gameState.status === "running") {
            this.checkGameOver();
            this.checkNextLevel();
            let destroyedAsteroids = [];
            this.newProjectiles = [];
            this.checkCollisions();
            this.spawnUfo();
            this.projectiles.forEach((projectile) => {
                let hit = false;

                for (let asteroid of this.asteroids.values()) {
                    if (asteroid.isShot(projectile)) {
                        destroyedAsteroids.push(asteroid.id);
                        asteroid.split();
                        if (!projectile.shotByUfo)
                            this.gameState.score += 50;
                        hit = true;
                        break;
                    }
                }

                if (!hit && !projectile.shotByUfo && this.ufo && this.ufo.isShot(projectile)) {
                    this.ufo = null;
                    hit = true;
                    this.gameState.score += 200;
                }

                if (!hit && projectile.shotByUfo && this.ship.isShot(projectile)) {
                    this.gameState.lives--;
                    this.ship.timeInvulnerable = Date.now();
                    this.ship.resetPosition();
                    hit = true;
                }

                if (!hit) {
                    this.newProjectiles.push(projectile);
                }
            });
            this.projectiles = this.newProjectiles;
            destroyedAsteroids.forEach((id) => this.asteroids.delete(id));
            this.newProjectiles = [];
            this.ship.update();
            if (this.ufo) this.ufo.update();
            this.asteroids.forEach((asteroid) => asteroid.update());
            this.projectiles.forEach((projectile) => projectile.update());
            this.projectiles = this.newProjectiles;

        }
    }

    spawnUfo() {

        if (Math.floor(this.gameState.score / this.ufoCooldown) > this.lastUfo && this.ufo === null) {
            this.lastUfo = Math.floor(this.gameState.score / this.ufoCooldown);
            let x = Math.random() * this.canvas.gameWidth;
            let y = Math.random() * this.canvas.gameHeight;
            while (this.ship.isNear(x, y)) {
                x = Math.random() * this.canvas.gameWidth;
                y = Math.random() * this.canvas.gameHeight;
            }
            let vx = (Math.random() > 0.5 ? 1 : -1) * Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
            let vy = (Math.random() > 0.5 ? 1 : -1) * Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
            let id = this.idGenerator.next().value;


            this.ufo = new Ufo(this, id, x, y, vx, vy)
        }
    }


    render() {
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ship.render(this.ctx);
        this.projectiles.forEach((item) => item.render(this.ctx));
        this.asteroids.forEach((item) => item.render(this.ctx));
        if (this.ufo) this.ufo.render(this.ctx);
        this.scoreBoard.render(this.ctx, this.gameState);
        this.scoreBoard.renderGameOver(this.ctx, this.gameState);
        this.scoreBoard.renderPause(this.ctx, this.gameState);
        this.scoreBoard.renderFirstGame(this.ctx, this.gameState);
    }

    gameLoop() {
        this.update();
        this.render();
    }

    static clamp(value, lborder, rborder) {
        if (value >= lborder && value <= rborder) return value;
        if (value >= rborder) return rborder;
        if (value <= lborder) return lborder;
    }

    static rotateVector(vector, angle) {
        return {
            x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
            y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
        }
    }

    static normalizeVector(vector) {
        let norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        return {
            x: vector.x / norm,
            y: vector.y / norm
        }
    }

    static substractVectors(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }

    static squareVector(a) {
        return a.x * a.x + a.y * a.y;
    }


    static magnitudeVector(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
}
