export default class Bricks {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.bricksInRow = 5;
        this.bricksInColumns = 10;
        this.brickWidth = canvasWidth / this.bricksInRow;
        this.brickHeight = 20;
        this.brickCount = this.bricksInRow * this.bricksInColumns;
        this.brickWallHeight = this.bricksInColumns * this.brickHeight;
        this.bricks = [[], [], [], [], [], [], [], [], [], []];
        this.colors = ["yellow", "yellow", "green", "green", "orange", "orange", "red", "red"];
        this.removeBrick = this.removeBrick.bind(this);
        this.render = this.render.bind(this);
        this.checkCollision = this.checkCollision.bind(this);
        for (let i = 0; i < this.bricksInRow; i++) {
            for (let j = 0; j < this.bricksInColumns; j += 2) {
                this.bricks[j][i] = this.bricks[j + 1][i] = this.colors[j % 8];
            }
        }

    }

    removeBrick(x, y) {
        this.bricks[y][x] = null;
        return true;
    }

    checkCollision(x, y, radius, direction) {
        for (let i = 0; i < this.bricks.length; i++) {
            for (let j = 0; j < this.bricks[i].length; j++) {
                if (!this.bricks[i][j]) continue;
                let rx = Bricks.clamp(x, j * this.brickWidth, j * this.brickWidth + this.brickWidth);
                let ry = Bricks.clamp(y, i * this.brickHeight, i * this.brickHeight + this.brickHeight);
                let distSquared = Math.pow(rx - x, 2) + Math.pow(ry - y, 2);
                if (distSquared < Math.pow(radius, 2) && this.removeBrick(j, i)) {
                    this.brickCount--;
                    if (direction < 0) {
                        if (y < i * this.brickHeight + this.brickHeight) return -1; //returns side collision from bottom
                    } else {
                        if (y > i * this.brickHeight) return -1; //returns side collision from top
                    }
                    return 1;
                }

            }
        }
        return 0;
    }


    render(ctx) {
        ctx.save();
        this.bricks.forEach((brickRow, rowIndex) => {
            brickRow.forEach((brick, index) => {
                if (brick === null) return;
                ctx.fillStyle = brick;
                ctx.strokeStyle = "black";
                ctx.fillRect(index * this.brickWidth, rowIndex * this.brickHeight, this.brickWidth, this.brickHeight);
                ctx.strokeRect(index * this.brickWidth, rowIndex * this.brickHeight, this.brickWidth, this.brickHeight);
            })
        });

        ctx.restore();
    }

    static clamp(value, lborder, rborder) {
        if (value >= lborder && value <= rborder) return value;
        if (value >= rborder) return rborder;
        if (value <= lborder) return lborder;
    }
}
