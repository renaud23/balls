import { distance2 } from "../utils";
import { Ball, Brick, Collider, Element, PhysicType, Walls } from "./type";

const collisionBallVsBrick: Collider<Ball, Brick> = function (
  a: Ball,
  b: Brick
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

const collisionBallVsBall: Collider<Ball, Ball> = function (A: Ball, B: Ball) {
  const dist = distance2(A.position, B.position);

  if (dist < A.radius + B.radius) {
    return true;
  }

  return false;
};

export const colliderBallVsWall: Collider<Ball, Walls> = function (
  A: Ball,
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

export function checkCollision(A: Element, B: Element | Walls): boolean {
  if (A.type === PhysicType.Circle) {
    if (B.type === PhysicType.Walls) {
      return colliderBallVsWall(A, B);
    } else if (B.type === PhysicType.Circle) {
      return collisionBallVsBall(A, B);
    } else if (B.type === PhysicType.Rectangle) {
      return collisionBallVsBrick(A, B);
    }
  }

  throw new Error("Unsupported walls collision type" + A.type);
}
