import { createLevel } from "../levels/createLevel";
import { LEVEL1 } from "../levels/l1";
import { createBallPx } from "../physic/ball";
import { MotorPx } from "../physic/motor";
import { createRoundedBrickPx } from "../physic/roundedBrick";
import { BallPx, BrickPx, RoundedBrickPx, Vect2D } from "../physic/type";
import { getRandomInt } from "../utils";

export type Game = {
  balls: Ball[];
  bricks: Brick[];
  raquette: Raquette;
  //
  px: MotorPx;
  activate: () => void;
};

export type Ball = {
  px: BallPx;
};

export type Brick = {
  px: BrickPx;
  life: number;
};

export type Raquette = {
  px: RoundedBrickPx;
};

function createBall(width: number, height: number): Ball {
  const radius = 8 + getRandomInt(0);
  const alpha = (5 * Math.PI) / 4 + (Math.PI / 2) * Math.random();
  const velocity = 4;
  const direction: Vect2D = [
    Math.cos(alpha) * velocity,
    Math.sin(alpha) * velocity,
  ];
  const position: Vect2D = [width / 2 - radius, height - 10 * radius];

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

  // raquette
  const rw = 160;
  const rh = 50;
  const raquette: Raquette = {
    px: createRoundedBrickPx(
      [width / 2 - rw / 2, height / 1.5 - rh - 10],
      rw,
      rh
    ),
  };
  motorPx.appendElements(raquette.px);

  return {
    balls,
    bricks,
    raquette,
    px: motorPx,
    /* */
    activate: () => {
      const events = motorPx.activate();
      // if (events.length) console.log(events);
    },
  };
}
