export const GOLDEN_RATIO = 1.618033988749895;
export const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export function fibonacci(n: number): number {
  if (n <= 2) return 1;
  let a = 1, b = 1;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

export function goldenAngle(): number {
  return 360 / (GOLDEN_RATIO * GOLDEN_RATIO);
}

export function goldenRatio(value: number): number {
  return value * GOLDEN_RATIO;
}

export function inverseGoldenRatio(value: number): number {
  return value / GOLDEN_RATIO;
}

export function lotusPetalCount(ring: number): number {
  const sequence = [8, 13, 21, 34, 55, 89];
  return sequence[Math.min(ring - 1, sequence.length - 1)] || 8;
}

export function generateFibonacciSpiral(
  centerX: number,
  centerY: number,
  scale: number,
  rotations: number
): string {
  let path = '';
  let angle = 0;
  const angleStep = goldenAngle();

  for (let i = 0; i < rotations; i++) {
    const radius = fibonacci(i + 1) * scale;
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

    if (i === 0) {
      path = `M ${x},${y}`;
    } else {
      path += ` L ${x},${y}`;
    }

    angle += angleStep;
  }

  return path;
}

export interface Point {
  x: number;
  y: number;
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): Point {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

export function getSymmetryOrder(segments: number): number {
  const divisors = [];
  for (let i = 2; i <= segments; i++) {
    if (segments % i === 0) {
      divisors.push(i);
    }
  }
  return divisors[Math.floor(divisors.length / 2)] || segments;
}

export function createStarPolygon(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  points: number,
  rotation: number = 0
): string {
  let path = '';
  const angleStep = 360 / points;

  for (let i = 0; i <= points * 2; i++) {
    const angle = (i * angleStep / 2) + rotation;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const p = polarToCartesian(centerX, centerY, radius, angle);

    if (i === 0) {
      path = `M ${p.x},${p.y}`;
    } else {
      path += ` L ${p.x},${p.y}`;
    }
  }

  return path + ' Z';
}

export function smoothCurve(points: Point[]): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    path += ` Q ${points[i].x},${points[i].y} ${xc},${yc}`;
  }

  const last = points[points.length - 1];
  path += ` T ${last.x},${last.y}`;

  return path;
}

export function rotatePoint(
  point: Point,
  center: Point,
  angleDegrees: number
): Point {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
  };
}

export function generateVastuGrid(size: number, gridSize: number = 8): number[][] {
  const grid: number[][] = [];
  const cellSize = size / gridSize;

  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = cellSize;
    }
  }

  return grid;
}

export function calculateSacredProportions(baseSize: number): {
  innerCircle: number;
  middleCircle: number;
  outerCircle: number;
} {
  return {
    innerCircle: baseSize / GOLDEN_RATIO / GOLDEN_RATIO,
    middleCircle: baseSize / GOLDEN_RATIO,
    outerCircle: baseSize
  };
}
