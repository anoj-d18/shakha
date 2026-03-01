import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLang();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t.fillAll);
      return;
    }
    if (password.length < 4) {
      toast.error(t.passwordMin);
      return;
    }
    if (registerUser(username, password)) {
      toast.success(t.regSuccess);
      navigate("/");
    } else {
      toast.error(t.usernameExists);
    }
  };

  return (
    <PageLayout>
      <div className="glass-card p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 saffron-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold font-display">ॐ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">{t.registerTitle}</h1>
          <p className="text-muted-foreground mt-2 text-sm">{t.registerSubtitle}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder={t.chooseUsername}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder={t.choosePassword}
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation">
            {t.registerBtn}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.hasAccount}{" "}
          <Link to="/" className="text-primary font-semibold hover:underline">{t.loginLink}</Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
