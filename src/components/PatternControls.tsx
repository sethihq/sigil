import { Zap, Download, Clipboard, Flower2, Sparkles, Palette, RotateCw, BookmarkCheck } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { MandalaSettings, PatternType, StrokeDashType } from '../lib/mandala';
import { useToast } from '../hooks/use-toast';
import { Input } from './ui/input';
import { PatternPreset } from '../lib/presets';

interface PatternControlsProps {
  settings: MandalaSettings;
  onSettingsChange: (settings: Partial<MandalaSettings>) => void;
  onExport: (format: 'svg' | 'png') => void;
  onRandomize: () => void;
  onCopyToFigma: () => void;
  presets: PatternPreset[];
  onLoadPreset: (settings: MandalaSettings) => void;
}

const PATTERN_TYPES: { value: PatternType; label: string; description: string }[] = [
  { value: 'traditional', label: 'Traditional Mandala', description: 'Mixed Indian motifs' },
  { value: 'lotus', label: 'Lotus Petals', description: 'Sacred flower patterns' },
  { value: 'paisley', label: 'Paisley Boteh', description: 'Persian teardrop' },
  { value: 'rangoli', label: 'Rangoli Kolam', description: 'Floor art patterns' },
  { value: 'mehndi', label: 'Mehndi Henna', description: 'Henna-style designs' },
  { value: 'geometric', label: 'Geometric Temple', description: 'Structural patterns' },
  { value: 'yantra', label: 'Sri Yantra', description: 'Sacred geometry' },
  { value: 'kolam', label: 'Tamil Kolam', description: 'Dot-grid patterns' },
  { value: 'peacock', label: 'Peacock Majesty', description: 'Feather & eye motifs' },
  { value: 'temple', label: 'Temple Tower', description: 'Gopuram architecture' },
];

const STROKE_DASH_TYPES: { value: StrokeDashType; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'dashdot', label: 'Dash-Dot' },
];

const COLOR_PRESETS = [
  { name: 'Classic White', stroke: '#ffffff', bg: '#0a0a0a' },
  { name: 'Temple Gold', stroke: '#fbbf24', bg: '#1a0f00' },
  { name: 'Kumkum Red', stroke: '#dc2626', bg: '#1a0505' },
  { name: 'Peacock Teal', stroke: '#14b8a6', bg: '#051a1a' },
  { name: 'Saffron Orange', stroke: '#f97316', bg: '#1a0f05' },
  { name: 'Royal Purple', stroke: '#a855f7', bg: '#0f051a' },
  { name: 'Sandalwood', stroke: '#d4a574', bg: '#1a1510' },
  { name: 'Turmeric Yellow', stroke: '#facc15', bg: '#1a1a05' },
  { name: 'Emerald Green', stroke: '#10b981', bg: '#051a0a' },
  { name: 'Lotus Pink', stroke: '#f472b6', bg: '#1a051a' },
  { name: 'Sky Blue', stroke: '#3b82f6', bg: '#05101a' },
  { name: 'Silver Moon', stroke: '#e5e7eb', bg: '#0a0a0f' },
];

export function PatternControls({ settings, onSettingsChange, onExport, onRandomize, onCopyToFigma, presets, onLoadPreset }: PatternControlsProps) {
  const { toast } = useToast();

  const handleCopyWithToast = () => {
    onCopyToFigma();
    toast({
      title: "Copied to clipboard!",
      description: "Paste SVG code directly into Figma (Ctrl+V or Cmd+V)",
    });
  };

  const showPetalControls = settings.patternType === 'lotus' || settings.patternType === 'traditional';
  const showDetailControls = settings.patternType === 'mehndi' || settings.patternType === 'traditional';
  const showOrnamentControls = settings.patternType !== 'geometric';

  return (
    <div className="w-80 bg-[#2a2a2a] border-r border-[#3a3a3a] h-screen overflow-y-auto p-4 space-y-4">
      <div className="mb-6">
        <h1 className="text-xl font-mono text-white mb-1 tracking-tight">MANDALA</h1>
        <p className="text-xs text-neutral-500 font-mono">PATTERN BUILDER</p>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white border border-[#4a4a4a] font-mono text-xs"
          onClick={onRandomize}
        >
          <Zap className="w-4 h-4 mr-2" />
          RANDOMIZE (G)
        </Button>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs"
          onClick={handleCopyWithToast}
        >
          <Clipboard className="w-4 h-4 mr-2" />
          COPY TO FIGMA (C)
        </Button>
      </div>

      <Separator className="bg-[#3a3a3a]" />

      <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <BookmarkCheck className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-mono text-neutral-300 uppercase">Quick Presets</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {presets.slice(0, 6).map((preset) => (
            <button
              key={preset.name}
              onClick={() => onLoadPreset(preset.settings as MandalaSettings)}
              className="p-2 rounded border bg-[#2a2a2a] border-[#3a3a3a] text-neutral-300 hover:bg-[#3a3a3a] hover:border-white/30 transition-all text-left"
              title={preset.description}
            >
              <div className="text-xs font-mono font-semibold">{preset.name}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{preset.description}</div>
            </button>
          ))}
        </div>
      </Card>

      <Separator className="bg-[#3a3a3a]" />

      <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Flower2 className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-mono text-neutral-300 uppercase">Pattern Type</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {PATTERN_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onSettingsChange({ patternType: type.value })}
              className={`p-2 rounded border text-left transition-all ${
                settings.patternType === type.value
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-[#2a2a2a] border-[#3a3a3a] text-neutral-400 hover:bg-[#3a3a3a]'
              }`}
            >
              <div className="text-xs font-mono font-semibold">{type.label}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{type.description}</div>
            </button>
          ))}
        </div>
      </Card>

      <Separator className="bg-[#3a3a3a]" />

      <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-mono text-neutral-300 uppercase">Basic Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">SEGMENTS: {settings.segments}</Label>
            <Slider
              value={[settings.segments]}
              onValueChange={([v]) => onSettingsChange({ segments: v })}
              min={4}
              max={24}
              step={1}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">RINGS: {settings.rings}</Label>
            <Slider
              value={[settings.rings]}
              onValueChange={([v]) => onSettingsChange({ rings: v })}
              min={2}
              max={10}
              step={1}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">RADIUS: {settings.radius}</Label>
            <Slider
              value={[settings.radius]}
              onValueChange={([v]) => onSettingsChange({ radius: v })}
              min={100}
              max={600}
              step={10}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">LINE WEIGHT: {settings.lineWeight}</Label>
            <Slider
              value={[settings.lineWeight]}
              onValueChange={([v]) => onSettingsChange({ lineWeight: v })}
              min={1}
              max={10}
              step={0.5}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <RotateCw className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-mono text-neutral-300 uppercase">Geometric Controls</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">
              ROTATION: {settings.rotationOffset}°
            </Label>
            <Slider
              value={[settings.rotationOffset]}
              onValueChange={([v]) => onSettingsChange({ rotationOffset: v })}
              min={0}
              max={360}
              step={15}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">
              SPACING: {settings.spacingMultiplier.toFixed(2)}
            </Label>
            <Slider
              value={[settings.spacingMultiplier]}
              onValueChange={([v]) => onSettingsChange({ spacingMultiplier: v })}
              min={0.5}
              max={1.5}
              step={0.05}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">
              CENTER SCALE: {settings.centerScale.toFixed(2)}
            </Label>
            <Slider
              value={[settings.centerScale]}
              onValueChange={([v]) => onSettingsChange({ centerScale: v })}
              min={0.5}
              max={1.5}
              step={0.05}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs text-neutral-400 font-mono">ALTERNATE RINGS</Label>
            <Switch
              checked={settings.segmentOffset}
              onCheckedChange={(v) => onSettingsChange({ segmentOffset: v })}
            />
          </div>
        </div>
      </Card>

      {(showPetalControls || showDetailControls || showOrnamentControls) && (
        <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-mono text-neutral-300 uppercase">Pattern Details</h3>
          </div>

          <div className="space-y-4">
            {showPetalControls && (
              <div>
                <Label className="text-xs text-neutral-400 font-mono mb-2 block">
                  PETAL CURVATURE: {settings.petalCurvature.toFixed(2)}
                </Label>
                <Slider
                  value={[settings.petalCurvature]}
                  onValueChange={([v]) => onSettingsChange({ petalCurvature: v })}
                  min={0.1}
                  max={1}
                  step={0.05}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
                />
              </div>
            )}

            {showDetailControls && (
              <div>
                <Label className="text-xs text-neutral-400 font-mono mb-2 block">
                  DETAIL DENSITY: {settings.detailDensity.toFixed(2)}
                </Label>
                <Slider
                  value={[settings.detailDensity]}
                  onValueChange={([v]) => onSettingsChange({ detailDensity: v })}
                  min={0}
                  max={1}
                  step={0.05}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
                />
              </div>
            )}

            {showOrnamentControls && (
              <div>
                <Label className="text-xs text-neutral-400 font-mono mb-2 block">
                  ORNAMENT COMPLEXITY: {settings.ornamentComplexity.toFixed(2)}
                </Label>
                <Slider
                  value={[settings.ornamentComplexity]}
                  onValueChange={([v]) => onSettingsChange({ ornamentComplexity: v })}
                  min={0}
                  max={1}
                  step={0.05}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="bg-[#333333] border-[#3a3a3a] p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-mono text-neutral-300 uppercase">Colors & Style</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onSettingsChange({ strokeColor: preset.stroke, backgroundColor: preset.bg })}
                className="relative h-10 rounded border border-[#3a3a3a] overflow-hidden hover:border-white/30 transition-all"
                title={preset.name}
              >
                <div className="absolute inset-0" style={{ backgroundColor: preset.bg }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: preset.stroke }} />
                </div>
              </button>
            ))}
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">STROKE COLOR</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.strokeColor}
                onChange={(e) => onSettingsChange({ strokeColor: e.target.value })}
                className="h-10 w-16 p-1 bg-[#2a2a2a] border-[#3a3a3a]"
              />
              <Input
                type="text"
                value={settings.strokeColor}
                onChange={(e) => onSettingsChange({ strokeColor: e.target.value })}
                className="flex-1 h-10 bg-[#2a2a2a] border-[#3a3a3a] text-neutral-300 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">BACKGROUND COLOR</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="h-10 w-16 p-1 bg-[#2a2a2a] border-[#3a3a3a]"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="flex-1 h-10 bg-[#2a2a2a] border-[#3a3a3a] text-neutral-300 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">
              STROKE OPACITY: {settings.strokeOpacity.toFixed(2)}
            </Label>
            <Slider
              value={[settings.strokeOpacity]}
              onValueChange={([v]) => onSettingsChange({ strokeOpacity: v })}
              min={0.1}
              max={1}
              step={0.05}
              className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-0"
            />
          </div>

          <div>
            <Label className="text-xs text-neutral-400 font-mono mb-2 block">STROKE STYLE</Label>
            <div className="grid grid-cols-2 gap-2">
              {STROKE_DASH_TYPES.map((dash) => (
                <button
                  key={dash.value}
                  onClick={() => onSettingsChange({ strokeDash: dash.value })}
                  className={`p-2 rounded border text-xs font-mono transition-all ${
                    settings.strokeDash === dash.value
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-[#2a2a2a] border-[#3a3a3a] text-neutral-400 hover:bg-[#3a3a3a]'
                  }`}
                >
                  {dash.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Separator className="bg-[#3a3a3a]" />

      <div className="space-y-2">
        <Button
          className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white border border-[#4a4a4a] font-mono text-xs"
          onClick={() => onExport('svg')}
        >
          <Download className="w-4 h-4 mr-2" />
          DOWNLOAD SVG
        </Button>
        <Button
          className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white border border-[#4a4a4a] font-mono text-xs"
          onClick={() => onExport('png')}
        >
          <Download className="w-4 h-4 mr-2" />
          DOWNLOAD PNG
        </Button>
      </div>
    </div>
  );
}
