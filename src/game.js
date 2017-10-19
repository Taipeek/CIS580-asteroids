import Ship from "./ship";
import ScoreBoard from "./scoreBoard";
import Asteroid from "./asteroid";

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
        this.minAsteroidSize = 5;
        this.maxAsteroidSpeed = 3;
        this.maxAsteroidSize = 20;
        this.gameOverSound = new Audio("gameOver.wav");
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.keyBoard = [];


        // Bind class functions
        this.handleKeyDow = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.newGame = this.newGame.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.checkCollisions = this.checkCollisions.bind(this);
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
            level: 1
        };
        //Create game objects
        this.ship = new Ship(this);
        this.scoreBoard = new ScoreBoard(0, this.canvas.gameHeight, this.canvas.width, this.canvas.height - this.canvas.gameHeight);
        this.projectiles = [];
        this.newProjectiles = [];
        this.asteroids = new Map();
        this.asteroidsAxisX = [];
        this.asteroidsAxisY = [];
        for (let i = 0; i < 25; i++) {
            let x = Math.random() * this.canvas.gameWidth;
            let y = Math.random() * this.canvas.gameHeight;
            let vx = Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
            let vy = Math.max(Math.random() * this.maxAsteroidSpeed, this.minAsteroidSpeed);
            let r = Math.floor(Math.max(Math.random() * this.maxAsteroidSize, this.minAsteroidSize));
            let dir = Math.random() * 2 * Math.PI;
            this.asteroids.set(i, new Asteroid(this, i, x, y, r, dir, vx, vy));
            this.asteroidsAxisX.push(this.asteroids[i]);
            this.asteroidsAxisY.push(this.asteroids[i]);


        }
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
        });
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
            this.render();
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

    gameOver() {
        if (--this.gameState.lives >= 1) {
            this.ship = new Ship(this.canvas.gameWidth, this.canvas.gameHeight);
            this.gameState.status = "standby";
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
            return;
        }
        this.gameState.status = "over";
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = null;
        this.gameOverSound.play();
        this.scoreBoard.renderGameOver(this.ctx, this.gameState);

    }


    nextLevel() {
        this.gameState.level++;
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = setInterval(this.gameLoop, this.gameLoopSpeed);
    }


    update() {
        if (this.gameState.status === "running") {
            let destroyedAsteroids = [];
            this.newProjectiles = [];
            this.checkCollisions();
            this.projectiles.forEach((projectile) => {
                let hit = false;
                this.asteroids.forEach((asteroid) => {
                    if (asteroid.isShot(projectile)) {
                        destroyedAsteroids.push(asteroid.id);
                        hit = true;
                    }
                });
                if (!hit) {
                    this.newProjectiles.push(projectile);
                    console.log(projectile);
                }
            });
            this.projectiles = this.newProjectiles;
            destroyedAsteroids.forEach((id) => this.asteroids.delete(id));
            this.ship.update();

            this.asteroids.forEach((asteroid) => asteroid.update());
            this.projectiles.forEach((projectile) => projectile.update());

            this.newProjectiles = [];
            this.projectiles = this.newProjectiles;

        }
    }


    render() {
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ship.render(this.ctx);
        this.projectiles.forEach((item) => item.render(this.ctx));
        this.asteroids.forEach((item) => item.render(this.ctx));
        this.scoreBoard.render(this.ctx, this.gameState);
        this.scoreBoard.renderGameOver(this.ctx, this.gameState);
        this.scoreBoard.renderPause(this.ctx, this.gameState);
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

    static magnitudeVector(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }
}
