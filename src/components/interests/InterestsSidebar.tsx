import { useNavigate } from "react-router-dom";
import InterestBadge from "./InterestBadge";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface InterestsSidebarProps {
  selectedInterest: string | null;
  onSelectInterest: (id: string | null) => void;
  interests: Interest[];
}

const InterestsSidebar = ({ selectedInterest, onSelectInterest, interests }: InterestsSidebarProps) => {
  const navigate = useNavigate();

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 glass-card rounded-2xl p-5 animate-fade-in">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-accent rounded-full" />
          الاهتمامات
        </h2>
        
        <div className="space-y-2">
          {/* All Button */}
          <button
            onClick={() => onSelectInterest(null)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300",
              selectedInterest === null
                ? "bg-primary text-primary-foreground shadow-soft"
                : "hover:bg-secondary/50 text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Icons.Sparkles className="w-5 h-5" />
              <span className="font-medium">الكل</span>
            </div>
          </button>

          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => onSelectInterest(interest.id)}
              onDoubleClick={() => navigate(`/interest/${interest.id}`)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                selectedInterest === interest.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "hover:bg-secondary/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                {getIconComponent(interest.icon)}
                <span className="font-medium">{interest.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default InterestsSidebar;
