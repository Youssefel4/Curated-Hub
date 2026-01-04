import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Camera, Save, ArrowRight, Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Profile {
  id: string;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { uploadImage, uploading: uploadingAvatar } = useImageUpload();

  useEffect(() => {
    // Wait for auth to initialize
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, [user, navigate, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
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
        .eq("user_id", user!.id);

      setUserInterests(userInterestsData?.map((ui) => ui.interest_id) || []);
    } catch (error) {
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (interestId: string) => {
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
                    {username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
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
            </div>
            <p className="text-sm text-muted-foreground mt-4">{user?.email}</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Username */}
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

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نبذة عنك
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة قصيرة عن نفسك..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                اهتماماتك
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isSelected = userInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300",
                        isSelected
                          ? selectedColorMap[interest.color]
                          : colorMap[interest.color],
                        "hover:scale-105"
                      )}
                    >
                      {getIconComponent(interest.icon)}
                      <span className="text-sm font-medium">{interest.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
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

            {/* Sign Out */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="w-full"
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
