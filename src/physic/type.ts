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
  RoundedRectangle = "ROUNDED_RECTANGLE",
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

export type RoundedRectangle = {
  type: PhysicType.RoundedRectangle;
  all: Rectangle;
  body: Rectangle;
  left: Circle;
  right: Circle;
};

export type Mobile = {
  direction: Vect2D;
  velocity?: number;
  angle?: number;
};

export type Walls = { type: PhysicType.Walls; width: number; height: number };

export type BallPx = Circle & Mobile & Identifiable;

export type BrickPx = Rectangle & Identifiable;

export type RoundedBrickPx = RoundedRectangle & Identifiable;

export type Element = BallPx | BrickPx | RoundedBrickPx;

/* */

export type Collider<
  A extends Circle | Rectangle | RoundedRectangle | Walls,
  B extends Circle | Rectangle | RoundedRectangle | Walls
> = (a: A, b: B) => boolean;
