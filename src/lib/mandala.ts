export type PatternType = 'traditional' | 'lotus' | 'rangoli';

export type StrokeDashType = 'solid' | 'dashed' | 'dotted' | 'dashdot';

export interface MandalaSettings {
  patternType: PatternType;
  segments: number;
  rings: number;
  radius: number;
  lineWeight: number;
  symmetry: boolean;
  petalCurvature: number;
  detailDensity: number;
  ornamentComplexity: number;
  rotationOffset: number;
  segmentOffset: boolean;
  spacingMultiplier: number;
  centerScale: number;
  strokeColor: string;
  backgroundColor: string;
  strokeOpacity: number;
  strokeDash: StrokeDashType;
  seed: number;
}

import {
  polarToCartesian as utilPolarToCartesian,
  GOLDEN_RATIO,
  createStarPolygon,
  lotusPetalCount
} from './mathUtils';
import type { Point } from './mathUtils';

export class MandalaGenerator {
  private settings: MandalaSettings;

  constructor(settings: MandalaSettings) {
    this.settings = settings;
  }

  private getStrokeDashArray(): string {
    switch (this.settings.strokeDash) {
      case 'dashed':
        return `${this.settings.lineWeight * 4},${this.settings.lineWeight * 2}`;
      case 'dotted':
        return `${this.settings.lineWeight},${this.settings.lineWeight}`;
      case 'dashdot':
        return `${this.settings.lineWeight * 4},${this.settings.lineWeight},${this.settings.lineWeight},${this.settings.lineWeight}`;
      default:
        return 'none';
    }
  }

  private polarToCartesian(centerX: number, centerY: number, radius: number, angle: number): Point {
    return utilPolarToCartesian(centerX, centerY, radius, angle);
  }

  private generateLotusPetal(centerX: number, centerY: number, radius: number, angle: number, size: number): string {
    const adjustedAngle = angle + this.settings.rotationOffset;
    const goldenBase = radius / GOLDEN_RATIO;
    const basePoint = this.polarToCartesian(centerX, centerY, goldenBase, adjustedAngle);
    const tipPoint = this.polarToCartesian(centerX, centerY, radius, adjustedAngle);

    const curveFactor = this.settings.petalCurvature * size;
    const controlRadius = goldenBase + (radius - goldenBase) * 0.7;
    const leftControl = this.polarToCartesian(centerX, centerY, controlRadius, adjustedAngle - curveFactor);
    const rightControl = this.polarToCartesian(centerX, centerY, controlRadius, adjustedAngle + curveFactor);

    const leftMid = this.polarToCartesian(centerX, centerY, controlRadius * 0.85, adjustedAngle - curveFactor * 0.5);
    const rightMid = this.polarToCartesian(centerX, centerY, controlRadius * 0.85, adjustedAngle + curveFactor * 0.5);

    return `M ${basePoint.x},${basePoint.y} C ${leftMid.x},${leftMid.y} ${leftControl.x},${leftControl.y} ${tipPoint.x},${tipPoint.y} C ${rightControl.x},${rightControl.y} ${rightMid.x},${rightMid.y} ${basePoint.x},${basePoint.y} Z`;
  }

  private generateRangoliShape(centerX: number, centerY: number, radius: number, angle: number, points: number): string {
    let path = '';
    const angleStep = 360 / points;
    const adjustedAngle = angle + this.settings.rotationOffset;
    const innerRatio = 0.5 + (this.settings.ornamentComplexity * 0.3);

    for (let i = 0; i <= points; i++) {
      const currentAngle = adjustedAngle + (i * angleStep);
      const r = i % 2 === 0 ? radius : radius * innerRatio;
      const p = this.polarToCartesian(centerX, centerY, r, currentAngle);

      if (i === 0) {
        path += `M ${p.x},${p.y}`;
      } else {
        path += ` L ${p.x},${p.y}`;
      }
    }

    if (this.settings.detailDensity > 0.6) {
      for (let i = 0; i < points; i++) {
        const midAngle = adjustedAngle + (i * angleStep) + (angleStep / 2);
        const midP = this.polarToCartesian(centerX, centerY, radius * 0.85, midAngle);
        path += ` M ${midP.x},${midP.y} m -${this.settings.lineWeight * 1.5},0 a ${this.settings.lineWeight * 1.5},${this.settings.lineWeight * 1.5} 0 1,0 ${this.settings.lineWeight * 3},0 a ${this.settings.lineWeight * 1.5},${this.settings.lineWeight * 1.5} 0 1,0 -${this.settings.lineWeight * 3},0`;
      }
    }

    return path;
  }

  private generateRingFillerDots(centerX: number, centerY: number, radius: number, count: number): string[] {
    if (count <= 0 || radius <= 0) return [];
    const dots: string[] = [];
    const dotRadius = this.settings.lineWeight * (0.6 + this.settings.detailDensity * 0.5);

    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count + this.settings.rotationOffset;
      const p = this.polarToCartesian(centerX, centerY, radius, angle);
      dots.push(
        `M ${p.x},${p.y} m -${dotRadius},0 a ${dotRadius},${dotRadius} 0 1,0 ${dotRadius * 2},0 a ${dotRadius},${dotRadius} 0 1,0 -${
          dotRadius * 2
        },0`
      );
    }

    return dots;
  }

  private renderCenterpiece(centerX: number, centerY: number): string[] {
    const paths: string[] = [];
    const innerRadius = Math.max(18, this.settings.radius * 0.18);

    const petals = Math.min(10, Math.max(4, Math.floor(lotusPetalCount(1) / 2)));
    for (let i = 0; i < petals; i++) {
      const angle = (i * 360) / petals;
      paths.push(this.generateLotusPetal(centerX, centerY, innerRadius, angle, 6));
    }

    const starPoints = Math.max(4, Math.floor(this.settings.segments / 2));
    const starOuter = innerRadius * (0.9 + this.settings.ornamentComplexity * 0.1);
    const starInner = starOuter * (0.55 + this.settings.detailDensity * 0.15);
    paths.push(
      createStarPolygon(
        centerX,
        centerY,
        starOuter,
        starInner,
        starPoints,
        this.settings.rotationOffset
      )
    );

    const binduRadius = this.settings.lineWeight * (1.2 + this.settings.detailDensity * 1.1);
    paths.push(
      `M ${centerX},${centerY} m -${binduRadius},0 a ${binduRadius},${binduRadius} 0 1,0 ${binduRadius * 2},0 a ${binduRadius},${binduRadius} 0 1,0 -${
        binduRadius * 2
      },0`
    );

    return paths;
  }

  private generateRibbonSegment(
    centerX: number,
    centerY: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ): string[] {
    const adjustedStart = startAngle + this.settings.rotationOffset;
    const adjustedEnd = endAngle + this.settings.rotationOffset;
    const midAngle = (adjustedStart + adjustedEnd) / 2;
    const innerRadius = outerRadius * (0.72 + this.settings.detailDensity * 0.18);
    const accentRadius = (outerRadius + innerRadius) / 2;

    const outerStart = this.polarToCartesian(centerX, centerY, outerRadius, adjustedStart);
    const outerEnd = this.polarToCartesian(centerX, centerY, outerRadius, adjustedEnd);
    const outerMid = this.polarToCartesian(
      centerX,
      centerY,
      outerRadius * (1.02 + this.settings.ornamentComplexity * 0.05),
      midAngle
    );

    const innerEnd = this.polarToCartesian(centerX, centerY, innerRadius, adjustedEnd);
    const innerStart = this.polarToCartesian(centerX, centerY, innerRadius, adjustedStart);
    const innerMid = this.polarToCartesian(
      centerX,
      centerY,
      innerRadius * (0.98 - this.settings.ornamentComplexity * 0.05),
      midAngle
    );

    const ribbonPath = `M ${outerStart.x},${outerStart.y} Q ${outerMid.x},${outerMid.y} ${outerEnd.x},${outerEnd.y} L ${innerEnd.x},${innerEnd.y} Q ${innerMid.x},${innerMid.y} ${innerStart.x},${innerStart.y} Z`;
    const paths: string[] = [ribbonPath];

    if (this.settings.detailDensity > 0.35) {
      const beadCenter = this.polarToCartesian(centerX, centerY, accentRadius, midAngle);
      const beadRadius = this.settings.lineWeight * (0.8 + this.settings.detailDensity * 0.6);
      paths.push(
        `M ${beadCenter.x},${beadCenter.y} m -${beadRadius},0 a ${beadRadius},${beadRadius} 0 1,0 ${beadRadius * 2},0 a ${beadRadius},${beadRadius} 0 1,0 -${beadRadius * 2},0`
      );
    }

    return paths;
  }

  generate(width: number, height: number): string {
    const centerX = width / 2;
    const centerY = height / 2;
    const paths: string[] = [];

    const angleStep = 360 / this.settings.segments;
    const ringStep = (this.settings.radius / this.settings.rings) * this.settings.spacingMultiplier;

    for (let ring = 1; ring <= this.settings.rings; ring++) {
      const baseRadius = ringStep * ring;
      const scaleAdjustment = ring === 1 ? this.settings.centerScale : 1;
      const ringRadius = baseRadius * scaleAdjustment;
      const ringAngleOffset = this.settings.segmentOffset && ring % 2 === 0 ? angleStep / 2 : 0;

      switch (this.settings.patternType) {
        case 'lotus':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;
            const petalSize = 15 + this.settings.ornamentComplexity * 10;
            paths.push(this.generateLotusPetal(centerX, centerY, ringRadius, angle, petalSize));

            if (this.settings.detailDensity > 0.5 && ring % 2 === 0) {
              const innerPetal = this.generateLotusPetal(
                centerX,
                centerY,
                ringRadius * 0.85,
                angle + angleStep / 2,
                petalSize * 0.7
              );
              paths.push(innerPetal);
            }
          }

          if (this.settings.detailDensity > 0.45) {
            const sacredPetals = Math.min(lotusPetalCount(Math.min(ring, 6)), 28);
            const starPoints = Math.max(4, Math.floor(sacredPetals / 2));
            const starOuter = ringRadius * 0.82;
            const starInner = starOuter * (0.55 + this.settings.ornamentComplexity * 0.25);
            paths.push(
              createStarPolygon(
                centerX,
                centerY,
                starOuter,
                starInner,
                starPoints,
                this.settings.rotationOffset + ringAngleOffset
              )
            );
          }
          break;
        case 'rangoli':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;
            const points = 5 + Math.floor(this.settings.ornamentComplexity * 3);
            paths.push(this.generateRangoliShape(centerX, centerY, ringRadius, angle, points));
          }
          break;
        case 'traditional':
        default:
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;

            if (ring % 3 === 0) {
              paths.push(this.generateLotusPetal(centerX, centerY, ringRadius, angle, 12));
            } else if (ring % 3 === 1) {
              const rangoliPath = this.generateRangoliShape(centerX, centerY, ringRadius, angle, 6);
              paths.push(rangoliPath);
            } else {
              const startAngle = segment * angleStep + ringAngleOffset;
              const endAngle = (segment + 1) * angleStep + ringAngleOffset;
              const ribbonPaths = this.generateRibbonSegment(centerX, centerY, ringRadius, startAngle, endAngle);
              paths.push(...ribbonPaths);

              if (this.settings.detailDensity > 0.55) {
                const flourishAngle = (startAngle + endAngle) / 2;
                const flourishRadius = ringRadius * (0.65 + this.settings.ornamentComplexity * 0.1);
                const flourishStart = this.polarToCartesian(
                  centerX,
                  centerY,
                  flourishRadius,
                  flourishAngle + this.settings.rotationOffset
                );
                const flourishEnd = this.polarToCartesian(
                  centerX,
                  centerY,
                  flourishRadius + this.settings.lineWeight * (1.2 + this.settings.detailDensity * 0.8),
                  flourishAngle + this.settings.rotationOffset
                );
                paths.push(`M ${flourishStart.x},${flourishStart.y} L ${flourishEnd.x},${flourishEnd.y}`);
              }
            }
          }

          if (ring % 3 === 1 && this.settings.detailDensity > 0.45) {
            const starPoints = Math.max(5, Math.floor(this.settings.segments / 2));
            const starOuter = ringRadius * (0.9 - 0.05 * Math.min(ring, 4));
            const starInner = starOuter * (0.6 + this.settings.ornamentComplexity * 0.25);
            paths.push(
              createStarPolygon(
                centerX,
                centerY,
                starOuter,
                starInner,
                starPoints,
                this.settings.rotationOffset + ringAngleOffset
              )
            );
          }
          break;
      }

      if (ring > 1 && this.settings.ornamentComplexity > 0.5) {
        const fillerCount = Math.floor(
          this.settings.segments * (0.6 + this.settings.ornamentComplexity * 0.7)
        );
        const fillerRadius = ringRadius - ringStep * (0.35 + this.settings.detailDensity * 0.15);
        paths.push(...this.generateRingFillerDots(centerX, centerY, fillerRadius, fillerCount));
      }
    }

    paths.push(...this.renderCenterpiece(centerX, centerY));

    return this.buildSVG(width, height, paths);
  }

  private buildSVG(width: number, height: number, paths: string[]): string {
    const strokeDashArray = this.getStrokeDashArray();
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    if (this.settings.strokeOpacity < 0.95 || this.settings.detailDensity > 0.8) {
      svg += `<defs>`;
      svg += `<filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">`;
      svg += `<feGaussianBlur in="SourceGraphic" stdDeviation="${this.settings.lineWeight * 0.3}" />`;
      svg += `</filter>`;
      svg += `<filter id="subtleBlur" x="-20%" y="-20%" width="140%" height="140%">`;
      svg += `<feGaussianBlur in="SourceGraphic" stdDeviation="${this.settings.lineWeight * 0.1}" />`;
      svg += `</filter>`;
      svg += `</defs>`;
    }

    svg += `<rect width="100%" height="100%" fill="${this.settings.backgroundColor}" />`;

    const useGlow = this.settings.strokeOpacity < 0.95;
    const filterAttr = useGlow ? ' filter="url(#softGlow)"' : '';

    paths.forEach((path, index) => {
      const dashAttr = strokeDashArray !== 'none' ? ` stroke-dasharray="${strokeDashArray}"` : '';
      const variableWidth = this.settings.lineWeight * (1 + (Math.sin(this.settings.seed + index) * 0.1));
      const strokeWidth = this.settings.patternType === 'traditional' ? variableWidth : this.settings.lineWeight;

      svg += `<path d="${path}" stroke="${this.settings.strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${this.settings.strokeOpacity}"${dashAttr}${filterAttr} />`;
    });

    svg += '</svg>';
    return svg;
  }
}
