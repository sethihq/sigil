export type PatternType = 'traditional' | 'paisley' | 'rangoli' | 'mehndi' | 'lotus' | 'peacock';

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
  Point,
  polarToCartesian as utilPolarToCartesian,
  GOLDEN_RATIO
} from './mathUtils';
import {
  generatePeacockMotif
} from './motifs';

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

  private generatePaisleyMotif(centerX: number, centerY: number, radius: number, angle: number): string {
    const adjustedAngle = angle + this.settings.rotationOffset;
    const base = this.polarToCartesian(centerX, centerY, radius * 0.5, adjustedAngle + 10);
    const tip = this.polarToCartesian(centerX, centerY, radius, adjustedAngle - 25);
    const curl = this.polarToCartesian(centerX, centerY, radius * 0.75, adjustedAngle - 55);
    const midCurl = this.polarToCartesian(centerX, centerY, radius * 0.85, adjustedAngle - 40);
    const bottom = this.polarToCartesian(centerX, centerY, radius * 0.65, adjustedAngle + 25);
    const bottomCurve = this.polarToCartesian(centerX, centerY, radius * 0.55, adjustedAngle + 5);

    let path = `M ${base.x},${base.y} C ${base.x + 5},${base.y - 10} ${tip.x - 5},${tip.y + 5} ${tip.x},${tip.y}`;
    path += ` Q ${midCurl.x},${midCurl.y} ${curl.x},${curl.y}`;
    path += ` Q ${bottom.x},${bottom.y} ${bottomCurve.x},${bottomCurve.y}`;
    path += ` Q ${base.x - 3},${base.y + 3} ${base.x},${base.y} Z`;

    if (this.settings.detailDensity > 0.5) {
      const innerCurl = this.polarToCartesian(centerX, centerY, radius * 0.6, adjustedAngle - 35);
      path += ` M ${innerCurl.x},${innerCurl.y} Q ${innerCurl.x + 3},${innerCurl.y - 5} ${innerCurl.x},${innerCurl.y - 8}`;
    }

    return path;
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

  private generateMehndiBorder(centerX: number, centerY: number, radius: number): string[] {
    const paths: string[] = [];
    const dotCount = Math.floor(this.settings.segments * this.settings.detailDensity);

    for (let i = 0; i < dotCount; i++) {
      const angle = (i * 360) / dotCount + this.settings.rotationOffset;
      const p = this.polarToCartesian(centerX, centerY, radius, angle);
      paths.push(`M ${p.x},${p.y} m -${this.settings.lineWeight},0 a ${this.settings.lineWeight},${this.settings.lineWeight} 0 1,0 ${this.settings.lineWeight * 2},0 a ${this.settings.lineWeight},${this.settings.lineWeight} 0 1,0 -${this.settings.lineWeight * 2},0`);
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
            const petalSize = 15 + (this.settings.ornamentComplexity * 10);
            paths.push(this.generateLotusPetal(centerX, centerY, ringRadius, angle, petalSize));

            if (this.settings.detailDensity > 0.5 && ring % 2 === 0) {
              const innerPetal = this.generateLotusPetal(centerX, centerY, ringRadius * 0.85, angle + angleStep / 2, petalSize * 0.7);
              paths.push(innerPetal);
            }
          }
          break;

        case 'paisley':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;
            paths.push(this.generatePaisleyMotif(centerX, centerY, ringRadius, angle));
          }
          break;

        case 'rangoli':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;
            const points = 5 + Math.floor(this.settings.ornamentComplexity * 3);
            paths.push(this.generateRangoliShape(centerX, centerY, ringRadius, angle, points));
          }
          break;

        case 'mehndi':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const startAngle = segment * angleStep + ringAngleOffset;
            const endAngle = (segment + 1) * angleStep + ringAngleOffset;
            const midAngle = (startAngle + endAngle) / 2 + this.settings.rotationOffset;

            const p1 = this.polarToCartesian(centerX, centerY, ringRadius, startAngle + this.settings.rotationOffset);
            const p2 = this.polarToCartesian(centerX, centerY, ringRadius, endAngle + this.settings.rotationOffset);
            const p3 = this.polarToCartesian(centerX, centerY, ringRadius * 0.85, midAngle);

            paths.push(`M ${p1.x},${p1.y} Q ${p3.x},${p3.y} ${p2.x},${p2.y}`);
          }

          if (this.settings.detailDensity > 0.3) {
            paths.push(...this.generateMehndiBorder(centerX, centerY, ringRadius));
          }
          break;

        case 'peacock':
          for (let segment = 0; segment < this.settings.segments; segment++) {
            const angle = segment * angleStep + ringAngleOffset;
            const peacockPaths = generatePeacockMotif(centerX, centerY, ringRadius, angle, this.settings.ornamentComplexity);
            paths.push(...peacockPaths);
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
              const startAngle = segment * angleStep + ringAngleOffset + this.settings.rotationOffset;
              const endAngle = (segment + 1) * angleStep + ringAngleOffset + this.settings.rotationOffset;
              const p1 = this.polarToCartesian(centerX, centerY, ringRadius, startAngle);
              const p2 = this.polarToCartesian(centerX, centerY, ringRadius, endAngle);
              paths.push(`M ${p1.x},${p1.y} L ${p2.x},${p2.y}`);
            }
          }
          break;
      }

      if (ring > 1 && this.settings.ornamentComplexity > 0.5) {
        const decorativeDots = Math.floor(this.settings.segments * this.settings.ornamentComplexity);
        for (let i = 0; i < decorativeDots; i++) {
          const angle = (i * 360) / decorativeDots + this.settings.rotationOffset;
          const p = this.polarToCartesian(centerX, centerY, ringRadius - ringStep * 0.5, angle);
          paths.push(`M ${p.x},${p.y} m -1,0 a 1,1 0 1,0 2,0 a 1,1 0 1,0 -2,0`);
        }
      }
    }

    if (this.settings.detailDensity > 0.7) {
      const centerDot = `M ${centerX},${centerY} m -${this.settings.lineWeight * 3},0 a ${this.settings.lineWeight * 3},${this.settings.lineWeight * 3} 0 1,0 ${this.settings.lineWeight * 6},0 a ${this.settings.lineWeight * 3},${this.settings.lineWeight * 3} 0 1,0 -${this.settings.lineWeight * 6},0`;
      paths.push(centerDot);
    }

    return this.buildSVG(width, height, paths);
  }

  private buildSVG(width: number, height: number, paths: string[]): string {
    const strokeDashArray = this.getStrokeDashArray();
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

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
      const strokeWidth = this.settings.patternType === 'mehndi' ? variableWidth : this.settings.lineWeight;

      svg += `<path d="${path}" stroke="${this.settings.strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${this.settings.strokeOpacity}"${dashAttr}${filterAttr} />`;
    });

    svg += '</svg>';
    return svg;
  }
}
