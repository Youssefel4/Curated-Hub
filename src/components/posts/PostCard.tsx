import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import InterestBadge from "@/components/interests/InterestBadge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  style?: React.CSSProperties;
}

const PostCard = ({ post, onLike, style }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false); // لإظهار قائمة المشاركة
  const { user } = useAuth();

  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ar });

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        post_id: post.id,
        content: newComment.trim(),
      });

      if (error) throw error;
      setNewComment("");
      toast.success("تم إضافة التعليق");
      // لتحديث التعليقات، يمكن إعادة fetch من Supabase هنا
    } catch (error) {
      toast.error("خطأ في إضافة التعليق");
    } finally {
      setSubmitting(false);
    }
  };

  // فتح روابط المشاركة في نافذة جديدة
  const handleShare = (platform: "facebook" | "whatsapp" | "instagram") => {
    const postUrl = encodeURIComponent(window.location.href); // رابط المنشور الحالي
    const text = encodeURIComponent(post.content);

    let shareLink = "";
    if (platform === "facebook") {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
    } else if (platform === "whatsapp") {
      shareLink = `https://api.whatsapp.com/send?text=${text}%20${postUrl}`;
    } else if (platform === "instagram") {
      // Instagram لا يدعم مشاركة مباشرة عبر الرابط، يمكن فقط نسخ الرابط
      navigator.clipboard.writeText(`${postUrl}`);
      toast.success("تم نسخ رابط المنشور للإنستغرام");
      return;
    }

    window.open(shareLink, "_blank");
  };

  return (
    <article
      className="glass-card rounded-2xl p-5 card-hover animate-slide-up"
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-12 h-12 rounded-full border-2 border-border"
          />
          <div>
            <h3 className="font-bold text-foreground">{post.author.username}</h3>
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InterestBadge interest={post.interest} size="sm" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-4">{post.content}</p>

      {/* Image */}
      {post.image && (
        <div className="relative rounded-xl overflow-hidden mb-4">
          <img
            src={post.image}
            alt="صورة المنشور"
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50 relative">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={cn(
              "gap-2 transition-all duration-300",
              post.isLiked && "text-destructive"
            )}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-300",
                post.isLiked && "fill-current scale-110"
              )}
            />
            <span>{post.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </Button>
        </div>

        {/* زر المشاركة */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShareOpen(!shareOpen)}
          >
            <Share2 className="w-5 h-5" />
            مشاركة
          </Button>

          {/* قائمة المشاركة المحسنة */}
          {shareOpen && (
            <>
              {/* Backdrop للإغلاق عند الضغط خارج القائمة */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShareOpen(false)}
              />

              <div className="absolute left-0 bottom-full mb-2 w-56 bg-card/95 backdrop-blur-lg rounded-xl shadow-2xl border border-border/50 p-3 z-50 animate-slide-up">
                <div className="flex flex-col gap-2">
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      handleShare("facebook");
                      setShareOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1877F2]/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-foreground group-hover:text-[#1877F2] transition-colors">Facebook</p>
                      <p className="text-xs text-muted-foreground">شارك على فيسبوك</p>
                    </div>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      handleShare("whatsapp");
                      setShareOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#25D366]/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-foreground group-hover:text-[#25D366] transition-colors">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">شارك على واتساب</p>
                    </div>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={() => {
                      handleShare("instagram");
                      setShareOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-br hover:from-[#833AB4]/10 hover:via-[#FD1D1D]/10 hover:to-[#F77737]/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-foreground group-hover:text-[#E4405F] transition-colors">Instagram</p>
                      <p className="text-xs text-muted-foreground">نسخ الرابط</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
          {/* Comments List */}
          {post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full border border-border"
                  />
                  <div className="flex-1 bg-secondary/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {comment.author.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ar })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {user && (
            <div className="flex gap-3">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt="صورتك"
                className="w-8 h-8 rounded-full border border-border"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب تعليقاً..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  className="flex-1 h-9 px-4 rounded-full bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  variant="accent"
                  size="sm"
                  className="rounded-full px-4"
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default PostCard;
