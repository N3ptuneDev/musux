import { cn } from "@/lib/utils";

interface ProgressSliderProps {
  className?: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const ProgressSlider = ({
  className,
  value,
  max,
  onChange,
}: ProgressSliderProps) => {
  const progressPercentage = max > 0 ? (value / max) * 100 : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={cn("flex-1 mx-2 relative", className)}>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={handleChange}
        className="player-progress w-full h-1 bg-[#282828] rounded-lg appearance-none cursor-pointer z-20 relative"
      />
      <div
        className="absolute top-0 left-0 h-1 bg-white rounded-lg z-10"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressSlider;
