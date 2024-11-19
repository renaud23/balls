import { POINTS_DRAW_DEBBUG } from "../graphics/render";
import { distance } from "../utils";
import {
  BallPx,
  BrickPx,
  Circle,
  DIRECTION,
  Element,
  PhysicType,
  Rectangle,
  RoundedBrickPx,
  RoundedRectangle,
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
const intesectorBallVsBall: Intersector<Circle, Circle> = function (
  a: Circle,
  b: Circle
) {
  const alpha = Math.atan2(
    b.position[1] - a.position[1],
    b.position[0] - a.position[0]
  );
  const hypo =
    distance(a.position[0], a.position[1], b.position[0], b.position[1]) -
    b.radius;
  const dx = Math.cos(alpha) * hypo;
  const dy = Math.sin(alpha) * hypo;

  return [[a.position[0] + dx, a.position[1] + dy]];
};

/**
 *
 * @param a
 * @param b
 * @returns
 */
const interctorBallVsBrick: Intersector<Circle, Rectangle> = function (
  a: Circle,
  b: Rectangle
) {
  const points: OrientedVect2D[] = [
    ...getNorth(a, b),
    ...getSouth(a, b),
    ...getEast(a, b),
    ...getWest(a, b),
  ];

  // points.forEach((p) => {
  //   if (isInBrick(p, b)) POINTS_DRAW_DEBBUG.push(p);
  // });

  return points.filter((v) => isInBrick(v, b));
};

export const intersectorBallVsRoundedBrick: Intersector<
  Circle,
  RoundedBrickPx
> = function (a: Circle, b: RoundedRectangle) {
  const pleft = intesectorBallVsBall(a, b.left);
  const pright = intesectorBallVsBall(a, b.right);
  const pbody = interctorBallVsBrick(a, b.body);

  const points = [...pleft, ...pright, ...pbody];

  // points.forEach((p) => {
  //   POINTS_DRAW_DEBBUG.push(p);
  // });

  return points;
};

/**
 *
 * @param a
 * @param b
 * @returns
 */
export function intersect(a: Element, b: Element) {
  if (a.type === PhysicType.Circle) {
    if (b.type === PhysicType.Circle) {
      return intesectorBallVsBall(a, b);
    } else if (b.type === PhysicType.Rectangle) {
      return interctorBallVsBrick(a, b);
    } else if (b.type === PhysicType.RoundedRectangle) {
      return intersectorBallVsRoundedBrick(a, b);
    }
  }

  throw new Error("Unsupported opération, Intesect");
}

/* */

/* */
export function getNorth(ball: Circle, brick: Rectangle): OrientedVect2D[] {
  const points: OrientedVect2D[] = [];
  const a = brick.position[1] - ball.position[1];
  const theta = Math.asin(a / ball.radius);
  const dx = ball.radius * Math.cos(theta);

  points.push([ball.position[0] + dx, brick.position[1], DIRECTION.NORTH]);
  points.push([ball.position[0] - dx, brick.position[1], DIRECTION.NORTH]);

  return points;
}

export function getSouth(ball: Circle, brick: Rectangle) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[1] + brick.height - ball.position[1];
  const theta = Math.asin(a / ball.radius);
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

export function getEast(ball: Circle, brick: Rectangle) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[0] + brick.width - ball.position[0];
  const theta = Math.acos(a / ball.radius);
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

export function getWest(ball: Circle, brick: Rectangle) {
  const points: OrientedVect2D[] = [];
  const a = brick.position[0] - ball.position[0];
  const theta = Math.acos(a / ball.radius);
  const dy = ball.radius * Math.sin(theta);

  points.push([brick.position[0], ball.position[1] + dy, DIRECTION.WEST]);
  points.push([brick.position[0], ball.position[1] - dy, DIRECTION.WEST]);

  return points;
}

export function isInBrick(vect: OrientedVect2D, b: Rectangle) {
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
