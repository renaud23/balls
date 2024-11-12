export enum DIRECTION {
  NORTH = 1,
  SOUTH = 2,
  EAST = 4,
  WEST = 8,
}

/* */
export type Vect2D = [number, number];

export type Identifiable = {
  id: string;
};

export enum PhysicType {
  Circle = "CIRCLE",
  Rectangle = "RECTANGLE",
}

export type Circle = {
  type: PhysicType.Circle;
  position: Vect2D;
  radius: number;
};

export type Rectangle = {
  type: PhysicType.Rectangle;
  position: Vect2D;
  width: number;
  height: number;
};

export type Mobile = {
  direction: Vect2D;
  velocity?: number;
  angle?: number;
};

export type Ball = Circle & Mobile & Identifiable;

export type Brick = Rectangle & Identifiable;

export type Element = Ball | Rectangle;

/* */

export type Collider<A extends Element, B extends Element> = (
  a: A,
  b: B
) => boolean;
