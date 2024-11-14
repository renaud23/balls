import { EXTRA_POINTS } from "../graphics/render";
import { sumVect2D } from "../utils";
import { checkCollision } from "./collider";
import { filter } from "./filter";
import { Collision, intersect } from "./intersector";
import { reactor } from "./reactor";
import { PhysicType, Walls, type Element, type Mobile } from "./type";

export type MotorPhysic = {
  width: number;
  height: number;
  elements: Array<Element>;
  /* */
  appendElements: (e: Element | Element[]) => void;
  activate: () => void;
};

export type MotorPhysicParams = {
  width: number;
  height: number;
};

function castAsMobile(e: Element) {
  if ("direction" in e && Array.isArray(e.direction)) {
    return e as Mobile & Element;
  }
}

/**
 *
 * @param elements
 * @returns
 */
function createAppendElement(elements: Element[]) {
  return (e: Element | Element[]) => {
    if (e) {
      if (Array.isArray(e)) {
        e.forEach((o) => {
          elements.push(o);
        });
      } else {
        elements.push(e);
      }
    }
  };
}

/**
 *
 */
function move(e?: Mobile & Element) {
  if (e) {
    const { direction, position } = e;
    e.position = sumVect2D(position, direction);
  }
}

/**
 *
 * @param params
 * @param elements
 * @returns
 */
function createActivate(params: MotorPhysicParams, elements: Element[]) {
  return () => {
    const { width, height } = params;
    elements.forEach((a) => {
      /* */
      const mobile = castAsMobile(a);
      if (mobile) {
        move(mobile);

        /* */
        const walls: Walls = { type: PhysicType.Walls, width, height };
        if (checkCollision(a, walls)) {
          reactor(a, walls);
        }

        /* */
        const collisions: Array<Collision<Element, Element>> = [];
        elements.forEach((b) => {
          if (a.id !== b.id) {
            if (checkCollision(a, b)) {
              const points = intersect(a, b);
              collisions.push({ a, b, points });
            }
          }
        });

        /* */
        if (collisions.length) {
          const best = filter(collisions);

          if (best) {
            const [b, points] = best;
            reactor(a, b, points);
          }
          // reactor(collisions[0]);
          //
          // collisions.forEach((c) => {
          //   c.points.forEach((p) => {
          //     EXTRA_POINTS.push(p);
          //   });
          // });
        }
      }
    });
  };
}

/**
 *
 * @param params
 * @returns
 */
export function createMotorPx(params: MotorPhysicParams): MotorPhysic {
  const { width, height } = params;
  const elements: Element[] = [];

  return {
    elements,
    width,
    height,

    /* */
    appendElements: createAppendElement(elements),
    activate: createActivate(params, elements),
  };
}
