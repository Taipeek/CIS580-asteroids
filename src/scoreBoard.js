export default class ScoreBoard {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.render = this.render.bind(this);
        this.renderGameOver = this.renderGameOver.bind(this);
    }

    render(ctx, gameState) {
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '18px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Score: " + gameState.score, this.x, this.y + 18);
        ctx.fillText("Lives: " + gameState.lives, this.x + 100, this.y + 18);
        ctx.fillText("Level: " + gameState.level, this.x + 200, this.y + 18);
        ctx.restore();
    }

    renderGameOver(ctx, gameState) {
        if (gameState.status !== "over") return;
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '40px sans-serif';
        ctx.fontStyle = 'bold';
        ctx.fillText("Game Over!", this.x + 1 / 4 * this.width, this.y - 240);
        ctx.fillText("Score: " + gameState.score, this.x + 1 / 4 * this.width, this.y - 190);
        ctx.fillText("Press Spacebar to start a new game", this.x + 1 / 8 * this.width, this.y - 100);
        ctx.restore();
    }
}
