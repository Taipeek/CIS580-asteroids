import Ship from "./ship";
import ScoreBoard from "./scoreBoard";

export default class Game {
    constructor() {
        //Game state
        this.gameState = {};

        // Create the screen buffer canvas
        this.canvas = document.createElement('canvas');
        this.canvas.gameHeigth = 800;
        this.canvas.width = this.canvas.gameWidth = 800;
        this.canvas.height = this.canvas.gameHeigth + 20;
        this.gameLoopSpeed = 20;
        this.paddleLoopSpeed = 5;
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
        this.scoreBoard = new ScoreBoard(0, this.canvas.gameHeigth, this.canvas.width, this.canvas.height - this.canvas.gameHeigth);
        this.projectiles = [];
        this.newProjectiles = [];
        // Start the game loop
        this.gameLoopInterval = null;

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
            this.ship = new Ship(this.canvas.gameWidth, this.canvas.gameHeigth);
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
            this.ship.update();
            this.newProjectiles = [];
            this.projectiles.forEach((item) => item.update());
            this.projectiles = this.newProjectiles;
        }
    }


    render() {
        this.ctx.fillStyle = "black";
        this.ctx.strokeStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ship.render(this.ctx);
        this.projectiles.forEach((item) => item.render(this.ctx));
        this.scoreBoard.render(this.ctx, this.gameState);
        this.scoreBoard.renderGameOver(this.ctx, this.gameState)
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
}
