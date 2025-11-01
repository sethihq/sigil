import { useState, useEffect, useCallback, useRef } from 'react';
import { PatternControls } from './components/PatternControls';
import { PatternCanvas } from './components/PatternCanvas';
import { MandalaGenerator, MandalaSettings } from './lib/mandala';
import { Toaster } from './components/ui/toaster';
import { PATTERN_PRESETS } from './lib/presets';
import { AsciiControls, AsciiSettings } from './components/AsciiControls';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';

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

const ASCII_FONT_FAMILY = "'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace";

// Component to display ASCII output with auto-scaling to fit container
function AsciiOutputDisplay({ output, isGenerating }: { output: string; isGenerating: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLPreElement | null>(null);

  const updateScale = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;
    
    const container = containerRef.current;
    const content = contentRef.current;
    
    // Reset scale to get natural dimensions
    content.style.transform = 'scale(1)';
    content.style.transformOrigin = 'center center';
    
    // Small delay to ensure dimensions are calculated correctly
    requestAnimationFrame(() => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      
      if (contentWidth === 0 || contentHeight === 0) return;
      
      // Calculate scale to fit both width and height
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
      
      content.style.transform = `scale(${scale})`;
      content.style.transformOrigin = 'center center';
    });
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [output, updateScale]);

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-white/60 text-sm">Generating ASCII...</span>
      </div>
    );
  }

  if (!output) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-white/60 text-sm">Click Generate to create ASCII output</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      <pre 
        ref={contentRef}
        className="font-mono text-xs leading-tight text-white/80 whitespace-pre"
        style={{ display: 'inline-block' }}
      >
        {output}
      </pre>
    </div>
  );
}

function App() {
  const [settings, setSettings] = useState<MandalaSettings>(DEFAULT_SETTINGS);
  const [svgContent, setSvgContent] = useState('');
  const [activePhase, setActivePhase] = useState<'pattern' | 'ascii'>('pattern');
  const [asciiSettings, setAsciiSettings] = useState<AsciiSettings>({
    columns: 80,
    contrast: 1,
    brightness: 0,
    invert: false,
    charset: '@%#*+=-:. '
  });
  const [asciiOutput, setAsciiOutput] = useState('');
  const [isAsciiGenerating, setIsAsciiGenerating] = useState(false);

  const generatePattern = useCallback((currentSettings: MandalaSettings) => {
    const generator = new MandalaGenerator(currentSettings);
    const svg = generator.generate(800, 800);
    setSvgContent(svg);
  }, []);

  useEffect(() => {
    generatePattern(settings);
  }, [settings, generatePattern]);

  const handleCopyToFigma = useCallback(() => {
    const optimizedSvg = svgContent
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    navigator.clipboard.writeText(optimizedSvg).then(() => {
      console.log('SVG copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }, [svgContent]);

  const handleSettingsChange = useCallback((partial: Partial<MandalaSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const handleRandomize = useCallback(() => {
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
  }, []);

  const handleExport = useCallback((format: 'svg' | 'png') => {
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
  }, [svgContent]);

  const handleAsciiSettingsChange = useCallback((partial: Partial<AsciiSettings>) => {
    setAsciiSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

  const handleGenerateAscii = useCallback(() => {
    if (!svgContent) {
      setAsciiOutput('');
      return;
    }

    const baseCharset = (asciiSettings.charset && asciiSettings.charset.trim().length > 0)
      ? asciiSettings.charset
      : '@%#*+=-:. ';

    if (baseCharset.length === 0) {
      setAsciiOutput('');
      return;
    }

    setIsAsciiGenerating(true);

    const pool = asciiSettings.invert ? baseCharset.split('').reverse().join('') : baseCharset;
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const aspect = img.height / img.width || 1;
      const width = Math.max(16, asciiSettings.columns);
      const charAspect = 0.5;
      const height = Math.max(8, Math.round(width * aspect * charAspect));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        setAsciiOutput('');
        setIsAsciiGenerating(false);
        URL.revokeObjectURL(url);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const rows: string[] = [];

      for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = imageData[idx];
          const g = imageData[idx + 1];
          const b = imageData[idx + 2];
          const alpha = imageData[idx + 3] / 255;

          if (alpha < 0.1) {
            row += ' ';
            continue;
          }

          let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          let adjusted = (luminance - 0.5) * asciiSettings.contrast + 0.5 + asciiSettings.brightness;
          adjusted = clamp01(adjusted);

          const charIndex = Math.round((1 - adjusted) * (pool.length - 1));
          row += pool[charIndex] ?? pool[pool.length - 1];
        }
        rows.push(row);
      }

      setAsciiOutput(rows.join('\n'));
      setIsAsciiGenerating(false);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setAsciiOutput('');
      setIsAsciiGenerating(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [asciiSettings, svgContent]);

  useEffect(() => {
    if (activePhase === 'ascii') {
      handleGenerateAscii();
    }
  }, [activePhase, handleGenerateAscii]);

  const handleAsciiCopy = useCallback(async () => {
    if (!asciiOutput) return;

    try {
      const rows = asciiOutput.split('\n').filter((row, index, arr) => !(row === '' && index === arr.length - 1));
      
      // Create high-res canvas to render ASCII
      const scale = 2; // Lower scale for better performance
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const fontSize = 12 * scale;
      const lineHeight = 15 * scale;
      ctx.font = `${fontSize}px ${ASCII_FONT_FAMILY}`;
      
      const maxWidth = Math.max(...rows.map(row => ctx.measureText(row).width));
      const padding = 32 * scale;
      
      canvas.width = maxWidth + padding * 2;
      canvas.height = rows.length * lineHeight + padding * 2;
      
      // Draw with high quality
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ${ASCII_FONT_FAMILY}`;
      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'top';
      
      rows.forEach((row, index) => {
        ctx.fillText(row, padding, padding + index * lineHeight);
      });
      
      // Get pixel data and create optimized rectangles
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      const threshold = 50;
      
      // Create a binary map of bright pixels
      const bright: boolean[][] = [];
      for (let y = 0; y < height; y++) {
        bright[y] = [];
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          bright[y][x] = brightness > threshold;
        }
      }
      
      // Merge adjacent pixels into larger rectangles (scanline algorithm)
      const rects: Array<{x: number, y: number, w: number, h: number}> = [];
      const visited: boolean[][] = Array.from({length: height}, () => Array(width).fill(false));
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (bright[y][x] && !visited[y][x]) {
            // Find horizontal span
            let w = 0;
            while (x + w < width && bright[y][x + w] && !visited[y][x + w]) {
              w++;
            }
            
            // Extend vertically if possible
            let h = 1;
            let canExtend = true;
            while (canExtend && y + h < height) {
              for (let dx = 0; dx < w; dx++) {
                if (!bright[y + h][x + dx] || visited[y + h][x + dx]) {
                  canExtend = false;
                  break;
                }
              }
              if (canExtend) h++;
            }
            
            // Mark as visited
            for (let dy = 0; dy < h; dy++) {
              for (let dx = 0; dx < w; dx++) {
                visited[y + dy][x + dx] = true;
              }
            }
            
            rects.push({x: x / scale, y: y / scale, w: w / scale, h: h / scale});
          }
        }
      }
      
      // Convert rectangles to a single compound path
      const pathData = rects.map(r => 
        `M${r.x},${r.y} h${r.w} v${r.h} h${-r.w} z`
      ).join(' ');
      
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width / scale}" height="${canvas.height / scale}" viewBox="0 0 ${canvas.width / scale} ${canvas.height / scale}">
  <path d="${pathData}" fill="#ffffff" fill-rule="nonzero"/>
</svg>`;
      
      await navigator.clipboard.writeText(svg);
      
    } catch (error) {
      console.error('Failed to copy ASCII as vector', error);
    }
  }, [asciiOutput]);

  const handleAsciiCopyText = useCallback(async () => {
    if (!asciiOutput) return;
    try {
      await navigator.clipboard.writeText(asciiOutput);
    } catch (error) {
      console.error('Failed to copy ASCII text', error);
    }
  }, [asciiOutput]);

  // Keyboard shortcuts - must be after all handler functions are defined
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        handleRandomize();
        if (activePhase === 'ascii') {
          // Also regenerate ASCII when in ASCII mode
          setTimeout(() => handleGenerateAscii(), 100);
        }
      }
      if (e.key === 'c' || e.key === 'C') {
        if (activePhase === 'pattern') {
          handleCopyToFigma();
        } else {
          handleAsciiCopy();
        }
      }
      if (e.key === 'e' || e.key === 'E') {
        if (activePhase === 'pattern') {
          handleExport('svg');
        } else {
          handleAsciiCopyText();
        }
      }
      if (e.key === 'p' || e.key === 'P') {
        if (activePhase === 'pattern') {
          handleExport('png');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activePhase, handleCopyToFigma, handleRandomize, handleGenerateAscii, handleAsciiCopy, handleAsciiCopyText, handleExport]);

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center p-2 sm:p-4 md:p-8 lg:p-12 xl:p-16">
        <div className="flex h-full w-full flex-col lg:flex-row overflow-hidden border-2 sm:border-4 lg:border-[6px] border-white/20 shadow-2xl shadow-black/50">
          {/* Left Side - Canvas Area */}
          <main className="flex w-full lg:w-auto flex-col overflow-hidden bg-black flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-start border-b border-white/[0.06] px-3 sm:px-5 py-2 sm:py-3 min-h-[60px] sm:min-h-[72px]">
              <Tabs
                value={activePhase}
                onValueChange={(phase) => setActivePhase(phase as 'pattern' | 'ascii')}
              >
                <TabsList className="h-8 sm:h-9 border border-white/10 bg-transparent p-1">
                  <TabsTrigger
                    value="pattern"
                    className="h-6 sm:h-7 bg-transparent px-4 sm:px-6 text-[10px] sm:text-xs font-medium uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    Pattern
                  </TabsTrigger>
                  <TabsTrigger
                    value="ascii"
                    className="h-6 sm:h-7 bg-transparent px-4 sm:px-6 text-[10px] sm:text-xs font-medium uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    ASCII
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Canvas - Responsive Size */}
            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
              {activePhase === 'pattern' ? (
                <div 
                  className="w-full h-full max-w-[600px] max-h-[600px] border overflow-hidden flex items-center justify-center p-8"
                  style={{ 
                    backgroundColor: settings.backgroundColor,
                    borderColor: settings.strokeColor + '15' // 15 is hex for ~8% opacity
                  }}
                >
                  <PatternCanvas svgContent={svgContent} className="h-full w-full" />
                </div>
              ) : (
                <div className="w-full h-full max-w-[600px] max-h-[600px] border border-white/[0.06] bg-card overflow-hidden flex items-center justify-center p-8">
                  <AsciiOutputDisplay 
                    output={asciiOutput}
                    isGenerating={isAsciiGenerating}
                  />
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Settings Panel */}
          <aside className="flex w-full lg:max-w-[340px] flex-col border-t lg:border-t-0 lg:border-l border-white/[0.06] bg-card max-h-[40vh] lg:max-h-none">
            {/* Header */}
            <a
              href="https://x.com/sethihq"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block border-b border-white/[0.06] px-3 sm:px-5 py-4 sm:py-6 min-h-[80px] sm:min-h-[100px] bg-contain bg-left bg-no-repeat transition-opacity hover:opacity-90"
              style={{ backgroundImage: 'url(/banner.png)' }}
            >
              <span className="absolute bottom-2 right-3 sm:bottom-3 sm:right-5 text-[10px] sm:text-xs uppercase tracking-wider text-white/90 font-medium">
                BY SETHIHQ
              </span>
            </a>

            {/* Action Buttons */}
            <div className="space-y-1.5 border-b border-white/[0.06] px-3 sm:px-5 py-2 sm:py-3">
              {activePhase === 'pattern' ? (
                <>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={handleRandomize}
                  >
                    <span>Randomize</span>
                    <span className="text-white/40 hidden sm:inline">(R)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={handleCopyToFigma}
                  >
                    <span>Copy SVG</span>
                    <span className="text-white/40 hidden sm:inline">(C)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={() => handleExport('svg')}
                  >
                    <span>Export SVG</span>
                    <span className="text-white/40 hidden sm:inline">(E)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={() => handleExport('png')}
                  >
                    <span>Export PNG</span>
                    <span className="text-white/40 hidden sm:inline">(P)</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5 disabled:opacity-50"
                    onClick={handleGenerateAscii}
                    disabled={isAsciiGenerating}
                  >
                    <span>{isAsciiGenerating ? 'Generating...' : 'Generate'}</span>
                    <span className="text-white/40 hidden sm:inline">(R)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5 disabled:opacity-50"
                    onClick={handleAsciiCopy}
                    disabled={!asciiOutput}
                  >
                    <span>Copy ASCII</span>
                    <span className="text-white/40 hidden sm:inline">(C)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 w-full justify-between border border-white/10 bg-transparent px-3 sm:px-4 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5 disabled:opacity-50"
                    onClick={handleAsciiCopyText}
                    disabled={!asciiOutput}
                  >
                    <span>Copy TXT</span>
                    <span className="text-white/40 hidden sm:inline">(E)</span>
                  </Button>
                </>
              )}
            </div>

            {/* Controls */}
            <ScrollArea className="flex-1">
              <div className="px-3 sm:px-5 py-2 sm:py-3">
                {activePhase === 'pattern' ? (
                  <PatternControls
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    presets={PATTERN_PRESETS}
                    onLoadPreset={(preset) => setSettings({ ...preset, seed: Math.random() * 10000 })}
                  />
                ) : (
                  <AsciiControls
                    settings={asciiSettings}
                    onSettingsChange={handleAsciiSettingsChange}
                    onGenerate={handleGenerateAscii}
                    onCopy={handleAsciiCopy}
                    onCopyText={handleAsciiCopyText}
                    isGenerating={isAsciiGenerating}
                    hasOutput={asciiOutput.length > 0}
                  />
                )}
              </div>
            </ScrollArea>
          </aside>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
