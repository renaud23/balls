import { OrientedVect2D } from "../physic/intersector";
import { MotorPhysic } from "../physic/motor";
import { Circle, Element, PhysicType, Rectangle, Vect2D } from "../physic/type";
import { drawCircle } from "../utils";

export let EXTRA_POINTS: Array<Vect2D | OrientedVect2D> = [];

export function createRender(width: number, height: number) {
  return (context: CanvasRenderingContext2D, motor: MotorPhysic) => {
    //
    context.canvas.width = width;
    context.canvas.height = height;
    context.fillStyle = "lightgrey";
    context.fillRect(0, 0, width, height);

    //
    motor.elements.forEach((e) => {
      renderElement(context, e);
    });

    if (EXTRA_POINTS.length) {
      EXTRA_POINTS.forEach(([x, y]) => {
        drawCircle(context, "red", x, y, 3);
      });
    }
    // EXTRA_POINTS = [];
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
  context.fillStyle = "yellow";
  context.beginPath();
  context.fillRect(x, y, rectangle.width, rectangle.height);
  context.rect(x, y, rectangle.width, rectangle.height);
  context.stroke();
}
