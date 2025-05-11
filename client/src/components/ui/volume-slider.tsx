import { cn } from "@/lib/utils";

interface VolumeSliderProps {
  className?: string;
  value: number;
  onChange: (value: number) => void;
}

const VolumeSlider = ({
  className,
  value,
  onChange,
}: VolumeSliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={cn("w-24 relative", className)}>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="player-volume w-full h-1 bg-[#282828] rounded-lg appearance-none cursor-pointer z-20 relative"
      />
      <div
        className="absolute top-0 left-0 h-1 bg-white rounded-lg z-10"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default VolumeSlider;
