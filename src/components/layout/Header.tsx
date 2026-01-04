import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Bell, User, Menu, X, Home, Compass, PlusCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onCreatePost: () => void;
}

const Header = ({ onCreatePost }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-bold text-lg">م</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              منصة الاهتمامات
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن منشورات أو اهتمامات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full h-10 pr-10 pl-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 left-1 w-2 h-2 bg-accent rounded-full" />
                </Button>
                <Button variant="accent-gradient" onClick={onCreatePost} className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  نشر جديد
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full overflow-hidden"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt="الملف الشخصي"
                    className="w-8 h-8 rounded-full"
                  />
                </Button>
              </>
            ) : (
              <Button variant="accent-gradient" onClick={() => navigate("/auth")} className="gap-2">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="pt-2 space-y-2">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                    setIsMenuOpen(false);
                  }
                }}
                className="w-full h-10 pr-10 pl-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Mobile Nav */}
            <div className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-3" onClick={() => navigate("/")}>
                <Home className="w-5 h-5" />
                الرئيسية
              </Button>
              <Button variant="ghost" className="justify-start gap-3">
                <Compass className="w-5 h-5" />
                استكشاف
              </Button>
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start gap-3" onClick={() => navigate("/profile")}>
                    <User className="w-5 h-5" />
                    الملف الشخصي
                  </Button>
                  <Button variant="accent-gradient" onClick={onCreatePost} className="mt-2 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    نشر جديد
                  </Button>
                </>
              ) : (
                <Button variant="accent-gradient" onClick={() => navigate("/auth")} className="mt-2 gap-2">
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
