import { POINTS_DRAW_DEBBUG } from "../graphics/render";
import { sumVect2D } from "../utils";
import { checkCollision } from "./collider";
import { filter } from "./filter";
import { Collision, intersect, OrientedVect2D } from "./intersector";
import { reactor } from "./reactor";
import { PhysicType, Vect2D, Walls, type Element, type Mobile } from "./type";

export type EventCollisionPx = {
  a: Element;
  b: Element;
  point: Vect2D | OrientedVect2D;
};

export type MotorPx = {
  width: number;
  height: number;
  elements: Array<Element>;
  /* */
  appendElements: (e: Element | Element[]) => void;
  activate: () => EventCollisionPx[];
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
    const events: EventCollisionPx[] = [];

    // POINTS_DRAW_DEBBUG.splice(0, POINTS_DRAW_DEBBUG.length);

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
            const [b, point] = best;
            POINTS_DRAW_DEBBUG.push([point[0], point[1]]);
            reactor(a, b, point);
            events.push({ a, b, point });
          }
        }
      }
    });
    return events;
  };
}

/**
 *
 * @param params
 * @returns
 */
export function createMotorPx(params: MotorPhysicParams): MotorPx {
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
