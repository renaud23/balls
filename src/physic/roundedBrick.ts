import { Circle, PhysicType, Rectangle, RoundedBrickPx, Vect2D } from "./type";

let SEQUENCE = 1;

export function createRoundedBrickPx(
  position: Vect2D,
  width: number,
  height: number
): RoundedBrickPx {
  const [x, y] = position;

  const body: Rectangle = {
    type: PhysicType.Rectangle,
    position: [x + height / 2, y],
    width: width - height,
    height,
  };

  const all: Rectangle = {
    type: PhysicType.Rectangle,
    position: [x, y],
    width: width,
    height,
  };

  const left: Circle = {
    type: PhysicType.Circle,
    position: [x + height / 2, y + height / 2],
    radius: height / 2,
  };
  const right: Circle = {
    type: PhysicType.Circle,
    position: [x + body.width + height / 2, y + height / 2],
    radius: height / 2,
  };

  return {
    id: `rouded-brick-${SEQUENCE++}`,
    type: PhysicType.RoundedRectangle,
    all,
    body,
    left,
    right,
  };
}
