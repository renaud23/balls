import { Ball, Brick, Game } from "../game/game";
import { Vect2D } from "../physic/type";
import { prodVectVect2D } from "../utils";

function renderBrick(
  context: CanvasRenderingContext2D,
  ratio: Vect2D,
  brick: Brick
) {
  const [x, y] = prodVectVect2D(brick.px.position, ratio);
  const [width, height] = prodVectVect2D(
    [brick.px.width, brick.px.height],
    ratio
  );
  context.strokeStyle = "blue";
  context.fillStyle = "red";
  context.beginPath();
  context.fillRect(x, y, width, height);
  context.rect(x, y, width, height);
  context.stroke();
}

function renderBall(
  context: CanvasRenderingContext2D,
  ratio: Vect2D,
  ball: Ball
) {
  const [x, y] = prodVectVect2D(ball.px.position, ratio);

  context.strokeStyle = "blue";
  context.fillStyle = "yellow";
  context.beginPath();
  context.arc(x, y, ball.px.radius * ratio[0], 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

export function createRenderGame(width: number, height: number) {
  return (context: CanvasRenderingContext2D, game: Game) => {
    const ratio: Vect2D = [width / game.px.width, height / game.px.height];

    //
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "lightgrey";
    context.fillRect(0, 0, width, height);
    //
    game.bricks.forEach((b) => {
      renderBrick(context, ratio, b);
    });
    //
    game.balls.forEach((b) => {
      renderBall(context, ratio, b);
    });
  };
}
