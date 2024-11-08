import { Ball, createRandomBall, move } from "./ball";
import { render as renderBall } from "./ball";
import { Brick, createBrick, render as renderBrick } from "./brique";
import { distance, rotate } from "./utils";

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
  context.canvas.width = game.width;
  context.canvas.height = game.height;
  context.fillStyle = "Cornsilk";
  context.fillRect(0, 0, game.width, game.height);

  game.bricks.forEach((brick) => {
    renderBrick(context, brick);
  });

  game.balls.forEach((ball) => {
    renderBall(context, ball);
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
    .fill(null)
    .map(() => createRandomBall(width, height));

  const bricks = new Array<Brick>(20)
    .fill({ x: 0, y: 0, width: 0, height: 0 })
    .map((_, i) => {
      const w = 60;
      const h = 30;
      const x = 80 + (i % 10) * w;
      const y = 80 + Math.trunc(i / 10) * h;
      return createBrick(x, y, w, h);
    });

  return { width, height, balls, bricks };
}

export function activate(game: Game) {
  game.balls.forEach((ball) => {
    move(ball);
    ballCollision(game, ball);
    wallCollision(game, ball);
  });
}

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

function ballCollision(game: Game, ball: Ball) {
  let collision = false;

  game.balls.forEach((o) => {
    if (o.id !== ball.id) {
      const dist = distance(ball.x, ball.y, o.x, o.y);
      if (dist < o.radius + ball.radius) {
        collision = true;

        const theta = Math.atan2(o.y - ball.y, o.x - ball.x);
        const delta = o.radius + ball.radius - dist + 1;
        ball.x -= Math.cos(theta) * delta;
        ball.y -= Math.sin(theta) * delta;
        /*         */

        const m1 = ball.radius;
        const m2 = o.radius;

        const v1 = rotate([ball.vx, ball.vy], -theta);
        const v2 = rotate([o.vx, o.vy], -theta);
        const u1 = rotate(
          [
            (v1[0] * (m1 - m2)) / (m1 + m2) + (v2[0] * 2 * m2) / (m1 + m2),
            v1[1],
          ],
          theta
        );
        const u2 = rotate(
          [
            (v2[0] * (m2 - m1)) / (m1 + m2) + (v1[0] * 2 * m1) / (m1 + m2),
            v2[1],
          ],
          theta
        );

        ball.vx = u1[0];
        ball.vy = u1[1];
        o.vx = u2[0];
        o.vy = u2[1];
      }
    }
  });

  return collision;
}
