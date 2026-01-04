import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Header onCreatePost={() => navigate("/")} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-accent">من نحن</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                        <p className="lead text-xl text-muted-foreground">
                            منصة "Curated Hub" هي مساحتك الرقمية لاكتشاف ومشاركة ما يهمك مع مجتمع يشاركك الشغف.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">رؤيتنا</h2>
                        <p>
                            نؤمن بأن الإنترنت يجب أن يكون مكاناً يجمع الناس حول اهتماماتهم المشتركة بعيداً عن ضوضاء الشبكات التقليدية. نسعى لخلق بيئة عربية آمنة ومحفزة للإبداع وتبادل المعرفة.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">ماذا نقدم؟</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>مجتمعات متخصصة في مجالات متنوعة (برمجة، تصميم، فنون، وغيرها).</li>
                            <li>بيئة تفاعلية تدعم المحتوى العربي الهادف.</li>
                            <li>أدوات سهلة للمشاركة والتواصل مع المبدعين.</li>
                        </ul>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">انضم إلينا</h2>
                        <p>
                            سواء كنت محترفاً يرغب في مشاركة خبراته، أو مبتدئاً يسعى للتعلم، مكانك محفوظ بيننا.
                        </p>

                        <div className="mt-8 pt-8 border-t border-border flex justify-end">
                            <Button onClick={() => navigate("/")} className="gap-2">
                                ابدأ الاستكشاف
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AboutUs;
