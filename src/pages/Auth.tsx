import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("بيانات الدخول غير صحيحة");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("تم تسجيل الدخول بنجاح!");
          navigate("/");
        }
      } else {
        if (!username.trim()) {
          toast.error("يرجى إدخال اسم المستخدم");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("هذا البريد الإلكتروني مسجل مسبقاً");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("تم إنشاء الحساب بنجاح!");
          navigate("/onboarding");
        }
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg mb-4">
              <span className="text-primary-foreground font-bold text-2xl">م</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "أهلاً بك مجدداً!" : "انضم إلى مجتمع الاهتمامات"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 pr-10 pl-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pr-10 pl-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pr-10 pl-12 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="accent-gradient"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline mr-2"
              >
                {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
