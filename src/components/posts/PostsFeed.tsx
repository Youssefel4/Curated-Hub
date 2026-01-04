import { useState } from "react";
import { TrendingUp, Clock, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { Post } from "@/types";
import { cn } from "@/lib/utils";
import InterestBadge from "@/components/interests/InterestBadge";

interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface PostsFeedProps {
  posts: Post[];
  selectedInterest: string | null;
  onSelectInterest: (id: string | null) => void;
  onLike: (postId: string) => void;
  interests: Interest[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

type SortOption = "recent" | "popular";

const PostsFeed = ({ posts, selectedInterest, onSelectInterest, onLike, interests, loading, loadingMore, hasMore, onLoadMore }: PostsFeedProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const filteredPosts = selectedInterest
    ? posts.filter((post) => post.interest.id === selectedInterest)
    : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="flex-1 min-w-0">
      {/* Mobile Interests */}
      <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => onSelectInterest(null)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedInterest === null
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            ✨ الكل
          </button>
          {interests.map((interest) => (
            <div key={interest.id} className="shrink-0">
              <InterestBadge
                interest={interest}
                isSelected={selectedInterest === interest.id}
                onClick={() => onSelectInterest(interest.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">ترتيب حسب:</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            الأحدث
          </Button>
          <Button
            variant={sortBy === "popular" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("popular")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            الأكثر تفاعلاً
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
            <p className="text-muted-foreground">جاري تحميل المنشورات...</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
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

      {/* Load More Button */}
      {!loading && hasMore && onLoadMore && (
        <div className="mt-6 text-center animate-fade-in">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="gap-2 min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                تحميل المزيد
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostsFeed;
