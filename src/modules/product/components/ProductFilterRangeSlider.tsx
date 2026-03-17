import { cn } from "../../../utils/utils";

interface TProductFilterRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
  formatValue?: (v: number) => string;
  label?: string;
}

export function ProductFilterRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  formatValue = (v) => String(v),
  label,
}: TProductFilterRangeSliderProps) {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-500">
            {formatValue(valueMin)} – {formatValue(valueMax)}
          </span>
        </div>
      )}
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200" />
        {/* Active range */}
        <div className="absolute h-1.5 rounded-full bg-blue-500" style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }} />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(Math.min(v, valueMax - step), valueMax);
          }}
          className={cn("absolute inset-0 w-full h-full opacity-0 cursor-pointer", "range-thumb-visible")}
          style={{ zIndex: valueMin > max - step ? 5 : 3 }}
          aria-label={`${label ?? "Range"} minimum`}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(valueMin, Math.max(v, valueMin + step));
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
          aria-label={`${label ?? "Range"} maximum`}
        />
        {/* Visual thumbs */}
        <div
          className="absolute h-4 w-4 rounded-full bg-white border-2 border-blue-500 shadow-sm pointer-events-none"
          style={{ left: `calc(${pctMin}% - 8px)` }}
        />
        <div
          className="absolute h-4 w-4 rounded-full bg-white border-2 border-blue-500 shadow-sm pointer-events-none"
          style={{ left: `calc(${pctMax}% - 8px)` }}
        />
      </div>
    </div>
  );
}
