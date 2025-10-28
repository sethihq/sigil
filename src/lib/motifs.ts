import { polarToCartesian } from './mathUtils';

export function generatePeacockMotif(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  complexity: number = 0.5
): string[] {
  const paths: string[] = [];
  const base = polarToCartesian(centerX, centerY, radius * 0.3, angle);
  const head = polarToCartesian(centerX, centerY, radius * 0.5, angle);

  paths.push(`M ${base.x},${base.y} L ${head.x},${head.y}`);

  const featherCount = Math.floor(5 + complexity * 10);
  const spreadAngle = 60;

  for (let i = 0; i < featherCount; i++) {
    const featherAngle = angle - spreadAngle / 2 + (i * spreadAngle) / (featherCount - 1);
    const featherTip = polarToCartesian(centerX, centerY, radius, featherAngle);
    const featherBase = polarToCartesian(centerX, centerY, radius * 0.4, featherAngle);

    paths.push(`M ${featherBase.x},${featherBase.y} Q ${head.x},${head.y} ${featherTip.x},${featherTip.y}`);

    if (complexity > 0.5) {
      const eyeRadius = radius * 0.05;
      const eyeCenter = polarToCartesian(centerX, centerY, radius * 0.9, featherAngle);
      paths.push(`M ${eyeCenter.x},${eyeCenter.y} m -${eyeRadius},0 a ${eyeRadius},${eyeRadius} 0 1,0 ${eyeRadius * 2},0 a ${eyeRadius},${eyeRadius} 0 1,0 -${eyeRadius * 2},0`);
    }
  }

  return paths;
}

export function generateMangoLeaf(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  curvature: number = 0.5
): string {
  const tip = polarToCartesian(centerX, centerY, radius, angle);
  const base = polarToCartesian(centerX, centerY, radius * 0.3, angle);

  const leftControl = polarToCartesian(centerX, centerY, radius * 0.7, angle - 20 * curvature);
  const rightControl = polarToCartesian(centerX, centerY, radius * 0.7, angle + 20 * curvature);

  return `M ${base.x},${base.y} C ${leftControl.x},${leftControl.y} ${leftControl.x},${leftControl.y} ${tip.x},${tip.y} C ${rightControl.x},${rightControl.y} ${rightControl.x},${rightControl.y} ${base.x},${base.y} Z`;
}

export function generateCypressTree(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  height: number = 1
): string[] {
  const paths: string[] = [];
  const base = polarToCartesian(centerX, centerY, radius * 0.5, angle);
  const tip = polarToCartesian(centerX, centerY, radius * (0.5 + height * 0.5), angle);

  const left1 = polarToCartesian(centerX, centerY, radius * 0.6, angle - 10);
  const left2 = polarToCartesian(centerX, centerY, radius * 0.7, angle - 8);
  const left3 = polarToCartesian(centerX, centerY, radius * 0.8, angle - 5);

  const right1 = polarToCartesian(centerX, centerY, radius * 0.6, angle + 10);
  const right2 = polarToCartesian(centerX, centerY, radius * 0.7, angle + 8);
  const right3 = polarToCartesian(centerX, centerY, radius * 0.8, angle + 5);

  paths.push(`M ${base.x},${base.y} L ${left1.x},${left1.y} L ${left2.x},${left2.y} L ${left3.x},${left3.y} L ${tip.x},${tip.y} L ${right3.x},${right3.y} L ${right2.x},${right2.y} L ${right1.x},${right1.y} Z`);

  return paths;
}

export function generateSwastika(
  centerX: number,
  centerY: number,
  size: number,
  _clockwise: boolean = true
): string[] {
  const paths: string[] = [];
  const armWidth = size * 0.25;

  for (let i = 0; i < 4; i++) {
    paths.push(`M ${centerX - armWidth / 2},${centerY - armWidth / 2} L ${centerX + armWidth / 2},${centerY - armWidth / 2} L ${centerX + armWidth / 2},${centerY + armWidth / 2} L ${centerX - armWidth / 2},${centerY + armWidth / 2} Z`);
  }

  return paths;
}

export function generateKalash(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): string[] {
  const paths: string[] = [];
  const base = polarToCartesian(centerX, centerY, radius * 0.3, angle);

  const leftBelly = polarToCartesian(centerX, centerY, radius * 0.6, angle - 15);
  const rightBelly = polarToCartesian(centerX, centerY, radius * 0.6, angle + 15);
  const leftNeck = polarToCartesian(centerX, centerY, radius * 0.8, angle - 8);
  const rightNeck = polarToCartesian(centerX, centerY, radius * 0.8, angle + 8);
  const leftRim = polarToCartesian(centerX, centerY, radius, angle - 12);
  const rightRim = polarToCartesian(centerX, centerY, radius, angle + 12);

  paths.push(`M ${base.x},${base.y} Q ${leftBelly.x},${leftBelly.y} ${leftNeck.x},${leftNeck.y} L ${leftRim.x},${leftRim.y} L ${rightRim.x},${rightRim.y} L ${rightNeck.x},${rightNeck.y} Q ${rightBelly.x},${rightBelly.y} ${base.x},${base.y} Z`);

  for (let i = 0; i < 5; i++) {
    const leafAngle = angle - 20 + i * 10;
    const leafTip = polarToCartesian(centerX, centerY, radius * 1.2, leafAngle);
    const leafBase = polarToCartesian(centerX, centerY, radius * 0.95, leafAngle);
    paths.push(`M ${leafBase.x},${leafBase.y} L ${leafTip.x},${leafTip.y}`);
  }

  return paths;
}

export function generateDiya(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): string[] {
  const paths: string[] = [];
  const base = polarToCartesian(centerX, centerY, radius * 0.5, angle);

  const leftEdge = polarToCartesian(centerX, centerY, radius * 0.7, angle - 25);
  const rightEdge = polarToCartesian(centerX, centerY, radius * 0.7, angle + 25);
  const leftTip = polarToCartesian(centerX, centerY, radius, angle - 30);
  const rightTip = polarToCartesian(centerX, centerY, radius, angle + 30);

  paths.push(`M ${leftTip.x},${leftTip.y} Q ${leftEdge.x},${leftEdge.y} ${base.x},${base.y} Q ${rightEdge.x},${rightEdge.y} ${rightTip.x},${rightTip.y}`);

  const flameBase = polarToCartesian(centerX, centerY, radius * 0.6, angle);
  const flameTip = polarToCartesian(centerX, centerY, radius * 1.3, angle);
  const flameLeft = polarToCartesian(centerX, centerY, radius * 0.95, angle - 8);
  const flameRight = polarToCartesian(centerX, centerY, radius * 0.95, angle + 8);

  paths.push(`M ${flameBase.x},${flameBase.y} Q ${flameLeft.x},${flameLeft.y} ${flameTip.x},${flameTip.y} Q ${flameRight.x},${flameRight.y} ${flameBase.x},${flameBase.y} Z`);

  return paths;
}

export function generateOmSymbol(
  centerX: number,
  centerY: number,
  size: number
): string[] {
  const paths: string[] = [];
  const scale = size / 100;

  const top = polarToCartesian(centerX, centerY, 40 * scale, 0);
  const bottom = polarToCartesian(centerX, centerY, 40 * scale, 180);

  const leftCurve = polarToCartesian(centerX, centerY, 50 * scale, 210);
  const rightCurve = polarToCartesian(centerX, centerY, 50 * scale, 330);

  paths.push(`M ${centerX - 30 * scale},${centerY} Q ${leftCurve.x},${leftCurve.y} ${bottom.x},${bottom.y} Q ${centerX},${centerY + 30 * scale} ${centerX + 30 * scale},${centerY} Q ${rightCurve.x},${rightCurve.y} ${top.x},${top.y}`);

  paths.push(`M ${centerX},${centerY - 50 * scale} m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0`);

  return paths;
}

export function generateElephant(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  simplified: boolean = true
): string[] {
  const paths: string[] = [];

  if (simplified) {
    const body = polarToCartesian(centerX, centerY, radius * 0.5, angle);
    const head = polarToCartesian(centerX, centerY, radius * 0.7, angle - 30);
    const trunk = polarToCartesian(centerX, centerY, radius, angle - 45);
    const back = polarToCartesian(centerX, centerY, radius * 0.6, angle + 30);

    paths.push(`M ${back.x},${back.y} Q ${body.x},${body.y} ${head.x},${head.y} Q ${head.x + 5},${head.y + 5} ${trunk.x},${trunk.y}`);

    const ear = polarToCartesian(centerX, centerY, radius * 0.8, angle - 50);
    paths.push(`M ${head.x},${head.y} Q ${ear.x},${ear.y} ${head.x},${head.y + 10}`);
  }

  return paths;
}

export function generateInterlacedTriangles(
  centerX: number,
  centerY: number,
  size: number,
  triangleCount: number = 9
): string[] {
  const paths: string[] = [];

  const upwardTriangles = Math.ceil(triangleCount / 2);
  const downwardTriangles = Math.floor(triangleCount / 2);

  for (let i = 0; i < upwardTriangles; i++) {
    const scale = 1 - (i * 0.15);
    const radius = size * scale;

    const p1 = polarToCartesian(centerX, centerY, radius, 90);
    const p2 = polarToCartesian(centerX, centerY, radius, 210);
    const p3 = polarToCartesian(centerX, centerY, radius, 330);

    paths.push(`M ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z`);
  }

  for (let i = 0; i < downwardTriangles; i++) {
    const scale = 0.9 - (i * 0.15);
    const radius = size * scale;

    const p1 = polarToCartesian(centerX, centerY, radius, 270);
    const p2 = polarToCartesian(centerX, centerY, radius, 30);
    const p3 = polarToCartesian(centerX, centerY, radius, 150);

    paths.push(`M ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z`);
  }

  return paths;
}
