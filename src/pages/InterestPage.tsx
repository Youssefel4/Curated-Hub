import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import PostCard from "@/components/posts/PostCard";
import CreatePostModal from "@/components/posts/CreatePostModal";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/types";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface DbPost {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  interest_id: string;
}

const InterestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interest, setInterest] = useState<Interest | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInterestAndPosts();
    }
  }, [id, user]);

  const fetchInterestAndPosts = async () => {
    setLoading(true);
    try {
      // Fetch all interests for the modal
      const { data: allInterests } = await supabase
        .from("interests")
        .select("*")
        .order("name");

      setInterests(allInterests || []);

      // Fetch this interest
      const { data: interestData } = await supabase
        .from("interests")
        .select("*")
        .eq("id", id)
        .single();

      setInterest(interestData);

      // Fetch posts for this interest
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("interest_id", id)
        .order("created_at", { ascending: false });

      if (!postsData) {
        setPosts([]);
        return;
      }

      // Transform posts
      const transformedPosts: Post[] = await Promise.all(
        postsData.map(async (post: DbPost) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("user_id", post.user_id)
            .maybeSingle();

          const { data: likes } = await supabase
            .from("likes")
            .select("user_id")
            .eq("post_id", post.id);

          const { data: commentsData } = await supabase
            .from("comments")
            .select("id, content, created_at, user_id")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true });

          const comments = await Promise.all(
            (commentsData || []).map(async (comment) => {
              const { data: commentProfile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("user_id", comment.user_id)
                .maybeSingle();

              return {
                id: comment.id,
                author: {
                  id: comment.user_id,
                  username: commentProfile?.username || "مستخدم",
                  avatar: commentProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
                  interests: [],
                },
                content: comment.content,
                createdAt: new Date(comment.created_at),
              };
            })
          );

          return {
            id: post.id,
            author: {
              id: post.user_id,
              username: profile?.username || "مستخدم",
              avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`,
              interests: [],
            },
            content: post.content,
            image: post.image_url || undefined,
            interest: {
              id: interestData?.id || "",
              name: interestData?.name || "",
              icon: interestData?.icon || "",
              color: interestData?.color || "",
              postsCount: 0,
            },
            likes: likes?.length || 0,
            comments,
            isLiked: user ? likes?.some((l) => l.user_id === user.id) : false,
            createdAt: new Date(post.created_at),
          };
        })
      );

      setPosts(transformedPosts);
    } catch (error) {
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    const isLiked = post?.isLiked;

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: postId });
      }
      fetchInterestAndPosts();
    } catch (error) {
      toast.error("خطأ في التفاعل");
    }
  };

  const handleCreatePost = async (content: string, interestId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      await supabase.from("posts").insert({
        user_id: user.id,
        content,
        interest_id: interestId,
      });
      toast.success("تم نشر المنشور بنجاح!");
      fetchInterestAndPosts();
    } catch (error) {
      toast.error("خطأ في نشر المنشور");
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as Record<string, any>)[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onCreatePost={() => setIsCreateModalOpen(true)} />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </button>

        {/* Interest Header */}
        {interest && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                {getIconComponent(interest.icon)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{interest.name}</h1>
                <p className="text-muted-foreground">{posts.length} منشور</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                لا توجد منشورات
              </h3>
              <p className="text-muted-foreground">
                كن أول من ينشر في هذا الاهتمام!
              </p>
            </div>
          )}
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        interests={interests}
        defaultInterestId={id}
      />
    </div>
  );
};

export default InterestPage;
