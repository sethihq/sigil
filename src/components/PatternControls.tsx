import { useState } from 'react';
import { cn } from '../lib/utils';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { MandalaSettings, PatternType, StrokeDashType } from '../lib/mandala';
import { Input } from './ui/input';
import { PatternPreset } from '../lib/presets';

interface PatternControlsProps {
  settings: MandalaSettings;
  onSettingsChange: (settings: Partial<MandalaSettings>) => void;
  presets: PatternPreset[];
  onLoadPreset: (settings: MandalaSettings) => void;
  className?: string;
}

const PATTERN_TYPES: { value: PatternType; label: string; description: string }[] = [
  { value: 'traditional', label: 'Traditional Mandala', description: 'Layered lotus, rangoli, and ribbon cadence' },
  { value: 'lotus', label: 'Lotus Petals', description: 'Sacred flower arrays with star overlays' },
  { value: 'rangoli', label: 'Rangoli Kolam', description: 'Festival starbursts with bead inlays' },
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
  { name: 'Royal Purple', stroke: '#a855f7', bg: '#0f051a' },
  { name: 'Emerald Green', stroke: '#10b981', bg: '#051a0a' },
];

export function PatternControls({
  settings,
  onSettingsChange,
  className,
}: PatternControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(true);

  const showPetalControls = settings.patternType === 'lotus' || settings.patternType === 'traditional';
  const showDetailControls = settings.patternType === 'traditional';
  const showOrnamentControls = settings.patternType !== 'lotus';

  return (
    <div className={cn('space-y-3', className)}>
      {/* Advanced Mode Toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Advanced Mode</Label>
        <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
      </div>

      {/* Pattern Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Pattern Type</Label>
        <div className="grid grid-cols-1 gap-1.5">
          {PATTERN_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onSettingsChange({ patternType: type.value })}
              className={cn(
                'rounded-none border p-2.5 text-left transition-all',
                settings.patternType === type.value
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              )}
            >
              <div className={cn('text-[10px] font-medium uppercase tracking-wider', settings.patternType === type.value ? 'text-black' : 'text-foreground')}>{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Core Geometry */}
      <div className="space-y-2 border-t border-white/[0.06] pt-3">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Core Geometry</Label>
        <div className="space-y-2">
          <ControlSlider
            label="Segments"
            value={settings.segments}
            onChange={(v) => onSettingsChange({ segments: v })}
            min={4}
            max={24}
            step={1}
          />
          <ControlSlider
            label="Rings"
            value={settings.rings}
            onChange={(v) => onSettingsChange({ rings: v })}
            min={2}
            max={10}
            step={1}
          />
          <ControlSlider
            label="Radius"
            value={settings.radius}
            onChange={(v) => onSettingsChange({ radius: v })}
            min={100}
            max={600}
            step={10}
          />
          <ControlSlider
            label="Line Weight"
            value={settings.lineWeight}
            onChange={(v) => onSettingsChange({ lineWeight: v })}
            min={1}
            max={10}
            step={0.5}
          />
        </div>
      </div>

      {showAdvanced && (
        <div className="space-y-2 border-t border-white/[0.06] pt-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Geometry</Label>
          <div className="space-y-2">
            <ControlSlider
              label="Rotation"
              value={settings.rotationOffset}
              onChange={(v) => onSettingsChange({ rotationOffset: v })}
              min={0}
              max={360}
              step={15}
              unit="°"
            />
            <ControlSlider
              label="Spacing"
              value={settings.spacingMultiplier}
              onChange={(v) => onSettingsChange({ spacingMultiplier: v })}
              min={0.5}
              max={1.5}
              step={0.05}
              format={(val) => val.toFixed(2)}
            />
            <ControlSlider
              label="Center Scale"
              value={settings.centerScale}
              onChange={(v) => onSettingsChange({ centerScale: v })}
              min={0.5}
              max={1.5}
              step={0.05}
              format={(val) => val.toFixed(2)}
            />
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
              <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Alternate Rings</Label>
              <Switch checked={settings.segmentOffset} onCheckedChange={(v) => onSettingsChange({ segmentOffset: v })} />
            </div>
          </div>
        </div>
      )}

      {showAdvanced && (showPetalControls || showDetailControls || showOrnamentControls) && (
        <div className="space-y-2 border-t border-white/[0.06] pt-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Pattern Details</Label>
          <div className="space-y-2">
            {showPetalControls && (
              <ControlSlider
                label="Petal Curvature"
                value={settings.petalCurvature}
                onChange={(v) => onSettingsChange({ petalCurvature: v })}
                min={0.1}
                max={1}
                step={0.05}
                format={(val) => val.toFixed(2)}
              />
            )}
            {showDetailControls && (
              <ControlSlider
                label="Detail Density"
                value={settings.detailDensity}
                onChange={(v) => onSettingsChange({ detailDensity: v })}
                min={0}
                max={1}
                step={0.05}
                format={(val) => val.toFixed(2)}
              />
            )}
            {showOrnamentControls && (
              <ControlSlider
                label="Ornament Complexity"
                value={settings.ornamentComplexity}
                onChange={(v) => onSettingsChange({ ornamentComplexity: v })}
                min={0}
                max={1}
                step={0.05}
                format={(val) => val.toFixed(2)}
              />
            )}
          </div>
        </div>
      )}

      {/* Colors */}
      <div className="space-y-2 border-t border-white/[0.06] pt-3">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Color</Label>
        
        {/* Color Presets */}
        <div className="grid grid-cols-6 gap-1.5">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onSettingsChange({ strokeColor: preset.stroke, backgroundColor: preset.bg })}
              className="group relative h-9 rounded-none border border-white/10 transition-all hover:border-white/20"
              title={preset.name}
            >
              <div className="absolute inset-0 rounded-none" style={{ backgroundColor: preset.bg }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-3 rounded-none border-2" style={{ borderColor: preset.stroke }} />
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings.strokeColor}
              onChange={(e) => onSettingsChange({ strokeColor: e.target.value })}
              className="h-8 w-12 cursor-pointer border border-white/10 bg-black p-1 transition-all hover:border-white/20"
            />
            <Input
              type="text"
              value={settings.strokeColor}
              onChange={(e) => onSettingsChange({ strokeColor: e.target.value })}
              className="h-8 flex-1 border border-white/10 bg-black px-2.5 font-mono text-[10px] text-foreground transition-all focus:border-white/30"
            />
          </div>
        </div>

        <ControlSlider
          label="Stroke Opacity"
          value={settings.strokeOpacity}
          onChange={(v) => onSettingsChange({ strokeOpacity: v })}
          min={0.1}
          max={1}
          step={0.05}
          format={(val) => val.toFixed(2)}
        />

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Stroke Style</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {STROKE_DASH_TYPES.map((dash) => (
              <button
                key={dash.value}
                onClick={() => onSettingsChange({ strokeDash: dash.value })}
                className={cn(
                  'rounded-none border px-2 py-1.5 text-[9px] font-medium uppercase tracking-wider transition-all',
                  settings.strokeDash === dash.value
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                )}
              >
                {dash.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (value: number) => string;
}

function ControlSlider({ label, value, onChange, min, max, step, unit, format }: ControlSliderProps) {
  const display = format ? format(value) : value;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</Label>
        <span className="text-xs text-foreground">
          {display}
          {unit}
        </span>
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
