import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface InterestBadgeProps {
  interest: Interest;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<string, string> = {
  design: "bg-interest-design/15 text-interest-design border-interest-design/30 hover:bg-interest-design/25",
  programming: "bg-interest-programming/15 text-interest-programming border-interest-programming/30 hover:bg-interest-programming/25",
  education: "bg-interest-education/15 text-interest-education border-interest-education/30 hover:bg-interest-education/25",
  business: "bg-interest-business/15 text-interest-business border-interest-business/30 hover:bg-interest-business/25",
  health: "bg-interest-health/15 text-interest-health border-interest-health/30 hover:bg-interest-health/25",
  art: "bg-interest-art/15 text-interest-art border-interest-art/30 hover:bg-interest-art/25",
};

const selectedColorMap: Record<string, string> = {
  design: "bg-interest-design text-white border-interest-design shadow-soft",
  programming: "bg-interest-programming text-white border-interest-programming shadow-soft",
  education: "bg-interest-education text-white border-interest-education shadow-soft",
  business: "bg-interest-business text-white border-interest-business shadow-soft",
  health: "bg-interest-health text-white border-interest-health shadow-soft",
  art: "bg-interest-art text-white border-interest-art shadow-soft",
};

const sizeMap = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

const InterestBadge = ({ interest, isSelected, onClick, size = "md" }: InterestBadgeProps) => {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border font-medium transition-all duration-300 flex items-center gap-1.5",
        sizeMap[size],
        isSelected ? selectedColorMap[interest.color] : colorMap[interest.color],
        onClick && "cursor-pointer hover:scale-105"
      )}
    >
      {getIconComponent(interest.icon)}
      <span>{interest.name}</span>
    </button>
  );
};

export default InterestBadge;
