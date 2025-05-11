import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface EqualizerProps extends HTMLAttributes<HTMLDivElement> {}

const Equalizer = ({ className, ...props }: EqualizerProps) => {
  return (
    <div className={cn("flex items-end space-x-1", className)} {...props}>
      <div className="w-1 bg-[#1DB954] rounded-t eq-bar-1" style={{ height: "10px" }}></div>
      <div className="w-1 bg-[#1DB954] rounded-t eq-bar-2" style={{ height: "16px" }}></div>
      <div className="w-1 bg-[#1DB954] rounded-t eq-bar-3" style={{ height: "8px" }}></div>
    </div>
  );
};

export default Equalizer;
