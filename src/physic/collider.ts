import { distance2 } from "../utils";
import {
  BallPx,
  BrickPx,
  Circle,
  Collider,
  Element,
  PhysicType,
  Rectangle,
  RoundedBrickPx,
  RoundedRectangle,
  Walls,
} from "./type";

const collisionBallVsBrick: Collider<Circle, Rectangle> = function (
  a: Circle,
  b: Rectangle
) {
  const maxx = Math.max(a.position[0] + a.radius, b.position[0] + b.width);
  const minx = Math.min(a.position[0] - a.radius, b.position[0]);
  const maxy = Math.max(a.position[1] + a.radius, b.position[1] + b.height);
  const miny = Math.min(a.position[1] - a.radius, b.position[1]);

  const dx = maxx - minx;
  const dy = maxy - miny;

  if (dx < a.radius * 2 + b.width && dy < a.radius * 2 + b.height) {
    return true;
  }

  return false;
};

const collisionBallVsBall: Collider<Circle, Circle> = function (
  A: Circle,
  B: Circle
) {
  const dist = distance2(A.position, B.position);

  if (dist < A.radius + B.radius) {
    return true;
  }

  return false;
};

export const colliderBallVsWall: Collider<Circle, Walls> = function (
  A: Circle,
  B: Walls
) {
  const [x, y] = A.position;
  if (
    x - A.radius < 0 ||
    x + A.radius > B.width ||
    y - A.radius < 0 ||
    y + A.radius > B.height
  ) {
    return true;
  }
  return false;
};

/**
 *
 * @param A
 * @param B
 * @returns
 */
export const colliderBallVsRoundedBrick: Collider<Circle, RoundedRectangle> =
  function (A: Circle, B: RoundedRectangle) {
    return collisionBallVsBrick(A, B.all);
  };

/**
 *
 * @param A
 * @param B
 * @returns
 */
export function checkCollision(A: Element, B: Element | Walls): boolean {
  if (A.type === PhysicType.Circle) {
    if (B.type === PhysicType.Walls) {
      return colliderBallVsWall(A, B);
    } else if (B.type === PhysicType.Circle) {
      return collisionBallVsBall(A, B);
    } else if (B.type === PhysicType.Rectangle) {
      return collisionBallVsBrick(A, B);
    } else if (B.type === PhysicType.RoundedRectangle) {
      return colliderBallVsRoundedBrick(A, B);
    }
  } else if (A.type === PhysicType.RoundedRectangle) {
    if (B.type === PhysicType.Circle) {
      // TODO
      return false;
    } else if (B.type === PhysicType.Rectangle) {
      // TODO
      return false;
    }
  }

  throw new Error("Unsupported walls collision type" + A.type);
}
