import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLang();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t.fillAll);
      return;
    }
    if (loginUser(username, password)) {
      toast.success(t.loginSuccess);
      navigate("/attendance");
    } else {
      toast.error(t.invalidLogin);
    }
  };

  return (
    <PageLayout>
      <div className="glass-card p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 saffron-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold font-display">ॐ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            {t.loginTitle}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder={t.enterUsername}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder={t.enterPassword}
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation">
            {t.loginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.noAccount}{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">{t.registerLink}</Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
