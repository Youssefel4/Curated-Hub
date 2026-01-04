import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Header onCreatePost={() => navigate("/")} />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="glass-card rounded-2xl p-8 md:p-12 animate-fade-in">
                    <h1 className="text-3xl font-bold mb-8 text-accent">سياسة الخصوصية</h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-right">
                        <p className="text-sm text-muted-foreground">آخر تحديث: 4 يناير 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. مقدمة</h2>
                            <p>
                                نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا لبياناتك عند استخدامك لمنصة "Curated Hub".
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. البيانات التي نجمعها</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li>معلومات الحساب: مثل اسم المستخدم والبريد الإلكتروني.</li>
                                <li>المحتوى: المنشورات والتعليقات والصور التي تشاركها.</li>
                                <li>بيانات الاستخدام: كيفية تفاعلك مع المنصة والاهتمامات التي تتابعها.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. كيف نستخدم بياناتك</h2>
                            <p>نستخدم المعلومات لـ:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>تحسين تجربتك وتخصيص المحتوى الظاهر لك.</li>
                                <li>حماية أمان حسابك ومنع الاحتيال.</li>
                                <li>التواصل معك بشأن التحديثات الهامة.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. مشاركة البيانات</h2>
                            <p>
                                لا نقوم ببيع بياناتك لأطراف ثالثة. قد نشارك بيانات محدودة فقط عند الضرورة القانونية أو لتحسين الخدمات الأساسية للمنصة.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. أمان البيانات</h2>
                            <p>
                                نطبق إجراءات أمنية صارمة لحماية معلوماتك، ولكن تذكر أنه لا توجد وسيلة نقل عبر الإنترنت آمنة بنسبة 100%.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. اتصل بنا</h2>
                            <p>
                                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة "اتصل بنا".
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
