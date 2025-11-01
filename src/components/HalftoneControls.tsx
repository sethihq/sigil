import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

export interface HalftoneSettings {
  dotSize: number;
  spacing: number;
  angle: number;
  shape: 'circle' | 'square' | 'diamond';
  invert: boolean;
  threshold: number;
}

interface HalftoneControlsProps {
  settings: HalftoneSettings;
  onSettingsChange: (settings: Partial<HalftoneSettings>) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isGenerating: boolean;
  hasOutput: boolean;
  className?: string;
}

const SHAPES: { value: HalftoneSettings['shape']; label: string }[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
];

const ANGLES = [
  { value: 0, label: '0°' },
  { value: 15, label: '15°' },
  { value: 45, label: '45°' },
  { value: 90, label: '90°' },
];

export function HalftoneControls({
  settings,
  onSettingsChange,
  className,
}: HalftoneControlsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Dot Shape */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Dot Shape</Label>
        <div className="flex gap-px bg-white/10 p-px">
          {SHAPES.map((shape) => (
            <button
              key={shape.value}
              onClick={() => onSettingsChange({ shape: shape.value })}
              className={cn(
                'flex-1 px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-all',
                settings.shape === shape.value
                  ? 'bg-white text-black'
                  : 'bg-transparent text-foreground hover:bg-white/5'
              )}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dot Size */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Dot Size</Label>
          <span className="text-xs text-white/60">{settings.dotSize}px</span>
        </div>
        <Slider
          value={[settings.dotSize]}
          onValueChange={([value]) => onSettingsChange({ dotSize: value })}
          min={2}
          max={20}
          step={1}
        />
      </div>

      {/* Spacing */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Spacing</Label>
          <span className="text-xs text-white/60">{settings.spacing}px</span>
        </div>
        <Slider
          value={[settings.spacing]}
          onValueChange={([value]) => onSettingsChange({ spacing: value })}
          min={2}
          max={30}
          step={1}
        />
      </div>

      {/* Angle */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Angle</Label>
        <div className="flex gap-px bg-white/10 p-px">
          {ANGLES.map((angle) => (
            <button
              key={angle.value}
              onClick={() => onSettingsChange({ angle: angle.value })}
              className={cn(
                'flex-1 px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-all',
                settings.angle === angle.value
                  ? 'bg-white text-black'
                  : 'bg-transparent text-foreground hover:bg-white/5'
              )}
            >
              {angle.label}
            </button>
          ))}
        </div>
      </div>

      {/* Threshold */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Threshold</Label>
          <span className="text-xs text-white/60">{Math.round(settings.threshold * 100)}%</span>
        </div>
        <Slider
          value={[settings.threshold]}
          onValueChange={([value]) => onSettingsChange({ threshold: value })}
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      {/* Invert */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Invert</Label>
        <Switch
          checked={settings.invert}
          onCheckedChange={(checked) => onSettingsChange({ invert: checked })}
        />
      </div>
    </div>
  );
}

