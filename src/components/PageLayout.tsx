import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, ClipboardList, ShieldCheck } from "lucide-react";
import bhagwaBg from "@/assets/bhagwa-bg.jpg";
import { useLang } from "@/lib/lang";

interface PageLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", label: "Login", labelKn: "ಲಾಗಿನ್", icon: LogIn },
  { path: "/register", label: "Register", labelKn: "ನೋಂದಣಿ", icon: UserPlus },
  { path: "/attendance", label: "Attendance", labelKn: "ಹಾಜರಾತಿ", icon: ClipboardList },
  { path: "/admin", label: "Admin", labelKn: "ನಿರ್ವಾಹಕ", icon: ShieldCheck },
];

const PageLayout = ({ children }: PageLayoutProps) => {
  const { lang, toggleLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="page-bg flex flex-col items-center justify-center p-4 pb-20"
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

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors cursor-pointer ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                <span className="text-[11px] leading-tight">
                  {lang === "en" ? item.label : item.labelKn}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default PageLayout;
