import { Link } from "react-router-dom";
import { Github, Twitter, Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
                                <span className="text-primary-foreground font-bold">م</span>
                            </div>
                            <span className="text-lg font-bold">Curated Hub</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            منصة مجتمعية عربية تجمع المبدعين والمهتمين في مكان واحد لتبادل المعرفة والإلهام.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">روابط سريعة</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about-us" className="hover:text-primary transition-colors">من نحن</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">شروط الخدمة</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-4">تابعنا</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-1">
                        صنع بـ <Heart className="w-3 h-3 text-red-500 fill-red-500" /> بواسطة فريق Curated Hub © {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
