import { Ball, Brick, Game, Raquette } from "../game/game";
import { OrientedVect2D } from "../physic/intersector";
import { Vect2D } from "../physic/type";
import { drawPoint, prodVectVect2D } from "../utils";

export const POINTS_DRAW_DEBBUG: Array<Vect2D | OrientedVect2D> = [];

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

function renderRaquette(
  context: CanvasRenderingContext2D,
  ratio: Vect2D,
  raquette: Raquette
) {
  context.strokeStyle = "blue";

  context.beginPath();
  context.arc(
    raquette.px.left.position[0] * ratio[0],
    raquette.px.left.position[1] * ratio[1],
    raquette.px.left.radius * ratio[0],
    0,
    Math.PI * 2
  );

  context.stroke();

  context.beginPath();
  context.arc(
    raquette.px.right.position[0] * ratio[0],
    raquette.px.right.position[1] * ratio[1],
    raquette.px.right.radius * ratio[0],
    0,
    Math.PI * 2
  );
  context.stroke();
  context.beginPath();
  context.rect(
    raquette.px.body.position[0] * ratio[0],
    raquette.px.body.position[1] * ratio[1],
    raquette.px.body.width * ratio[0],
    raquette.px.body.height * ratio[1]
  );
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
    renderRaquette(context, ratio, game.raquette);

    // Debug
    POINTS_DRAW_DEBBUG.forEach(([x, y]) => {
      drawPoint(context, "white", x, y);
    });
  };
}
