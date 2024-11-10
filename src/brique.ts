import { Ball } from "./ball";
import { Game } from "./game";
import { distance } from "./utils";

let SEQUENCE_BRIQUE = 0;

export const POINT = { x: 0, y: 0 };

const DIRECTION = {
  NORTH: 1,
  SOUTH: 2,
  EAST: 4,
  WEST: 8,
};

export type Brick = {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function render(
  context: CanvasRenderingContext2D,
  game: Game,
  brick: Brick
) {
  const rw = game.width / context.canvas.width;
  const rh = game.height / context.canvas.height;

  context.strokeStyle = "black";
  context.fillStyle = "red";
  context.beginPath();
  context.fillRect(
    (brick.x + 1) / rw,
    (brick.y + 1) / rh,
    (brick.width - 1) / rw,
    (brick.height - 1) / rh
  );
  context.strokeRect(
    (brick.x + 1) / rw,
    (brick.y + 1) / rh,
    brick.width / rw,
    brick.height / rh
  );
}

export function createBrick(
  x: number,
  y: number,
  width: number,
  height: number
): Brick {
  return { id: SEQUENCE_BRIQUE++, x, y, width, height };
}

export function collision(game: Game, ball: Ball) {
  let collided = false;

  game.bricks.forEach((brick) => {
    const w =
      Math.max(brick.x + brick.width, ball.x + ball.radius) -
      Math.min(brick.x, ball.x - ball.radius);
    const h =
      Math.max(brick.y + brick.height, ball.y + ball.radius) -
      Math.min(brick.y, ball.y - ball.radius);
    if (
      !collided &&
      w < brick.width + ball.radius * 2 &&
      h < brick.height + ball.radius * 2
    ) {
      collided = true;

      const points = [];
      const alpha = Math.atan2(ball.vy, ball.vx);
      points.push(getEast(ball, brick, alpha));
      points.push(getWest(ball, brick, alpha));
      points.push(getSouth(ball, brick, alpha));
      points.push(getNorth(ball, brick, alpha));

      const filtered = points.filter(([x, y]) => isInBrick(brick, x, y));
      ball.points = filtered;

      const [gx, gy] = nearest(filtered, ball.x, ball.y);

      ball.nearest = [gx, gy];

      ball.vx = 0;
      ball.vy = 0;

      // ball.x = gx;
      // ball.y = gy;

      // if (direction === DIRECTION.WEST) {
      //   ball.x = gx; //- ball.radius;
      // } else if (direction === DIRECTION.EAST) {
      //   ball.x = gx; //+ ball.radius;
      // }

      // if (gx === brick.x) {
      //   ball.x = brick.x - ball.radius;
      // } else if (gx === brick.x + brick.width) {
      //   ball.x = brick.x + brick.width + ball.radius;
      // }

      // if (gy === brick.y) {
      //   ball.y = brick.y - ball.radius;
      // } else if (gy === brick.y + brick.height) {
      //   ball.y = brick.y + brick.height + ball.radius;
      // }

      ball.vx = 0;
      ball.vy = 0;

      // const next = Math.PI * 2 - alpha;
      // ball.vx = ball.velocity * Math.cos(next);
      // ball.vy = ball.velocity * Math.sin(next);
    }
  });
  ball.collided = collided;
  return collided;
}

export function getWest(ball: Ball, brick: Brick, a: number) {
  const dx = brick.x - ball.x;
  const dy = dx * Math.tan(a);

  return [ball.x + dx, ball.y + dy, DIRECTION.WEST];
}

export function getEast(ball: Ball, brick: Brick, alpha: number) {
  const dx = brick.x + brick.width - ball.x;
  const dy = dx * Math.tan(alpha);
  return [ball.x + dx, ball.y + dy, DIRECTION.EAST];
}

export function getSouth(ball: Ball, brick: Brick, alpha: number) {
  const dy = brick.y + brick.height - ball.y;
  const dx = dy * Math.tan(alpha);

  return [ball.x + dx, ball.y + dy, DIRECTION.SOUTH];
}

export function getNorth(ball: Ball, brick: Brick, alpha: number) {
  const dy = brick.y - ball.y;
  const dx = dy * Math.tan(alpha);

  return [ball.x + dx, ball.y + dy, DIRECTION.NORTH];
}

export function isInBrick(brick: Brick, x: number, y: number) {
  if (
    x >= brick.x &&
    x <= brick.x + brick.width &&
    y >= brick.y &&
    y <= brick.y + brick.height
  ) {
    return true;
  }
  return false;
}

export function nearest(points: Array<Array<number>>, x: number, y: number) {
  let dist = Number.MAX_SAFE_INTEGER;
  let best: Array<number> = [];

  if (points.length) {
    points.forEach(([xi, yi, dir]) => {
      const d = distance(xi, yi, x, y);

      if (d < dist) {
        dist = d;
        best = [xi, yi, dir];
      }
    });
  }

  return best;
}
