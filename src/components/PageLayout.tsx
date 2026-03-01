import { ReactNode } from "react";
import bhagwaBg from "@/assets/bhagwa-bg.jpg";
import { useLang } from "@/lib/lang";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { lang, toggleLang } = useLang();

  return (
    <div
      className="page-bg flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bhagwaBg})` }}
    >
      <div className="page-overlay" />

      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className="fixed top-4 right-4 z-50 glass-card px-4 py-2 flex items-center gap-2 text-sm font-semibold text-foreground btn-elevation cursor-pointer"
      >
        <span className="text-base">{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
        {lang === "en" ? "ಕನ್ನಡ" : "English"}
      </button>

      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
