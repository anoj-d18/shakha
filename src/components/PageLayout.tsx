import { ReactNode } from "react";
import bhagwaBg from "@/assets/bhagwa-bg.jpg";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div
      className="page-bg flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bhagwaBg})` }}
    >
      <div className="page-overlay" />
      <div className="relative z-10 w-full max-w-lg animate-fade-up">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
