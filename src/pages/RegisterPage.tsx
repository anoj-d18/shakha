import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, isLoggedIn } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [shikshana, setShikshana] = useState("");
  const [shakhaId, setShakhaId] = useState("");
  const [shakhas, setShakhas] = useState<{ id: string; name: string }[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    supabase.from("shakhas").select("id, name").order("name").then(({ data }) => {
      if (data) setShakhas(data);
    });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) {
      toast.error(t.fillAll);
      return;
    }
    if (password.length < 4) {
      toast.error(t.passwordMin);
      return;
    }

    setLoading(true);

    // Save local auth
    if (!registerUser(username, password)) {
      toast.error(t.usernameExists);
      setLoading(false);
      return;
    }

    // Save member to database
    const { error } = await supabase.from("members").insert({
      name,
      age: age === "" ? null : Number(age),
      phone: phone || null,
      address: address || null,
      role: role || null,
      shikshana: shikshana || null,
      shakha_id: shakhaId || null,
    });

    if (error) {
      console.error("Member insert error:", error);
      toast.error("Registration failed: " + error.message);
      setLoading(false);
      return;
    }

    // Create a login request (pending admin approval)
    await supabase.from("login_requests").insert({ username });

    setLoading(false);
    toast.success(t.regSuccess + " Admin will approve your login request.");
    navigate("/");
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none";

  return (
    <PageLayout>
      <div className="glass-card p-8 md:p-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 saffron-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold font-display">ॐ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">{t.registerTitle}</h1>
          <p className="text-muted-foreground mt-2 text-sm">{t.registerSubtitle}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">{t.username}</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className={inputClass} placeholder={t.chooseUsername} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  placeholder={t.choosePassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Name / नाम *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className={inputClass} placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Age / आयु</label>
              <input type="number" min={1} value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                className={inputClass} placeholder="Age" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Phone / दूरभाष</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className={inputClass} placeholder="Phone number" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Role / भूमिका</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                className={inputClass} placeholder="e.g. Swayamsevak" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Address / पता</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              className={inputClass} placeholder="Full address" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Shikshana / शिक्षण</label>
              <select value={shikshana} onChange={(e) => setShikshana(e.target.value)}
                className={inputClass}>
                <option value="">Select</option>
                <option value="None">None</option>
                <option value="OTC">OTC</option>
                <option value="ITC1">ITC1</option>
                <option value="ITC2">ITC2</option>
                <option value="ITC3">ITC3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Shakha / शाखा</label>
              <select value={shakhaId} onChange={(e) => setShakhaId(e.target.value)}
                className={inputClass}>
                <option value="">Select Shakha</option>
                {shakhas.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation disabled:opacity-50">
            {loading ? "Registering..." : t.registerBtn}
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
