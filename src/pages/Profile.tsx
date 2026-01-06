import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Camera, Save, ArrowRight, Loader2, Users } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import FollowButton from "@/components/profile/FollowButton";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
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
  design: "bg-interest-design text-white border-interest-design",
  programming: "bg-interest-programming text-white border-interest-programming",
  education: "bg-interest-education text-white border-interest-education",
  business: "bg-interest-business text-white border-interest-business",
  health: "bg-interest-health text-white border-interest-health",
  art: "bg-interest-art text-white border-interest-art",
};

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { uploadImage, uploading: uploadingAvatar } = useImageUpload();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const isOwnProfile = !id || (user && user.id === id);
  const targetUserId = id || user?.id;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    if (targetUserId) {
      fetchData();
      fetchFollowStats();
    }
  }, [user, id, navigate, authLoading, targetUserId]);

  const fetchFollowStats = async () => {
    if (!targetUserId) return;
    try {
      const { count: followers } = await (supabase as any)
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", targetUserId);

      const { count: following } = await (supabase as any)
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", targetUserId);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchData = async () => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", targetUserId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username);
        setBio(profileData.bio || "");
      }

      // Fetch all interests
      const { data: interestsData } = await supabase
        .from("interests")
        .select("*")
        .order("name");

      setInterests(interestsData || []);

      // Fetch user interests
      const { data: userInterestsData } = await supabase
        .from("user_interests")
        .select("interest_id")
        .eq("user_id", targetUserId);

      setUserInterests(userInterestsData?.map((ui) => ui.interest_id) || []);
    } catch (error) {
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (interestId: string) => {
    if (!isOwnProfile) return;

    const isSelected = userInterests.includes(interestId);

    try {
      if (isSelected) {
        await supabase
          .from("user_interests")
          .delete()
          .eq("user_id", user!.id)
          .eq("interest_id", interestId);

        setUserInterests((prev) => prev.filter((id) => id !== interestId));
      } else {
        await supabase
          .from("user_interests")
          .insert({ user_id: user!.id, interest_id: interestId });

        setUserInterests((prev) => [...prev, interestId]);
      }
    } catch (error) {
      toast.error("خطأ في تحديث الاهتمامات");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("يرجى إدخال اسم المستخدم");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          bio: bio.trim() || null,
        })
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("تم حفظ التغييرات بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file, "avatars");

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      // Update profile with new avatar URL
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: result.url })
        .eq("user_id", user!.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: result.url } : null);
      toast.success("تم تحديث الصورة بنجاح! 🎉");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الصورة");
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCreatePost={() => navigate("/")} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </button>

        <div className="glass-card rounded-2xl p-6 animate-slide-up">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-4 border-accent/20">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {username?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              {isOwnProfile && (
                <>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <label htmlFor="avatar-upload">
                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      {uploadingAvatar ? (
                        <Loader2 className="w-4 h-4 text-accent-foreground animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>
                  </label>
                </>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-4">{username}</h2>
            <p className="text-sm text-muted-foreground">{profile?.user_id === user?.id ? user?.email : ""}</p>

            {/* Follow Stats */}
            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{followingCount}</span>
                <span className="text-muted-foreground">يتابع</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{followersCount}</span>
                <span className="text-muted-foreground">متابعين</span>
              </div>
            </div>

            {!isOwnProfile && targetUserId && (
              <div className="mt-6">
                <FollowButton targetUserId={targetUserId} />
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username - Read only if not own profile */}
            {isOwnProfile ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            ) : null}

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نبذة
              </label>
              {isOwnProfile ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة قصيرة عن نفسك..."
                  className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              ) : (
                <p className="text-foreground/80 bg-secondary/30 p-4 rounded-xl min-h-[60px]">
                  {bio || "لا توجد نبذة"}
                </p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                الاهتمامات
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isSelected = userInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      disabled={!isOwnProfile}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300",
                        isSelected
                          ? selectedColorMap[interest.color]
                          : colorMap[interest.color],
                        isOwnProfile && "hover:scale-105",
                        !isSelected && !isOwnProfile && "opacity-50 grayscale"
                      )}
                    >
                      {getIconComponent(interest.icon)}
                      <span className="text-sm font-medium">{interest.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions - Only for own profile */}
            {isOwnProfile && (
              <>
                <Button
                  onClick={handleSave}
                  variant="accent-gradient"
                  size="lg"
                  className="w-full gap-2"
                  disabled={saving}
                >
                  <Save className="w-4 h-4" />
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  تسجيل الخروج
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Profile;
