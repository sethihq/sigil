import { cn } from '../lib/utils';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';

export interface AsciiSettings {
  columns: number;
  contrast: number;
  brightness: number;
  invert: boolean;
  charset: string;
}

interface AsciiControlsProps {
  settings: AsciiSettings;
  onSettingsChange: (settings: Partial<AsciiSettings>) => void;
  onGenerate: () => void;
  onCopy: () => void;
  onCopyText: () => void;
  isGenerating: boolean;
  hasOutput: boolean;
  className?: string;
}

export function AsciiControls({
  settings,
  onSettingsChange,
  className,
}: AsciiControlsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Output Settings</Label>
        <div className="space-y-2">
          <AsciiSlider
            label="Width"
            value={settings.columns}
            onChange={(value) => onSettingsChange({ columns: value })}
            min={40}
            max={200}
            step={4}
            unit=" cols"
          />
          <AsciiSlider
            label="Contrast"
            value={settings.contrast}
            onChange={(value) => onSettingsChange({ contrast: value })}
            min={0.5}
            max={2}
            step={0.05}
            format={(value) => `${value.toFixed(2)}x`}
          />
          <AsciiSlider
            label="Brightness"
            value={settings.brightness}
            onChange={(value) => onSettingsChange({ brightness: value })}
            min={-0.5}
            max={0.5}
            step={0.02}
            format={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`}
          />
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
            <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Invert</Label>
            <Switch checked={settings.invert} onCheckedChange={(value) => onSettingsChange({ invert: value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Character Set</Label>
            <Input
              type="text"
              value={settings.charset}
              onChange={(event) => onSettingsChange({ charset: event.target.value || '@%#*+=-:. ' })}
              maxLength={32}
              className="h-8 border border-white/10 bg-black px-2.5 font-mono text-[10px] text-foreground transition-all focus:border-white/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AsciiSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (value: number) => string;
}

function AsciiSlider({ label, value, onChange, min, max, step, unit, format }: AsciiSliderProps) {
  const display = format ? format(value) : `${value}${unit || ''}`;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</Label>
        <span className="text-xs text-foreground">{display}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
