import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Header onCreatePost={() => navigate("/")} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in">
                    <h1 className="text-3xl font-bold mb-8 text-accent">شروط الخدمة</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-right">
                        <p className="text-sm text-muted-foreground">آخر تحديث: 4 يناير 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. قبول الشروط</h2>
                            <p>
                                بوصولك واستخدامك لمنصة "Curated Hub"، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق، يرجى عدم استخدام المنصة.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. سلوك المستخدم</h2>
                            <p>أنت توافق على عدم:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>نشر محتوى يحرض على الكراهية أو العنف.</li>
                                <li>انتحال صفة الآخرين أو نشر معلومات مضللة.</li>
                                <li>استخدام المنصة لأغراض غير قانونية.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. الملكية الفكرية</h2>
                            <p>
                                تحتفظ بملكية المحتوى الذي تنشره، لكنك تمنحنا رخصة لاستخدامه وعرضه على المنصة.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. إنهاء الخدمة</h2>
                            <p>
                                نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه الشروط أو لأي سبب آخر نراه مناسباً لحماية المجتمع.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. التغييرات على الشروط</h2>
                            <p>
                                قد نقوم بتحديث هذه الشروط من وقت لآخر. سنخطرك بأي تغييرات جوهرية، واستمرارك في استخدام المنصة يعني قبولك لها.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
