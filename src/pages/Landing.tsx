import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Users,
    MessageCircle,
    Shield,
    Sparkles,
    Layers,
    PlayCircle,
    Code,
    Palette,
    GraduationCap,
    Briefcase,
    Heart,
    Dumbbell
} from "lucide-react";


const Landing = () => {
    const navigate = useNavigate();

    const handleLogin = () => navigate("/auth");
    const handleSignup = () => navigate("/auth");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 1. Navbar (Simple & Fixed) */}
            <nav className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
                            <span className="text-primary-foreground font-bold text-lg">م</span>
                        </div>
                        <span className="text-xl font-bold text-foreground hidden sm:block">Curated Hub</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleLogin}>
                            تسجيل الدخول
                        </Button>
                        <Button variant="accent-gradient" onClick={handleSignup} className="gap-2">
                            ابدأ الآن
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                <div className="container mx-auto text-center max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">المنصة العربية الأولى للأهتمامات</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-slide-up">
                        ابنِ مجتمعك وشارك<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            اهتماماتك مع الآخرين
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
                        منصة عربية تجمع الناس حسب اهتماماتهم المشتركة. شارك أفكارك، تفاعل مع محتوى هادف، وتعلّم من خبرات الآخرين في بيئة آمنة ومحفزة.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <Button size="lg" variant="accent-gradient" onClick={handleSignup} className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                            ابدأ رحلتك مجاناً
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleLogin} className="w-full sm:w-auto h-14 px-8 gap-2">
                            <PlayCircle className="w-5 h-5" />
                            سجل دخولك
                        </Button>
                    </div>
                </div>
            </section>

            {/* 3. Why This Platform (Feature Cards) */}
            <section className="py-20 px-4 bg-secondary/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card p-8 rounded-3xl hover:translate-y-[-5px] transition-all duration-300 border-t-4 border-t-primary">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">اهتمامات حقيقية</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                محتوى مخصص بناءً على ما تحب. لا خوارزميات عشوائية، فقط ما اخترته بنفسك من مجالات تهمك.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl hover:translate-y-[-5px] transition-all duration-300 border-t-4 border-t-accent">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">مجتمع نشيط</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                تواصل مع أشخاص يشاركونك نفس الشغف. ابنِ علاقات مهنية وشخصية في مجالاتك المفضلة.
                            </p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl hover:translate-y-[-5px] transition-all duration-300 border-t-4 border-t-green-500">
                            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">خصوصية وأمان</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                بيئة آمنة تحترم خصوصيتك. نحن نلتزم بأعلى معايير الأمان لحماية بياناتك ومحتواك.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. How It Works */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-16">كيف تعمل المنصة؟</h2>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 -z-10" />

                        <div className="relative group">
                            <div className="w-20 h-20 mx-auto rounded-full bg-background border-4 border-secondary flex items-center justify-center text-2xl font-bold shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300 z-10 relative">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-2">أنشئ حسابك</h3>
                            <p className="text-muted-foreground">سجل في ثوانٍ وابدأ رحلتك مجاناً</p>
                        </div>

                        <div className="relative group">
                            <div className="w-20 h-20 mx-auto rounded-full bg-accent text-accent-foreground border-4 border-accent/30 flex items-center justify-center text-2xl font-bold shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300 z-10 relative">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-2">اختر اهتماماتك</h3>
                            <p className="text-muted-foreground">حدد المجالات التي تود متابعتها</p>
                        </div>

                        <div className="relative group">
                            <div className="w-20 h-20 mx-auto rounded-full bg-background border-4 border-secondary flex items-center justify-center text-2xl font-bold shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300 z-10 relative">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-2">شارك وتفاعل</h3>
                            <p className="text-muted-foreground">انشر محتواك وتفاعل مع المجتمع</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Preview Section (Visual) */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent to-secondary/20">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">نظرة من الداخل</h2>
                        <p className="text-muted-foreground">هذا ما ستراه بعد تسجيل الدخول</p>
                    </div>

                    {/* Blurred/Mockup Interface */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
                        {/* Mock Header */}
                        <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-secondary/30">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        {/* Mock Content */}
                        <div className="p-8 grid md:grid-cols-4 gap-8 opacity-50 blur-[1px] select-none pointer-events-none transform scale-[0.98]">
                            {/* Sidebar Mock */}
                            <div className="hidden md:block space-y-4">
                                <div className="h-8 w-3/4 bg-muted rounded-lg"></div>
                                <div className="h-8 w-full bg-muted rounded-lg"></div>
                                <div className="h-8 w-5/6 bg-muted rounded-lg"></div>
                            </div>

                            {/* Feed Mock */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="h-40 bg-muted rounded-2xl w-full"></div>
                                <div className="h-64 bg-muted rounded-2xl w-full"></div>
                                <div className="h-40 bg-muted rounded-2xl w-full"></div>
                            </div>

                            {/* Widgets Mock */}
                            <div className="hidden md:block space-y-4">
                                <div className="h-32 bg-muted rounded-2xl w-full"></div>
                                <div className="h-32 bg-muted rounded-2xl w-full"></div>
                            </div>
                        </div>

                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                            <div className="text-center p-8 glass-card rounded-2xl shadow-xl animate-bounce-slow">
                                <MessageCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">المحتوى حصري للأعضاء</h3>
                                <Button onClick={handleSignup} variant="default" className="mt-4">
                                    انضم الآن لرؤية المزيد
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Categories Preview */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-10">استكشف اهتمامات متنوعة</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: "البرمجة", icon: Code, color: "text-blue-500 bg-blue-500/10" },
                            { name: "التصميم", icon: Palette, color: "text-purple-500 bg-purple-500/10" },
                            { name: "التعليم", icon: GraduationCap, color: "text-yellow-500 bg-yellow-500/10" },
                            { name: "ريادة الأعمال", icon: Briefcase, color: "text-indigo-500 bg-indigo-500/10" },
                            { name: "الصحة", icon: Heart, color: "text-red-500 bg-red-500/10" },
                            { name: "الرياضة", icon: Dumbbell, color: "text-emerald-500 bg-emerald-500/10" },
                        ].map((cat, idx) => (
                            <div key={idx} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border border-border/50 ${cat.color} transition-transform hover:scale-105 cursor-default`}>
                                <cat.icon className="w-5 h-5" />
                                <span className="font-semibold">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final CTA */}
            <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay"></div>
                <div className="container mx-auto text-center max-w-3xl relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز للانضمام إلى المجتمع؟</h2>
                    <p className="text-xl text-primary-foreground/80 mb-10">
                        الآلاف من المبدعين بانتظارك. لا تفوت فرصة التعلم والمشاركة.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" variant="secondary" onClick={handleSignup} className="h-14 px-8 text-lg font-bold">
                            إنشاء حساب مجاني
                        </Button>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Landing;
