import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignIn, adminSignUp } from "@/lib/supabase-auth";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await adminSignUp(email, password);
        toast.success("Admin account created! Logging in...");
      } else {
        await adminSignIn(email, password);
        toast.success("Admin login successful!");
      }
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="glass-card p-8 md:p-10 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isSignUp ? "Create admin account" : "Sign in to manage"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Admin Account" : "Login"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "First time?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-semibold hover:underline"
            >
              {isSignUp ? "Login here" : "Create admin account"}
            </button>
          </p>
        </form>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to main page
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminLogin;
