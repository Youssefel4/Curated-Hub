import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
    targetUserId: string;
    className?: string;
}

const FollowButton = ({ targetUserId, className }: FollowButtonProps) => {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkFollowStatus();
        }
    }, [user, targetUserId]);

    const checkFollowStatus = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from("follows")
                .select("*")
                .eq("follower_id", user!.id)
                .eq("following_id", targetUserId)
                .maybeSingle();

            if (error) throw error;
            setIsFollowing(!!data);
        } catch (error) {
            console.error("Error checking follow status:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFollow = async () => {
        if (!user) return;

        setActionLoading(true);
        try {
            if (isFollowing) {
                // Unfollow
                const { error } = await (supabase as any)
                    .from("follows")
                    .delete()
                    .eq("follower_id", user.id)
                    .eq("following_id", targetUserId);

                if (error) throw error;
                setIsFollowing(false);
                toast.success("تم إلغاء المتابعة");
            } else {
                // Follow
                const { error } = await (supabase as any)
                    .from("follows")
                    .insert({ follower_id: user.id, following_id: targetUserId });

                if (error) throw error;
                setIsFollowing(true);
                toast.success("تمت المتابعة بنجاح");
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Button variant="ghost" size="sm" disabled className={cn("w-28", className)}>
                <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
        );
    }

    if (user?.id === targetUserId) return null; // Can't follow yourself

    return (
        <Button
            onClick={toggleFollow}
            disabled={actionLoading}
            variant={isFollowing ? "outline" : "default"}
            className={cn(
                "gap-2 w-28 transition-all duration-300",
                isFollowing
                    ? "border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                className
            )}
        >
            {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinus className="w-4 h-4" />
                    <span>إلغاء المتابعة</span>
                </>
            ) : (
                <>
                    <UserPlus className="w-4 h-4" />
                    <span>متابعة</span>
                </>
            )}
        </Button>
    );
};

export default FollowButton;
