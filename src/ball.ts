import { getRandomInt } from "./utils";

let BALL_SEQUENCE = 1;

export type Ball = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  velocity: number;
};

export function render(context: CanvasRenderingContext2D, ball: Ball) {
  context.strokeStyle = "black";
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  context.stroke();
  context.strokeStyle = "red";
  context.beginPath();
  context.moveTo(ball.x, ball.y);
  context.lineTo(
    ball.x + ball.vx * ball.velocity,
    ball.y + ball.vy * ball.velocity
  );
  context.stroke();
}

export function createBall(
  x: number,
  y: number,
  radius: number,
  angle: number,
  velocity: number
): Ball {
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;

  return { id: BALL_SEQUENCE++, x, y, radius, vx, vy, velocity };
}

export function createRandomBall(width: number, height: number): Ball {
  const velocity = 2 + getRandomInt(3);
  const angle = Math.PI * 2 * Math.random();
  const radius = 10 + getRandomInt(10);
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  const x = radius + getRandomInt(width - 2 * radius);
  const y = radius + getRandomInt(height - 2 * radius);

  return { id: BALL_SEQUENCE++, x, y, vx, vy, radius, velocity };
}

export function move(ball: Ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
}
