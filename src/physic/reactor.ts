import {
  Ball,
  Brick,
  DIRECTION,
  Element,
  PhysicType,
  Vect2D,
  Walls,
} from "./type";
import type { Collision, OrientedVect2D } from "./intersector";
import { EXTRA_POINTS } from "../graphics/render";

export type Reactor<A, B> = (
  a: A,
  b: B,
  point?: Vect2D | OrientedVect2D
) => void;

export const reactorBallVsWall: Reactor<Ball, Walls> = function (
  a: Ball,
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
export const reactorBallVsBall: Reactor<Ball, Ball> = (
  a: Ball,
  b: Ball,
  point?: OrientedVect2D | Vect2D
) => {
  a.direction[0] = 0;
  a.direction[1] = 0;
  if (point) {
    a.position[0] = point[0];
    a.position[1] = point[1];
  }
};

export const reactorBallVsBrick: Reactor<Ball, Brick> = function (
  a: Ball,
  b: Brick,
  point?: OrientedVect2D | Vect2D
) {
  if (point) {
    EXTRA_POINTS.push(point);
    const direction = point[2];

    if (direction === DIRECTION.WEST) {
      a.position[0] = b.position[0] - a.radius;
      a.direction[0] *= -1;
    } else if (direction === DIRECTION.EAST) {
      a.position[0] = b.position[0] + b.width + a.radius;
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
    }
  }

  throw new Error(`Unsupported operation`);
}
