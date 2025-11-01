import { MandalaSettings } from './mandala';

export interface PatternPreset {
  name: string;
  description: string;
  settings: Omit<MandalaSettings, 'seed'>;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    name: 'Lotus Chakra',
    description: 'Layered petals with sacred star overlays',
    settings: {
      patternType: 'lotus',
      segments: 9,
      rings: 6,
      radius: 320,
      lineWeight: 2.2,
      symmetry: true,
      petalCurvature: 0.65,
      detailDensity: 0.62,
      ornamentComplexity: 0.55,
      rotationOffset: 0,
      segmentOffset: true,
      spacingMultiplier: 1.05,
      centerScale: 1.15,
      strokeColor: '#f5f5f5',
      backgroundColor: '#0c0c0c',
      strokeOpacity: 1,
      strokeDash: 'solid',
    },
  },
  {
    name: 'Navaratri Garland',
    description: 'Traditional ring cadence with bead flourishes',
    settings: {
      patternType: 'traditional',
      segments: 12,
      rings: 7,
      radius: 340,
      lineWeight: 1.6,
      symmetry: true,
      petalCurvature: 0.55,
      detailDensity: 0.7,
      ornamentComplexity: 0.75,
      rotationOffset: 10,
      segmentOffset: true,
      spacingMultiplier: 0.95,
      centerScale: 0.9,
      strokeColor: '#fde68a',
      backgroundColor: '#1b1204',
      strokeOpacity: 1,
      strokeDash: 'solid',
    },
  },
  {
    name: 'Rangoli Carnival',
    description: 'Festival starburst with bead inlays',
    settings: {
      patternType: 'rangoli',
      segments: 10,
      rings: 6,
      radius: 310,
      lineWeight: 2.4,
      symmetry: true,
      petalCurvature: 0.48,
      detailDensity: 0.8,
      ornamentComplexity: 0.78,
      rotationOffset: 18,
      segmentOffset: false,
      spacingMultiplier: 1.12,
      centerScale: 1.25,
      strokeColor: '#f97316',
      backgroundColor: '#1d1208',
      strokeOpacity: 1,
      strokeDash: 'solid',
    },
  },
];
