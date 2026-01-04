import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import InterestsSidebar from "@/components/interests/InterestsSidebar";
import PostsFeed from "@/components/posts/PostsFeed";
import TrendingWidget from "@/components/widgets/TrendingWidget";
import CreatePostModal from "@/components/posts/CreatePostModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Post } from "@/types";
import Landing from "./Landing";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Number of posts per page
const POSTS_PER_PAGE = 10;

const Index = () => {
  const { user, loading: authLoading } = useAuth();

  // Conditionally render Landing Page if no user
  if (!authLoading && !user) {
    return <Landing />;
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const [posts, setPosts] = useState<Post[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Fetch interests on mount
  useEffect(() => {
    fetchInterests();
  }, []);

  // Fetch posts when user, search query, or interest changes
  useEffect(() => {
    fetchPosts(0, true);
  }, [user, searchQuery, selectedInterest]);

  const fetchInterests = async () => {
    try {
      const { data: interestsData } = await supabase
        .from("interests")
        .select("*")
        .order("name");
      setInterests(interestsData || []);
    } catch (error) {
      console.error("Error fetching interests:", error);
    }
  };

  // Optimized fetch using Supabase joins - fixes N+1 problem
  const fetchPosts = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true);
      setPage(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const from = pageNum * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // Start building the query
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply search filter if exists
      if (searchQuery) {
        query = query.ilike('content', `%${searchQuery}%`);
      }

      // Apply interest filter if exists
      if (selectedInterest) {
        query = query.eq('interest_id', selectedInterest);
      }

      const { data: postsData, error } = await query;

      if (error) throw error;

      if (!postsData || postsData.length === 0) {
        if (reset) setPosts([]);
        setHasMore(false);
        return;
      }

      // Check if there are more posts
      setHasMore(postsData.length === POSTS_PER_PAGE);

      // Get unique user IDs and interest IDs
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const interestIds = [...new Set(postsData.map(p => p.interest_id))];
      const postIds = postsData.map(p => p.id);

      // Batch fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);

      // Batch fetch interests
      const { data: interestsDataBatch } = await supabase
        .from("interests")
        .select("*")
        .in("id", interestIds);

      // Batch fetch likes
      const { data: likesData } = await supabase
        .from("likes")
        .select("post_id, user_id")
        .in("post_id", postIds);

      // Batch fetch comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id, post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      // Get unique comment author IDs
      const commentUserIds = [...new Set((commentsData || []).map(c => c.user_id))];

      // Batch fetch comment author profiles
      const { data: commentProfilesData } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", commentUserIds);

      // Create lookup maps for fast access
      const profilesMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );
      const interestsMap = new Map(
        (interestsDataBatch || []).map(i => [i.id, i])
      );
      const commentProfilesMap = new Map(
        (commentProfilesData || []).map(p => [p.user_id, p])
      );

      // Group likes by post
      const likesMap = new Map<string, string[]>();
      (likesData || []).forEach(like => {
        const existing = likesMap.get(like.post_id) || [];
        existing.push(like.user_id);
        likesMap.set(like.post_id, existing);
      });

      // Group comments by post
      const commentsMap = new Map<string, typeof commentsData>();
      (commentsData || []).forEach(comment => {
        const existing = commentsMap.get(comment.post_id) || [];
        existing.push(comment);
        commentsMap.set(comment.post_id, existing);
      });

      // Transform posts with all related data
      const transformedPosts: Post[] = postsData.map(post => {
        const profile = profilesMap.get(post.user_id);
        const interest = interestsMap.get(post.interest_id);
        const postLikes = likesMap.get(post.id) || [];
        const postComments = commentsMap.get(post.id) || [];

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
            id: interest?.id || "",
            name: interest?.name || "",
            icon: interest?.icon || "",
            color: interest?.color || "",
            postsCount: 0,
          },
          likes: postLikes.length,
          comments: postComments.map(comment => {
            const commentProfile = commentProfilesMap.get(comment.user_id);
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
          }),
          isLiked: user ? postLikes.includes(user.id) : false,
          createdAt: new Date(post.created_at),
        };
      });

      if (reset) {
        setPosts(transformedPosts);
      } else {
        setPosts(prev => [...prev, ...transformedPosts]);
      }
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("خطأ في تحميل المنشورات");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, false);
    }
  }, [loadingMore, hasMore, page]);

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول للتفاعل");
      navigate("/auth");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    const isLiked = post?.isLiked;

    // Optimistic update
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, isLiked: !isLiked, likes: isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

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
    } catch (error) {
      // Revert on error
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, isLiked: isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 }
            : p
        )
      );
      toast.error("خطأ في التفاعل");
    }
  };

  const handleCreatePost = async (content: string, interestId: string, imageUrl?: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول للنشر");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        interest_id: interestId,
        image_url: imageUrl || null,
      });

      if (error) throw error;
      toast.success("تم نشر المنشور بنجاح! 🎉");
      fetchPosts(0, true); // Refresh from start
    } catch (error) {
      toast.error("خطأ في نشر المنشور");
    }
  };

  const handleOpenCreateModal = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول للنشر");
      navigate("/auth");
      return;
    }
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <Header onCreatePost={handleOpenCreateModal} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <InterestsSidebar
            selectedInterest={selectedInterest}
            onSelectInterest={setSelectedInterest}
            interests={interests}
          />
          <PostsFeed
            posts={posts}
            selectedInterest={selectedInterest}
            onSelectInterest={setSelectedInterest}
            onLike={handleLike}
            interests={interests}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            searchQuery={searchQuery}
          />
          <TrendingWidget interests={interests} />
        </div>
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        interests={interests}
      />
    </div>
  );
};

export default Index;
