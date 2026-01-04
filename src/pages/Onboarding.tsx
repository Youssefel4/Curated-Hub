import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const colorMap: Record<string, string> = {
  design: "bg-interest-design/15 text-interest-design border-interest-design/30",
  programming: "bg-interest-programming/15 text-interest-programming border-interest-programming/30",
  education: "bg-interest-education/15 text-interest-education border-interest-education/30",
  business: "bg-interest-business/15 text-interest-business border-interest-business/30",
  health: "bg-interest-health/15 text-interest-health border-interest-health/30",
  art: "bg-interest-art/15 text-interest-art border-interest-art/30",
};

const selectedColorMap: Record<string, string> = {
  design: "bg-interest-design text-white border-interest-design shadow-lg",
  programming: "bg-interest-programming text-white border-interest-programming shadow-lg",
  education: "bg-interest-education text-white border-interest-education shadow-lg",
  business: "bg-interest-business text-white border-interest-business shadow-lg",
  health: "bg-interest-health text-white border-interest-health shadow-lg",
  art: "bg-interest-art text-white border-interest-art shadow-lg",
};

const Onboarding = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchInterests();
  }, [user, navigate]);

  const fetchInterests = async () => {
    const { data, error } = await supabase
      .from("interests")
      .select("*")
      .order("name");
    
    if (error) {
      toast.error("خطأ في تحميل الاهتمامات");
      return;
    }
    setInterests(data || []);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      toast.error("يرجى اختيار اهتمام واحد على الأقل");
      return;
    }

    setLoading(true);
    try {
      const userInterests = selectedInterests.map((interestId) => ({
        user_id: user!.id,
        interest_id: interestId,
      }));

      const { error } = await supabase
        .from("user_interests")
        .insert(userInterests);

      if (error) throw error;

      toast.success("تم حفظ اهتماماتك بنجاح!");
      navigate("/");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-card rounded-2xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              اختر اهتماماتك
            </h1>
            <p className="text-muted-foreground mt-2">
              اختر الاهتمامات التي تريد متابعتها لنعرض لك المحتوى المناسب
            </p>
          </div>

          {/* Interests Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {interests.map((interest, index) => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 animate-fade-in",
                    isSelected
                      ? selectedColorMap[interest.color]
                      : colorMap[interest.color],
                    "hover:scale-105"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div className="text-2xl">
                    {getIconComponent(interest.icon)}
                  </div>
                  <span className="font-medium text-sm">{interest.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Count */}
          <div className="text-center mb-6">
            <span className="text-muted-foreground">
              تم اختيار{" "}
              <span className="font-bold text-accent">{selectedInterests.length}</span>{" "}
              اهتمامات
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            variant="accent-gradient"
            size="lg"
            className="w-full"
            disabled={loading || selectedInterests.length === 0}
          >
            {loading ? "جاري الحفظ..." : "ابدأ الآن"}
          </Button>

          {/* Skip */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            تخطي والمتابعة لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
