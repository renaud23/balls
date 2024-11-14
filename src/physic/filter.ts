import { distance } from "../utils";
import { Collision, OrientedVect2D } from "./intersector";
import { Ball, Brick, Element, PhysicType, Vect2D } from "./type";

// export type FilterCollision<A, B> = (
//   collisions: Collision<A, B>[]
// ) => Collision<A, B> | undefined;

const distanceBallVsBrickOrBrick = function (a: Ball, b1: Brick, b2: Brick) {
  return undefined;
};

export function filter(
  collisions: Collision<Element, Element>[]
): [Element, Vect2D | OrientedVect2D] | undefined {
  if (!collisions.length) {
    return undefined;
  }
  //   if (collisions.length === 1) {
  //     return collisions[0];
  //   }

  //   let best: Collision<Element, Element>;
  //   let distance: number = Number.MAX_SAFE_INTEGER;
  //   collisions.forEach((c1, i) => {
  //     collisions.forEach((c2, j) => {
  //       if (i !== j) {
  //         if (c1.a.type === PhysicType.Circle) {
  //           if (
  //             c1.b.type === PhysicType.Rectangle &&
  //             c2.b.type === PhysicType.Rectangle
  //           ) {
  //             const d = distanceBallVsBrickOrBrick(c1.a, c1.b, c2.b);
  //           } else if (
  //             c1.b.type === PhysicType.Circle &&
  //             c2.b.type === PhysicType.Rectangle
  //           ) {
  //             // a -> Circle vs Brick
  //           } else if (
  //             c1.b.type === PhysicType.Rectangle &&
  //             c2.b.type === PhysicType.Circle
  //           ) {
  //             // a -> Brick vs circle
  //           } else if (
  //             c1.b.type === PhysicType.Circle &&
  //             c2.b.type === PhysicType.Circle
  //           ) {
  //             // a -> Circle vs circle
  //           }
  //         }
  //       }
  //     });
  //   });
  //   return best;

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
