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

export function drawPoint(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number
) {
  context.fillStyle = color;
  context.beginPath();
  context.fillRect(x, y, 2, 2);
}

export function drawCircle(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  radius: number
) {
  context.strokeStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
}

export function drawLine(
  context: CanvasRenderingContext2D,
  color: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}
