export default class ScoreBoard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.render = this.render.bind(this);
        this.renderGameOver = this.renderGameOver.bind(this);
        this.renderPause = this.renderPause.bind(this);
        this.renderFirstGame = this.renderFirstGame.bind(this);
    }

    render(ctx, gameState) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "grey";
        ctx.font = '18px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Score: " + gameState.score, this.x, this.y + 18);
        ctx.fillText("Lives: " + gameState.lives, this.x + 100, this.y + 18);
        ctx.fillText("Level: " + gameState.level, this.x + 200, this.y + 18);
        ctx.fillText("Asteroids: " + gameState.asteroidSize(), this.x + 300, this.y + 18);
        ctx.fillText("Warps left: " + gameState.warpsLeft, this.x + 440, this.y + 18);
        ctx.restore();
    }

    renderFirstGame(ctx, gameState) {
        if (gameState.status !== "new") return;
        ctx.save();
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "grey";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Welcome to asteroids", this.x + 1 / 10 * this.width, this.y - 500);
        ctx.font = '25px sans-serif';
        ctx.fillText("Use left/right arrow to steer and up arrow to generate thrust", this.x + 1 / 10 * this.width, this.y - 450);
        ctx.fillText("Use 'x' key to warp your ship to random place", this.x + 1 / 10 * this.width, this.y - 420);
        ctx.font = '40px sans-serif';
        ctx.fillText("Press space to start the game", this.x + 1 / 10 * this.width, this.y - 370);
        ctx.restore();
    }

    renderGameOver(ctx, gameState) {
        if (gameState.status !== "over") return;
        ctx.save();
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "grey";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Game Over!", this.x + 1 / 4 * this.width, this.y - 240);
        ctx.fillText("Score: " + gameState.score, this.x + 1 / 4 * this.width, this.y - 190);
        ctx.fillText("Press space to start a new game", this.x + 1 / 8 * this.width, this.y - 100);
        ctx.restore();
    }
    renderPause(ctx, gameState) {
        if (gameState.status !== "paused") return;
        ctx.save();
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "grey";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Paused", this.x + 1 / 4 * this.width, this.y - 240);
        ctx.fillText("Press space to resume", this.x + 1 / 8 * this.width, this.y - 100);
        ctx.restore();
    }
}
