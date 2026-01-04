import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Contact = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("تم استلام رسالتك بنجاح! سنرد عليك قريباً.");
        setLoading(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background">
            <Header onCreatePost={() => navigate("/")} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-8 animate-fade-in">
                            <h1 className="text-3xl font-bold mb-6 text-accent">اتصل بنا</h1>
                            <p className="text-muted-foreground mb-8">
                                لديك استفسار أو اقتراح؟ نسعد دائماً بسماع صوتك. فريقنا جاهز للرد على جميع تساؤلاتك.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-foreground/80">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">البريد الإلكتروني</p>
                                        <a href="mailto:support@curatedhub.com" className="hover:text-accent transition-colors">support@curatedhub.com</a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-foreground/80">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">المساعدة المباشرة</p>
                                        <p>متاحون يومياً من 9 صباحاً - 5 مساءً</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card rounded-2xl p-8 animate-slide-up">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-xl font-bold mb-4">أرسل لنا رسالة</h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">الاسم</label>
                                <Input required placeholder="اسمك الكريم" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">البريد الإلكتروني</label>
                                <Input type="email" required placeholder="example@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">الرسالة</label>
                                <Textarea required placeholder="كيف يمكننا مساعدتك؟" className="min-h-[120px]" />
                            </div>

                            <Button type="submit" className="w-full gap-2" disabled={loading}>
                                {loading ? "جاري الإرسال..." : (
                                    <>
                                        إرسال الرسالة
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
