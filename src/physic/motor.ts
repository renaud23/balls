import type { Element } from "./type";

export type MotorPhysic = {
  width: number;
  height: number;
  elements: Array<Element>;
  /* */
  appendElements: (e: Element | Element[]) => void;
};

export type MotorPhysicParams = {
  width: number;
  height: number;
};

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

export function createMotorPx(params: MotorPhysicParams): MotorPhysic {
  const { width, height } = params;
  const elements: Element[] = [];

  return {
    elements,
    width,
    height,

    /* */
    appendElements: createAppendElement(elements),
  };
}
