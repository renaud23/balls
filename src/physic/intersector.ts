import { distance } from "../utils";
import {
  BallPx,
  BrickPx,
  DIRECTION,
  Element,
  PhysicType,
  Vect2D,
  Walls,
} from "./type";

export type OrientedVect2D = [number, number, number];

export type Intersector<A, B> = (a: A, b: B) => Array<Vect2D | OrientedVect2D>;

export type Collision<A, B> = {
  a: A;
  b: B | Walls;
  points: Array<Vect2D | OrientedVect2D>;
};

/**
 *
 * @param a
 * @param b
 * @returns
 */
const intesectorBallVsBall: Intersector<BallPx, BallPx> = function (
  a: BallPx,
  b: BallPx
) {
  const alpha = Math.atan2(
    b.position[1] - a.position[1],
    b.position[0] - a.position[0]
  );
  const hypo =
    a.radius +
    b.radius -
    distance(a.position[0], a.position[1], b.position[0], b.position[1]) +
    1;
  const dx = Math.cos(alpha) * hypo;
  const dy = Math.sin(alpha) * hypo;

  return [[a.position[0] - dx, a.position[1] - dy]];
};

/**
 *
 * @param a
 * @param b
 * @returns
 */
const intesectorBallVsBrick: Intersector<BallPx, BrickPx> = function (
  a: BallPx,
  b: BrickPx
) {
  const points: OrientedVect2D[] = [
    ...getNorth(a, b),
    ...getSouth(a, b),
    ...getEast(a, b),
    ...getWest(a, b),
  ];
  return points.filter((v) => isInBrick(v, b));
};

export function intersect(a: Element, b: Element) {
  if (a.type === PhysicType.Circle) {
    if (b.type === PhysicType.Circle) {
      return intesectorBallVsBall(a, b);
    } else if (b.type === PhysicType.Rectangle) {
      return intesectorBallVsBrick(a, b);
    }
  }

  throw new Error("Unsupported opération");
}

/* */

/* */
export function getNorth(ball: BallPx, brick: BrickPx): OrientedVect2D[] {
  const points: OrientedVect2D[] = [];
  const a = brick.position[1] - ball.position[1];
  const theta = Math.acos(a / ball.radius);
  const dx = ball.radius * Math.cos(theta);

  points.push([ball.position[0] + dx, brick.position[1], DIRECTION.NORTH]);
  points.push([ball.position[0] - dx, brick.position[1], DIRECTION.NORTH]);

  return points;
}

export function getSouth(ball: BallPx, brick: BrickPx) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[1] + brick.height - ball.position[1];
  const theta = Math.acos(a / ball.radius);
  const dx = ball.radius * Math.cos(theta);

  points.push([
    ball.position[0] + dx,
    brick.position[1] + brick.height,
    DIRECTION.SOUTH,
  ]);
  points.push([
    ball.position[0] - dx,
    brick.position[1] + brick.height,
    DIRECTION.SOUTH,
  ]);

  return points;
}

export function getEast(ball: BallPx, brick: BrickPx) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[0] - ball.position[0];
  const theta = Math.asin(a / ball.radius);
  const dy = ball.radius * Math.sin(theta);

  points.push([brick.position[0], ball.position[1] + dy, DIRECTION.WEST]);
  points.push([brick.position[0], ball.position[1] - dy, DIRECTION.WEST]);

  return points;
}

export function getWest(ball: BallPx, brick: BrickPx) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[0] + brick.width - ball.position[0];
  const theta = Math.asin(a / ball.radius);
  const dy = ball.radius * Math.sin(theta);

  points.push([
    brick.position[0] + brick.width,
    ball.position[1] + dy,
    DIRECTION.EAST,
  ]);
  points.push([
    brick.position[0] + brick.width,
    ball.position[1] - dy,
    DIRECTION.EAST,
  ]);

  return points;
}

export function isInBrick(vect: OrientedVect2D, b: BrickPx) {
  const [x, y] = vect;
  if (
    x >= b.position[0] &&
    x <= b.position[0] + b.width &&
    y >= b.position[1] &&
    y <= b.position[1] + b.height
  ) {
    return true;
  }
  return false;
}
