import { distance } from "../utils";
import { Collision, OrientedVect2D } from "./intersector";
import { BallPx, BrickPx, Element, PhysicType, Vect2D } from "./type";

const distanceBallVsBrickOrBrick = function (
  a: BallPx,
  b1: BrickPx,
  b2: BrickPx
) {
  return undefined;
};

export function filter(
  collisions: Collision<Element, Element>[]
): [Element, Vect2D | OrientedVect2D] | undefined {
  if (!collisions.length) {
    return undefined;
  }

  let best: Element;
  let bestPoint: Vect2D | OrientedVect2D;
  let distMin = Number.MAX_SAFE_INTEGER;
  collisions.forEach(({ a, b, points }) => {
    if (a.type === PhysicType.Circle && b.type !== PhysicType.Walls) {
      points.forEach((point) => {
        const d = distance(
          a.position[0] - a.direction[0],
          a.position[1] - a.direction[1],
          point[0],
          point[1]
        );
        if (d < distMin) {
          distMin = d;
          best = b;
          bestPoint = point;
        }
      });
    }
  });
  if (best && bestPoint) {
    return [best, bestPoint];
  }
  return undefined;
}
