import { Game } from "./game";
import { distance, getRandomInt, rotate } from "./utils";

let BALL_SEQUENCE = 1;

export type Ball = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  velocity: number;
  color: string;
};

export function render(context: CanvasRenderingContext2D, ball: Ball) {
  context.strokeStyle = ball.color;
  context.fillStyle = "lavender";
  context.lineWidth = 1;
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  context.fill();
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

  return { id: BALL_SEQUENCE++, x, y, radius, vx, vy, velocity, color: "blue" };
}

export function createRandomBall(width: number, height: number): Ball {
  const velocity = 5;
  const angle = Math.PI * 2 * Math.random();
  const radius = 10 + getRandomInt(0);
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  const x = radius + getRandomInt(width - 2 * radius);
  const y = height / 2 + radius + getRandomInt(height - 2 * radius);

  return { id: BALL_SEQUENCE++, x, y, vx, vy, radius, velocity, color: "blue" };
}

export function move(ball: Ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
}

export function collision(game: Game, ball: Ball) {
  let collision = false;

  game.balls.forEach((o) => {
    if (o.id !== ball.id) {
      const dist = distance(ball.x, ball.y, o.x, o.y);
      if (dist < o.radius + ball.radius) {
        collision = true;

        const theta = Math.atan2(o.y - ball.y, o.x - ball.x);
        const delta = o.radius + ball.radius - dist + 1;
        ball.x -= Math.cos(theta) * delta;
        ball.y -= Math.sin(theta) * delta;
        /*         */

        const m1 = ball.radius;
        const m2 = o.radius;

        const v1 = rotate([ball.vx, ball.vy], -theta);
        const v2 = rotate([o.vx, o.vy], -theta);
        const u1 = rotate(
          [
            (v1[0] * (m1 - m2)) / (m1 + m2) + (v2[0] * 2 * m2) / (m1 + m2),
            v1[1],
          ],
          theta
        );
        const u2 = rotate(
          [
            (v2[0] * (m2 - m1)) / (m1 + m2) + (v1[0] * 2 * m1) / (m1 + m2),
            v2[1],
          ],
          theta
        );

        ball.vx = u1[0];
        ball.vy = u1[1];
        o.vx = u2[0];
        o.vy = u2[1];
      }
    }
  });

  return collision;
}
