import { Brick, Game } from "../game/game";
import { MotorPx } from "../physic/motor";
import { Circle, Element, PhysicType, Rectangle } from "../physic/type";

export function createRender(width: number, height: number) {
  return (context: CanvasRenderingContext2D, motor: MotorPx) => {
    //
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "lightgrey";
    context.fillRect(0, 0, width, height);

    //
    motor.elements.forEach((e) => {
      renderElement(context, e);
    });
  };
}

function renderElement(context: CanvasRenderingContext2D, e: Element) {
  if (e.type === PhysicType.Circle) {
    renderCircle(context, e);
  } else if (e.type === PhysicType.Rectangle) {
    renderRectangle(context, e);
  }
}

function renderCircle(context: CanvasRenderingContext2D, circle: Circle) {
  const [x, y] = circle.position;

  context.strokeStyle = "blue";
  context.fillStyle = "yellow";
  context.beginPath();
  context.arc(x, y, circle.radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

function renderRectangle(
  context: CanvasRenderingContext2D,
  rectangle: Rectangle
) {
  const [x, y] = rectangle.position;

  context.strokeStyle = "blue";
  context.fillStyle = "red";
  context.beginPath();
  context.fillRect(x, y, rectangle.width, rectangle.height);
  context.rect(x, y, rectangle.width, rectangle.height);
  context.stroke();
}

/* */

function renderBrick(context: CanvasRenderingContext2D, brick: Brick) {
  const [x, y] = brick.px.position;
  context.strokeStyle = "blue";
  context.fillStyle = "red";
  context.beginPath();
  context.fillRect(x, y, brick.px.width, brick.px.height);
  context.rect(x, y, brick.px.width, brick.px.height);
  context.stroke();
}

function renderBall(context: CanvasRenderingContext2D, ball: Ball) {
  const [x, y] = ball.px.position;

  context.strokeStyle = "blue";
  context.fillStyle = "yellow";
  context.beginPath();
  context.arc(x, y, ball.px.radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

export function createRenderGame(width: number, height: number) {
  return (context: CanvasRenderingContext2D, game: Game) => {
    //
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "lightgrey";
    context.fillRect(0, 0, width, height);
    //
    game.bricks.forEach((b) => {
      renderBrick(context, b);
    });
    //
    game.balls.forEach((b) => {
      renderBall(context, b);
    });
  };
}
