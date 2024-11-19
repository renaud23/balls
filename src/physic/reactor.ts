import {
  BallPx,
  BrickPx,
  DIRECTION,
  Element,
  PhysicType,
  RoundedBrickPx,
  Vect2D,
  Walls,
} from "./type";
import type { OrientedVect2D } from "./intersector";
import { distance, distance2, rotate } from "../utils";

export type Reactor<A, B> = (
  a: A,
  b: B,
  point?: Vect2D | OrientedVect2D
) => void;

export const reactorBallVsWall: Reactor<BallPx, Walls> = function (
  a: BallPx,
  b: Walls
) {
  const [x, y] = a.position;
  if (x - a.radius < 0) {
    a.position[0] = a.radius;
    a.direction[0] *= -1;
  } else if (x + a.radius > b.width) {
    a.position[0] = b.width - a.radius;
    a.direction[0] *= -1;
  }

  if (y - a.radius < 0) {
    a.position[1] = a.radius;
    a.direction[1] *= -1;
  } else if (y + a.radius > b.height) {
    a.position[1] = b.height - a.radius;
    a.direction[1] *= -1;
  }
};

/**
 *
 * @param a
 * @param b
 */
export const reactorBallVsBall: Reactor<BallPx, BallPx> = (
  a: BallPx,
  b: BallPx,
  point?: OrientedVect2D | Vect2D
) => {
  // Séparation
  if (point) {
    // a.position[0] = point[0];
    // a.position[1] = point[1];

    const alpha = Math.atan2(
      b.position[1] - a.position[1],
      b.position[0] - a.position[0]
    );
    const hypo =
      distance(a.position[0], a.position[1], b.position[0], b.position[1]) -
      b.radius -
      a.radius;
    const dx = Math.cos(alpha) * hypo;
    const dy = Math.sin(alpha) * hypo;

    a.position[0] += dx;
    a.position[1] += dy;
  }
  // lois de Newton
  const [ax, ay] = a.position;
  const [bx, by] = b.position;
  const theta = -Math.atan2(by - ay, bx - ax);
  const m1 = a.radius;
  const m2 = b.radius;

  const v1 = rotate(a.direction, theta);
  const v2 = rotate(b.direction, theta);

  const u1 = rotate(
    [(v1[0] * (m1 - m2)) / (m1 + m2) + (v2[0] * 2 * m2) / (m1 + m2), v1[1]],
    -theta
  );
  const u2 = rotate(
    [(v2[0] * (m2 - m1)) / (m1 + m2) + (v1[0] * 2 * m1) / (m1 + m2), v2[1]],
    -theta
  );

  a.direction = u1;
  b.direction = u2;
};

export const reactorBallVsBrick: Reactor<BallPx, BrickPx> = function (
  a: BallPx,
  b: BrickPx,
  point?: OrientedVect2D | Vect2D
) {
  if (point) {
    const direction = point[2];

    if (direction === DIRECTION.WEST) {
      a.position[0] = b.position[0] - a.radius - 1;
      a.direction[0] *= -1;
    } else if (direction === DIRECTION.EAST) {
      a.position[0] = b.position[0] + b.width + a.radius + 1;
      a.direction[0] *= -1;
    } else if (direction === DIRECTION.SOUTH) {
      a.position[1] = b.position[1] + b.height + a.radius;
      a.direction[1] *= -1;
    } else if (direction === DIRECTION.NORTH) {
      a.position[1] = b.position[1] - a.radius;
      a.direction[1] *= -1;
    }
  }
};

export const reactorBallVsRoundedBrick: Reactor<BallPx, RoundedBrickPx> =
  function (a: BallPx, b: RoundedBrickPx, point?: OrientedVect2D | Vect2D) {};

/**
 *
 * @param a
 * @param b
 * @returns
 */
export function reactor(
  a: Element,
  b: Element | Walls,
  point?: Vect2D | OrientedVect2D
) {
  if (a.type === PhysicType.Circle) {
    if (b.type === PhysicType.Walls) {
      return reactorBallVsWall(a, b);
    } else if (b.type === PhysicType.Circle) {
      return reactorBallVsBall(a, b, point);
    } else if (b.type === PhysicType.Rectangle) {
      return reactorBallVsBrick(a, b, point);
    } else if (b.type === PhysicType.RoundedRectangle) {
      return reactorBallVsRoundedBrick(a, b);
    }
  }

  throw new Error(`Unsupported operation`);
}
