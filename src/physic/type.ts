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
  Walls = "WALLS",
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

export type Walls = { type: PhysicType.Walls; width: number; height: number };

export type BallPx = Circle & Mobile & Identifiable;

export type BrickPx = Rectangle & Identifiable;

export type Element = BallPx | BrickPx;

/* */

export type Collider<A extends Element | Walls, B extends Element | Walls> = (
  a: A,
  b: B
) => boolean;
