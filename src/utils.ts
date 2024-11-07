export function distance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

export function rotate(v: [number, number], theta: number) {
  return [
    v[0] * Math.cos(theta) - v[1] * Math.sin(theta),
    v[0] * Math.sin(theta) + v[1] * Math.cos(theta),
  ];
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
