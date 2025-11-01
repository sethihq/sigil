import { useState, useEffect, useCallback } from 'react';
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

type AsciiSvgOptions = {
  fontSize?: number;
  lineHeight?: number;
  padding?: number;
  charWidth?: number;
  foreground?: string;
  background?: string;
  viewportPadding?: number;
};

const ASCII_DEFAULTS = {
  fontSize: 14,
  lineHeight: 16,
  padding: 18,
  charWidth: 8,
  foreground: '#e2e8f0',
  background: '#0a0a0a',
  viewportPadding: 24,
} satisfies Required<AsciiSvgOptions>;

const ASCII_FONT_FAMILY = "'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createAsciiSvg(rows: string[], options: AsciiSvgOptions = {}): string {
  if (rows.length === 0) return '';

  const {
    fontSize,
    lineHeight,
    padding,
    charWidth,
    foreground,
    background,
    viewportPadding,
  } = { ...ASCII_DEFAULTS, ...options };

  const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const contentWidth = Math.max(1, maxColumns * charWidth + padding * 2);
  const contentHeight = Math.max(1, rows.length * lineHeight + padding * 2);
  const totalWidth = contentWidth + viewportPadding * 2;
  const totalHeight = contentHeight + viewportPadding * 2;
  const text = rows.map((row) => escapeHtml(row)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <rect width="100%" height="100%" rx="18" ry="18" fill="${background}" />
  <foreignObject x="${viewportPadding}" y="${viewportPadding}" width="${contentWidth}" height="${contentHeight}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${background};display:flex;align-items:flex-start;justify-content:flex-start;">
      <pre style="margin:0;padding:${padding}px;font-family:${ASCII_FONT_FAMILY};font-size:${fontSize}px;line-height:${lineHeight}px;color:${foreground};background:transparent;white-space:pre;">${text}</pre>
    </div>
  </foreignObject>
</svg>`;
}

function App() {
  const [settings, setSettings] = useState<MandalaSettings>(DEFAULT_SETTINGS);
  const [svgContent, setSvgContent] = useState('');
  const [activePhase, setActivePhase] = useState<'pattern' | 'ascii'>('pattern');
  const [asciiSettings, setAsciiSettings] = useState<AsciiSettings>({
    columns: 120,
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

    const rows = asciiOutput ? asciiOutput.split('\n') : [];
    const meaningfulRows = rows.filter((row, index) => !(row === '' && index === rows.length - 1));
    const svg = createAsciiSvg(meaningfulRows, {
      fontSize: 14,
      lineHeight: 16,
      padding: 18,
      charWidth: 8.5,
      foreground: '#e2e8f0',
      background: '#050505',
      viewportPadding: 24,
    });

    if (!svg) return;

    try {
      if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const textBlob = new Blob([asciiOutput], { type: 'text/plain' });
        const clipboardItem = new ClipboardItem({
          'image/svg+xml': svgBlob,
          'text/plain': textBlob,
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(svg);
      }
    } catch (error) {
      console.error('Failed to copy ASCII SVG, falling back to text', error);
      navigator.clipboard.writeText(asciiOutput).catch((fallbackError) => {
        console.error('Failed to copy ASCII fallback', fallbackError);
      });
    }
  }, [asciiOutput]);

  const handleAsciiDownload = useCallback(() => {
    if (!asciiOutput) return;
    const blob = new Blob([asciiOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mandala-ascii-${Date.now()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [asciiOutput]);

  // Keyboard shortcuts - must be after all handler functions are defined
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (activePhase === 'pattern') {
          handleRandomize();
        } else {
          handleGenerateAscii();
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
          handleAsciiDownload();
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
  }, [activePhase, handleCopyToFigma, handleRandomize, handleGenerateAscii, handleAsciiCopy, handleAsciiDownload, handleExport]);

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center p-16">
        <div className="flex h-full w-auto overflow-hidden border-[6px] border-white/20 shadow-2xl shadow-black/50">
          {/* Left Sidebar - Settings Panel */}
          <aside className="flex w-full max-w-[340px] flex-col border-r border-white/[0.06] bg-card">
            {/* Header */}
            <div className="border-b border-white/[0.06] px-5 py-3">
              <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-white">
                SIGIL
              </h1>
              <a
                href="https://x.com/sethihq"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-xs uppercase tracking-wider text-white/40 transition-colors hover:text-white/60"
              >
                BY SETHIHQ
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-1.5 border-b border-white/[0.06] px-5 py-3">
              {activePhase === 'pattern' ? (
                <>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={handleRandomize}
                  >
                    <span>Randomize</span>
                    <span className="text-white/40">(R)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={handleCopyToFigma}
                  >
                    <span>Copy SVG</span>
                    <span className="text-white/40">(C)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={() => handleExport('svg')}
                  >
                    <span>Export SVG</span>
                    <span className="text-white/40">(E)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={() => handleExport('png')}
                  >
                    <span>Export PNG</span>
                    <span className="text-white/40">(P)</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5 disabled:opacity-50"
                    onClick={handleGenerateAscii}
                    disabled={isAsciiGenerating}
                  >
                    <span>{isAsciiGenerating ? 'Generating...' : 'Generate'}</span>
                    <span className="text-white/40">(R)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5 disabled:opacity-50"
                    onClick={handleAsciiCopy}
                    disabled={!asciiOutput}
                  >
                    <span>Copy ASCII</span>
                    <span className="text-white/40">(C)</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 w-full justify-between border border-white/10 bg-transparent px-4 text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:bg-white/5"
                    onClick={handleAsciiDownload}
                  >
                    <span>Export TXT</span>
                    <span className="text-white/40">(E)</span>
                  </Button>
                </>
              )}
            </div>

            {/* Controls */}
            <ScrollArea className="flex-1">
              <div className="px-5 py-3">
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
                    onDownload={handleAsciiDownload}
                    isGenerating={isAsciiGenerating}
                    hasOutput={asciiOutput.length > 0}
                  />
                )}
              </div>
            </ScrollArea>
          </aside>

          {/* Right Side - Canvas Area */}
          <main className="flex w-auto flex-col overflow-hidden bg-black">
            {/* Top Bar */}
            <div className="flex items-center justify-end border-b border-white/[0.06] px-6 py-4">
              <Tabs
                value={activePhase}
                onValueChange={(phase) => setActivePhase(phase as 'pattern' | 'ascii')}
              >
                <TabsList className="h-9 border border-white/10 bg-transparent p-1">
                  <TabsTrigger
                    value="pattern"
                    className="h-7 bg-transparent px-6 text-xs font-medium uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    Pattern
                  </TabsTrigger>
                  <TabsTrigger
                    value="ascii"
                    className="h-7 bg-transparent px-6 text-xs font-medium uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    ASCII
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Canvas - Fixed Size */}
            <div className="flex flex-1 items-center justify-center p-8">
              {activePhase === 'pattern' ? (
                <div className="flex h-[600px] w-[600px] items-center justify-center">
                  <PatternCanvas svgContent={svgContent} className="h-full w-full" />
                </div>
              ) : (
                <ScrollArea className="h-[600px] w-[600px] border border-white/[0.06] bg-card">
                  <div className="p-8">
                    <pre className="font-mono text-xs leading-relaxed text-white/60">
                      {asciiOutput || (isAsciiGenerating ? 'Generating ASCII...' : 'Click Generate to create ASCII output')}
                    </pre>
                  </div>
                </ScrollArea>
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
