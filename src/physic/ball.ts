import { getRandomInt } from "../utils";
import { BallPx, PhysicType } from "./type";

let BALL_SEQUENCE = 1;

export function createRandomBall(width: number, height: number): BallPx {
  const velocity = 4;
  const angle = Math.PI * 2 * Math.random();
  const radius = 8 + getRandomInt(0);
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  const x = radius + getRandomInt(width - 2 * radius);
  const y = radius + getRandomInt(height - 2 * radius);

  return {
    type: PhysicType.Circle,
    id: `${BALL_SEQUENCE++}`,
    position: [x, y],
    radius,
    direction: [vx, vy],
  };
}

export function createBallPx(width: number, height: number): BallPx {
  const velocity = 4;
  const angle = Math.PI * 2 * Math.random();
  const radius = 8 + getRandomInt(0);
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  const x = radius + getRandomInt(width - 2 * radius);
  const y = radius + getRandomInt(height - 2 * radius);

  return {
    type: PhysicType.Circle,
    id: `${BALL_SEQUENCE++}`,
    position: [x, y],
    radius,
    direction: [vx, vy],
  };
}
