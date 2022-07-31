export type Vector = {
  x: number,
  y: number,
};

export function translate(vec1: Vector, vec2: Vector): Vector {
  const newVector: Vector = {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y,
  };

  return newVector;
}

export function distance(vec1: Vector, vec2: Vector): number {
  return Math.sqrt(Math.pow(vec2.x - vec1.x, 2) + Math.pow(vec2.y - vec1.y, 2));
}
