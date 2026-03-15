import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  // New member form
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newShikshana, setNewShikshana] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(t.fillAll);
      return;
    }

    setLoading(true);

    // Check if this user has a login request and its status
    const { data: request } = await supabase
      .from("login_requests")
      .select("status")
      .eq("username", username)
      .maybeSingle();

    if (!request) {
      // First time login - create a pending request
      await supabase.from("login_requests").insert({ username });
      toast.info("Your login request has been sent to admin for approval. Please wait.");
      setLoading(false);
      return;
    }

    if (request.status === "pending") {
      toast.warning("Your login request is still pending admin approval.");
      setLoading(false);
      return;
    }

    if (request.status === "rejected") {
      toast.error("Your login request has been rejected by admin.");
      setLoading(false);
      return;
    }

    // Status is approved - proceed with login
    if (loginUser(username, password)) {
      toast.success(t.loginSuccess);
      navigate("/attendance");
    } else {
      toast.error(t.invalidLogin);
    }
    setLoading(false);
  };

  const handleNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge || !newNumber || !newAddress || !newRole || !newShikshana) {
      toast.error(t.fillAll);
      return;
    }
    const { error } = await supabase.from("members").insert({
      name: newName,
      age: Number(newAge),
      phone: newNumber,
      address: newAddress,
      role: newRole,
      shikshana: newShikshana,
    });
    if (error) {
      toast.error("Registration failed: " + error.message);
      return;
    }
    toast.success(t.newMemberSuccess);
    setNewName(""); setNewAge(""); setNewNumber("");
    setNewAddress(""); setNewRole(""); setNewShikshana("");
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-input bg-warm-white text-foreground placeholder:text-muted-foreground input-focus-ring outline-none";

  return (
    <PageLayout>
      <div className="glass-card p-8 md:p-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 saffron-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground text-2xl font-bold font-display">ॐ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            {t.loginTitle}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{t.loginSubtitle}</p>
        </div>

        <Tabs defaultValue="mukyashikshak" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="mukyashikshak" className="flex-1 text-sm font-semibold">
              {t.mukyashikshakTab}
            </TabsTrigger>
            <TabsTrigger value="new" className="flex-1 text-sm font-semibold">
              {t.newTab}
            </TabsTrigger>
          </TabsList>

          {/* Mukyashikshak Login */}
          <TabsContent value="mukyashikshak">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.username}</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className={inputClass} placeholder={t.enterUsername} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.password}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    placeholder={t.enterPassword}
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
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation disabled:opacity-50">
                {loading ? "Checking..." : t.loginBtn}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                {t.noAccount}{" "}
                <a href="/register" className="text-primary font-semibold hover:underline">{t.registerLink}</a>
              </p>
            </form>
          </TabsContent>

          {/* New Member Registration */}
          <TabsContent value="new">
            <form onSubmit={handleNewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.nameLabel}</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className={inputClass} placeholder={t.namePlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.ageLabel}</label>
                  <input type="number" value={newAge} onChange={(e) => setNewAge(e.target.value)}
                    className={inputClass} placeholder={t.agePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.numberLabel}</label>
                  <input type="tel" value={newNumber} onChange={(e) => setNewNumber(e.target.value)}
                    className={inputClass} placeholder={t.numberPlaceholder} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.addressLabel}</label>
                <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)}
                  className={inputClass} placeholder={t.addressPlaceholder} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.roleLabel}</label>
                <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)}
                  className={inputClass} placeholder={t.rolePlaceholder} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.shikshanaLabel}</label>
                <select value={newShikshana} onChange={(e) => setNewShikshana(e.target.value)}
                  className={inputClass}>
                  <option value="">{t.shikshanaSelect}</option>
                  <option value="OTC">OTC</option>
                  <option value="ITC1">ITC 1</option>
                  <option value="ITC2">ITC 2</option>
                  <option value="ITC3">ITC 3</option>
                  <option value="None">None</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation">
                {t.submitBtn}
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
