import { BrickPx, PhysicType } from "../physic/type";

export function transformLevel(
  gw: number,
  gh: number,
  level: string[]
): Array<BrickPx> {
  const bricks: Array<BrickPx> = [];
  const ratio = gh / gw;
  const width = gw / level[0].length;
  const height = gh / (level[0].length * ratio);

  level.forEach((ligne, j) => {
    const codes = ligne.split("");
    const length = ligne.length;

    codes.forEach((code, i) => {
      if (code === "1") {
        const x = (i % length) * width;
        const y = j * height;

        bricks.push({
          type: PhysicType.Rectangle,
          id: `${x * 100 + y}`,
          position: [x, y],
          width,
          height,
        });
      }
    });
  });

  return bricks;
}
