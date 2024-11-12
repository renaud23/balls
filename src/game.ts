import {
  Ball,
  collision as collisionBall,
  createRandomBall,
  move,
} from "./ball";
import { render as renderBall } from "./ball";
import {
  Brick,
  render as renderBrick,
  collision as collisionBricks,
} from "./brique";
import { LEVEL1 } from "./levels/l1";

export type Game = {
  width: number;
  height: number;
  balls: Array<Ball>;
  bricks: Array<Brick>;
};

/**
 *
 * @param context
 */
export function render(context: CanvasRenderingContext2D, game: Game) {
  const canvasWidth = 600;
  const canvasHeight = 600;

  context.canvas.width = canvasWidth;
  context.canvas.height = canvasHeight;
  context.fillStyle = "grey";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  game.bricks.forEach((brick) => {
    renderBrick(context, game, brick);
  });

  game.balls.forEach((ball) => {
    renderBall(context, game, ball);
  });
}

/**
 *
 * @param width
 * @param height
 * @returns
 */
export function createGame(
  width: number,
  height: number,
  nbBalls: number
): Game {
  const balls = new Array<Ball>(nbBalls)
    .fill({
      id: 0,
      x: 0,
      y: 0,
      radius: 0,
      velocity: 0,
      vx: 0,
      vy: 0,
      color: "",
    })
    .map(() => createRandomBall(width, height));

  const bricks = transformLevel(width, height);

  return { width, height, balls, bricks };
}

export function activate(game: Game) {
  game.balls.forEach((ball) => {
    let collided = false;
    let turn = 0;
    do {
      move(ball);
      collisionBall(game, ball);
      collisionBricks(game, ball);
      wallCollision(game, ball);
      turn++;
    } while (collided);
    console.log(turn);
  });
}

/**
 *
 * @param game
 * @param ball
 * @returns
 */
function wallCollision(game: Game, ball: Ball): boolean {
  let collision = false;
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = -ball.vx;
    collision = true;
  } else if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = -ball.vy;
    collision = true;
  } else if (ball.x + ball.radius > game.width) {
    ball.x = game.width - ball.radius;
    ball.vx = -ball.vx;
    collision = true;
  } else if (ball.y + ball.radius > game.height) {
    ball.y = game.height - ball.radius;
    ball.vy = -ball.vy;
    collision = true;
  }

  return collision;
}

function transformLevel(gw: number, gh: number): Array<Brick> {
  const bricks: Array<Brick> = [];
  const level = LEVEL1;
  const ratio = gh / gw;
  const width = gw / level[0].length;
  const height = gh / (level[0].length * ratio);

  level.forEach((ligne, j) => {
    const codes = ligne.split("");
    const length = ligne.length;

    codes.forEach((code, i) => {
      if (code === "1") {
        const x = (i % length) * width;
        const y = j * height;

        bricks.push({ id: x * 100 + y, x, y, width, height });
      }
    });
  });
  // console.log(bricks);
  return bricks;
}
