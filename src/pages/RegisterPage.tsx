import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (registerUser(username, password)) {
      toast.success("Registration successful! Please login.");
      navigate("/");
    } else {
      toast.error("Username already exists");
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
            नया पंजीकरण
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Create a new account
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder="Choose a username"
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
              className="w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none"
              placeholder="Choose a password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
