let SEQUENCE_BRIQUE = 0;

export type Brick = {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function render(context: CanvasRenderingContext2D, brick: Brick) {
  context.strokeStyle = "black";
  context.fillStyle = "red";
  context.beginPath();
  context.fillRect(brick.x + 1, brick.y + 1, brick.width - 1, brick.height - 1);
  context.strokeRect(
    brick.x + 1,
    brick.y + 1,
    brick.width - 1,
    brick.height - 1
  );
}

export function createBrick(
  x: number,
  y: number,
  width: number,
  height: number
): Brick {
  return { id: SEQUENCE_BRIQUE++, x, y, width, height };
}
