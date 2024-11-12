import { DEBUG } from "./App";
import { Ball } from "./ball";
import { Game } from "./game";
import { distance, drawCircle, drawPoint } from "./utils";

let SEQUENCE_BRIQUE = 0;

export const POINT = { x: 0, y: 0 };

const DIRECTION = {
  NORTH: 1,
  SOUTH: 2,
  EAST: 4,
  WEST: 8,
};

type Collision = {
  brick: Brick;
  points: number[][];
};

export type Brick = {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  collided?: boolean;
  /* */
  points?: number[][];
  collision?: Array<number>;
};

export function render(
  context: CanvasRenderingContext2D,
  game: Game,
  brick: Brick
) {
  const rw = game.width / context.canvas.width;
  const rh = game.height / context.canvas.height;

  context.strokeStyle = "black";
  context.fillStyle = brick.collided ? "brown" : "red";
  context.beginPath();
  context.fillRect(
    brick.x / rw,
    brick.y / rh,
    brick.width / rw,
    brick.height / rh
  );
  context.strokeRect(
    brick.x / rw,
    brick.y / rh,
    brick.width / rw,
    brick.height / rh
  );
  if (DEBUG) {
    brick.points?.forEach(([x, y]) => {
      drawPoint(context, "magenta", x, y);
      drawCircle(context, "white", x, y, 5);
    });
  }
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
  const candidats: Array<Collision> = [];
  ball.collided = false;
  game.bricks.forEach((brick) => {
    brick.collided = false;

    const w =
      Math.max(brick.x + brick.width, ball.x + ball.radius) -
      Math.min(brick.x, ball.x - ball.radius);
    const h =
      Math.max(brick.y + brick.height, ball.y + ball.radius) -
      Math.min(brick.y, ball.y - ball.radius);
    if (
      w < brick.width + ball.radius * 2 &&
      h < brick.height + ball.radius * 2
    ) {
      collided = true;
      brick.collided = true;

      // const points: number[][] = getCollisionPoints(ball, brick);
      const points: number[][] = intersectionPoints(ball, brick);
      if (DEBUG) {
        brick.points = points;
      }
      candidats.push({ brick, points });
    }
  });

  if (candidats) {
    let best: Collision;
    let dist = Number.MAX_SAFE_INTEGER;

    candidats.forEach((coll) => {
      const { points } = coll;
      points.forEach(([x, y]) => {
        const d = distance(ball.x - ball.vx, ball.y - ball.vy, x, y);
        if (d < dist) {
          dist = d;
          best = coll;
        }
      });
    });

    if (best) {
      resolveCollision(ball, best);
    }
  }

  return collided;
}

/* méthode 2 */

export function intersectionPoints(ball: Ball, brick: Brick) {
  const points: number[][] = [
    ...getEast2(ball, brick),
    ...getWest2(ball, brick),
    ...getNorth2(ball, brick),
    ...getSouth2(ball, brick),
  ];

  return points.filter(([x, y]) => isInBrick(brick, x, y));
}

export function getNorth2(ball: Ball, brick: Brick) {
  const points: number[][] = [];
  const a = brick.y - ball.y;
  const theta = Math.asin(a / ball.radius);
  const dx = ball.radius * Math.cos(theta);

  points.push([ball.x + dx, brick.y, DIRECTION.NORTH]);
  points.push([ball.x - dx, brick.y, DIRECTION.NORTH]);

  return points;
}

export function getSouth2(ball: Ball, brick: Brick) {
  const points: number[][] = [];
  const a = brick.y + brick.height - ball.y;
  const theta = Math.asin(a / ball.radius);
  const dx = ball.radius * Math.cos(theta);

  points.push([ball.x + dx, brick.y + brick.height, DIRECTION.SOUTH]);
  points.push([ball.x - dx, brick.y + brick.height, DIRECTION.SOUTH]);

  return points;
}

export function getEast2(ball: Ball, brick: Brick) {
  const points: number[][] = [];
  const a = brick.x - ball.x;
  const theta = Math.acos(a / ball.radius);
  const dy = ball.radius * Math.sin(theta);

  points.push([brick.x, ball.y + dy, DIRECTION.WEST]);
  points.push([brick.x, ball.y - dy, DIRECTION.WEST]);

  return points;
}

export function getWest2(ball: Ball, brick: Brick) {
  const points: number[][] = [];
  const a = brick.x + brick.width - ball.x;
  const theta = Math.acos(a / ball.radius);
  const dy = ball.radius * Math.sin(theta);

  points.push([brick.x + brick.width, ball.y + dy, DIRECTION.EAST]);
  points.push([brick.x + brick.width, ball.y - dy, DIRECTION.EAST]);

  return points;
}

/* méthode 1 */

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
  const dx = dy / Math.tan(alpha);

  return [ball.x + dx, ball.y + dy, DIRECTION.SOUTH];
}

export function getNorth(ball: Ball, brick: Brick, alpha: number) {
  const dy = brick.y - ball.y;
  const dx = dy / Math.tan(alpha);

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

export function getCollisionPoints(ball: Ball, brick: Brick) {
  const points = [];
  const alpha = Math.atan2(ball.vy, ball.vx);
  points.push(getEast(ball, brick, alpha));
  points.push(getWest(ball, brick, alpha));
  points.push(getSouth(ball, brick, alpha));
  points.push(getNorth(ball, brick, alpha));

  return points.filter(([x, y]) => isInBrick(brick, x, y));
}

/*  */
export function resolveCollision(ball: Ball, collision: Collision) {
  const { brick, points } = collision;
  brick.collided = true;
  if (points) {
    const [gx, gy, direction] = nearest(
      points,
      ball.x - ball.vx,
      ball.y - ball.vy
    );

    if (direction === DIRECTION.WEST) {
      ball.x = brick.x - ball.radius;
      ball.vx *= -1;
    } else if (direction === DIRECTION.EAST) {
      ball.x = brick.x + brick.width + ball.radius;
      ball.vx *= -1;
    }

    if (direction === DIRECTION.SOUTH) {
      ball.y = brick.y + brick.height + ball.radius;
      ball.vy *= -1;
    } else if (direction === DIRECTION.NORTH) {
      ball.y = brick.y - ball.radius;
      ball.vy *= -1;
    }
  }
}
