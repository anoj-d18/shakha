import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useLang();

  // New member form
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newShikshana, setNewShikshana] = useState("");

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

  const handleNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAge || !newNumber || !newAddress || !newRole || !newShikshana) {
      toast.error(t.fillAll);
      return;
    }
    const members = JSON.parse(localStorage.getItem("shakha_members") || "[]");
    members.push({
      name: newName, age: newAge, number: newNumber,
      address: newAddress, role: newRole, shikshana: newShikshana,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("shakha_members", JSON.stringify(members));
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
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className={inputClass} placeholder={t.enterPassword} />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation">
                {t.loginBtn}
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
