import { useState, useEffect, useCallback } from 'react';
import { PatternControls } from './components/PatternControls';
import { PatternCanvas } from './components/PatternCanvas';
import { MandalaGenerator, MandalaSettings } from './lib/mandala';
import { Toaster } from './components/ui/toaster';
import { PATTERN_PRESETS } from './lib/presets';

const DEFAULT_SETTINGS: MandalaSettings = {
  patternType: 'traditional',
  segments: 12,
  rings: 6,
  radius: 300,
  lineWeight: 2,
  symmetry: true,
  petalCurvature: 0.5,
  detailDensity: 0.5,
  ornamentComplexity: 0.5,
  rotationOffset: 0,
  segmentOffset: false,
  spacingMultiplier: 1,
  centerScale: 1,
  strokeColor: '#ffffff',
  backgroundColor: '#0a0a0a',
  strokeOpacity: 1,
  strokeDash: 'solid',
  seed: Math.random() * 10000
};

function App() {
  const [settings, setSettings] = useState<MandalaSettings>(DEFAULT_SETTINGS);
  const [svgContent, setSvgContent] = useState('');

  const generatePattern = useCallback((currentSettings: MandalaSettings) => {
    const generator = new MandalaGenerator(currentSettings);
    const svg = generator.generate(800, 800);
    setSvgContent(svg);
  }, []);

  useEffect(() => {
    generatePattern(settings);
  }, [settings, generatePattern]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') {
        handleRandomize();
      }
      if (e.key === 'c' || e.key === 'C') {
        handleCopyToFigma();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSettingsChange = (partial: Partial<MandalaSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const handleRandomize = () => {
    setSettings(prev => ({
      ...prev,
      seed: Math.random() * 10000,
      segments: 6 + Math.floor(Math.random() * 19),
      rings: 3 + Math.floor(Math.random() * 8),
      petalCurvature: 0.2 + Math.random() * 0.8,
      detailDensity: Math.random(),
      ornamentComplexity: Math.random(),
      rotationOffset: Math.floor(Math.random() * 360),
      segmentOffset: Math.random() > 0.5,
      spacingMultiplier: 0.8 + Math.random() * 0.4,
      centerScale: 0.7 + Math.random() * 0.6
    }));
  };

  const handleCopyToFigma = () => {
    const optimizedSvg = svgContent
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    navigator.clipboard.writeText(optimizedSvg).then(() => {
      console.log('SVG copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleExport = (format: 'svg' | 'png') => {
    if (format === 'svg') {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mandala-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 2400;
      canvas.height = 2400;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `mandala-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        });
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#1a1a1a] overflow-hidden">
        <PatternControls
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onExport={handleExport}
          onRandomize={handleRandomize}
          onCopyToFigma={handleCopyToFigma}
          presets={PATTERN_PRESETS}
          onLoadPreset={(preset) => setSettings({ ...preset, seed: Math.random() * 10000 })}
        />
        <PatternCanvas svgContent={svgContent} />
      </div>
      <Toaster />
    </>
  );
}

export default App;
