import { createLevel } from "../levels/createLevel";
import { LEVEL1 } from "../levels/l1";
import { createBallPx } from "../physic/ball";
import { MotorPx } from "../physic/motor";
import { BallPx, BrickPx, Vect2D } from "../physic/type";

export type Game = {
  balls: Ball[];
  bricks: Brick[];
  activate: () => void;
};

export type Ball = {
  px: BallPx;
};

export type Brick = {
  px: BrickPx;
  life: number;
};

function createBall(width: number, height: number): Ball {
  const radius = 8;
  const alpha = (7 * Math.PI) / 8;
  const velocity = 4;
  const direction: Vect2D = [
    Math.cos(alpha) * velocity,
    Math.sin(alpha) * velocity,
  ];
  const position: Vect2D = [width / 2 - radius, height - 4 * radius];

  return { px: createBallPx(position, direction, radius) };
}

export function createGame(
  width: number,
  height: number,
  motorPx: MotorPx
): Game {
  // level
  const bricks = createLevel(width, height, LEVEL1);
  const bricksQA = new Map<string, Brick>();

  bricks.forEach((b) => {
    bricksQA.set(b.px.id, b);
    motorPx.appendElements(b.px);
  });

  // ball
  const balls = new Array<Ball>(10)
    .fill(null)
    .map(() => createBall(width, height));
  const ballsQA = new Map<string, Ball>();
  balls.forEach((b) => {
    ballsQA.set(b.px.id, b);
    motorPx.appendElements(b.px);
  });

  return {
    balls,
    bricks,
    /* */
    activate: () => {
      const events = motorPx.activate();
      if (events.length) console.log(events);
    },
  };
}
