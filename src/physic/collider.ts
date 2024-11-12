import { Ball, Brick, Collider } from "./type";

export const collisionBallVsBrick: Collider<Ball, Brick> = function (
  A: Ball,
  B: Brick
) {
  return false;
};

export const collisionBallVsBall: Collider<Ball, Ball> = function (
  A: Ball,
  B: Brick
) {
  return false;
};
