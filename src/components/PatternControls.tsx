import { Zap, Clipboard, Flower2, Sparkles, Palette, RotateCw, BookmarkCheck } from 'lucide-react';
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
  onRandomize: () => void;
  onCopyToFigma: () => void;
  presets: PatternPreset[];
  onLoadPreset: (settings: MandalaSettings) => void;
}

const PATTERN_TYPES: { value: PatternType; label: string; description: string }[] = [
  { value: 'traditional', label: 'Traditional', description: 'Mixed Indian motifs' },
  { value: 'lotus', label: 'Lotus', description: 'Sacred flower patterns' },
  { value: 'paisley', label: 'Paisley', description: 'Persian teardrop' },
  { value: 'rangoli', label: 'Rangoli', description: 'Floor art patterns' },
  { value: 'mehndi', label: 'Mehndi', description: 'Henna-style designs' },
  { value: 'peacock', label: 'Peacock', description: 'Feather & eye motifs' },
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

export function PatternControls({ settings, onSettingsChange, onRandomize, onCopyToFigma, presets, onLoadPreset }: PatternControlsProps) {
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
  const showOrnamentControls = true;

  return (
    <div className="w-96 bg-[#1a1a1a] border-l border-[#2a2a2a] h-screen overflow-y-auto p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-white mb-1 tracking-tight">Pattern Studio</h1>
        <p className="text-sm text-neutral-400">Create Indian mandala patterns</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          className="bg-white hover:bg-neutral-100 text-black font-medium text-sm h-11 shadow-sm"
          onClick={onRandomize}
        >
          <Zap className="w-4 h-4 mr-2" />
          Randomize
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm h-11"
          onClick={handleCopyWithToast}
        >
          <Clipboard className="w-4 h-4 mr-2" />
          Copy SVG
        </Button>
      </div>

      <Separator className="bg-[#2a2a2a]" />

      <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Quick Presets</h3>
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

      <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Flower2 className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Pattern Type</h3>
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

      <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Basic Settings</h3>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm text-neutral-300 font-medium">Segments</Label>
              <span className="text-sm text-neutral-400 font-mono">{settings.segments}</span>
            </div>
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
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm text-neutral-300 font-medium">Rings</Label>
              <span className="text-sm text-neutral-400 font-mono">{settings.rings}</span>
            </div>
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
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm text-neutral-300 font-medium">Radius</Label>
              <span className="text-sm text-neutral-400 font-mono">{settings.radius}</span>
            </div>
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
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm text-neutral-300 font-medium">Line Weight</Label>
              <span className="text-sm text-neutral-400 font-mono">{settings.lineWeight}</span>
            </div>
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

      <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Geometric Controls</h3>
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
        <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-white">Pattern Details</h3>
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

      <Card className="bg-[#151515] border-[#2a2a2a] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-white">Colors & Style</h3>
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

    </div>
  );
}
