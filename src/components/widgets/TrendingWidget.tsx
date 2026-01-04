import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface TrendingInterest extends Interest {
  postsCount: number;
}

interface ActiveUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface TrendingWidgetProps {
  interests: Interest[];
}

const TrendingWidget = ({ interests }: TrendingWidgetProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trendingInterests, setTrendingInterests] = useState<TrendingInterest[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, [interests]);

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      // Fetch post counts per interest
      const { data: posts } = await supabase
        .from("posts")
        .select("interest_id");

      // Count posts per interest
      const interestCounts = new Map<string, number>();
      (posts || []).forEach(post => {
        const count = interestCounts.get(post.interest_id) || 0;
        interestCounts.set(post.interest_id, count + 1);
      });

      // Combine with interest data and sort
      const trending = interests
        .map(interest => ({
          ...interest,
          postsCount: interestCounts.get(interest.id) || 0,
        }))
        .filter(i => i.postsCount > 0)
        .sort((a, b) => b.postsCount - a.postsCount)
        .slice(0, 4);

      setTrendingInterests(trending);

      // Fetch active users (users who posted in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentPosts } = await supabase
        .from("posts")
        .select("user_id")
        .gte("created_at", sevenDaysAgo.toISOString());

      // Get unique user IDs
      const uniqueUserIds = [...new Set((recentPosts || []).map(p => p.user_id))];

      // Fetch user profiles
      const { data: users } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", uniqueUserIds.slice(0, 5));

      setActiveUsers(
        (users || []).map(u => ({
          id: u.user_id,
          username: u.username,
          avatar_url: u.avatar_url,
        }))
      );

      // Get total active users count
      setTotalUsers(Math.max(0, uniqueUserIds.length - 5));
    } catch (error) {
      console.error("Error fetching trending data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const handleStartNow = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Trending */}
        <div className="glass-card rounded-2xl p-5 animate-fade-in">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            الاهتمامات الرائجة
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : trendingInterests.length > 0 ? (
            <div className="space-y-3">
              {trendingInterests.map((interest, index) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/interest/${interest.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {getIconComponent(interest.icon)}
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {interest.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {interest.postsCount} {interest.postsCount === 1 ? "منشور" : "منشورات"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              لا توجد اهتمامات رائجة بعد
            </p>
          )}
        </div>

        {/* Active Users */}
        <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            مستخدمون نشطون
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : activeUsers.length > 0 ? (
            <div className="flex -space-x-3 space-x-reverse">
              {activeUsers.map((user) => (
                <img
                  key={user.id}
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-card hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                  title={user.username}
                  onClick={() => navigate("/profile")}
                />
              ))}
              {totalUsers > 0 && (
                <div className="w-10 h-10 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-sm font-medium text-muted-foreground">
                  +{totalUsers}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              لا يوجد مستخدمون نشطون حالياً
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-accent/20 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="font-bold text-foreground mb-2">🚀 شارك اهتماماتك</h3>
          <p className="text-sm text-muted-foreground mb-4">
            انضم إلى مجتمع من المهتمين وشارك أفكارك مع من يهتمون بنفس الأشياء.
          </p>
          <button
            onClick={handleStartNow}
            className="w-full btn-accent-gradient py-2 rounded-xl font-medium text-sm hover:scale-105 transition-transform"
          >
            {user ? "اختر اهتماماتك" : "ابدأ الآن"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TrendingWidget;

