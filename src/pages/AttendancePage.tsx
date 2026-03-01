import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getSession } from "@/lib/auth";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";

const AttendancePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const [shakha, setShakha] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [place, setPlace] = useState("");
  const [taruna, setTaruna] = useState<number | "">("");
  const [balaka, setBalaka] = useState<number | "">("");
  const [shishu, setShishu] = useState<number | "">("");
  const [abhyagata, setAbhyagata] = useState<number | "">("");
  const [anya, setAnya] = useState<number | "">("");
  const [pravasa, setPravasa] = useState<number | "">("");
  const [vishesha, setVishesha] = useState("");

  const total = (Number(taruna) || 0) + (Number(balaka) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shakha || !date || !place) {
      toast.error("Please fill Shakha, Date, and Place");
      return;
    }
    const record = {
      shakha, date, place, taruna, balaka, total, shishu, abhyagata, anya, pravasa, vishesha,
      submittedBy: getSession(),
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("shakha_attendance") || "[]");
    existing.push(record);
    localStorage.setItem("shakha_attendance", JSON.stringify(existing));
    toast.success("Attendance submitted successfully!");
    // Reset
    setShakha(""); setPlace(""); setTaruna(""); setBalaka("");
    setShishu(""); setAbhyagata(""); setAnya(""); setPravasa(""); setVishesha("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const numInput = (
    label: string,
    value: number | "",
    setter: (v: number | "") => void
  ) => (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1">
        {label}
      </label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setter(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
        placeholder="0"
      />
    </div>
  );

  return (
    <PageLayout>
      <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold font-display text-foreground">
            राष्ट्रीय स्वयंसेवक संघ
          </h1>
          <p className="text-primary font-semibold text-sm mt-1">
            Rashtriya Swayamsevak Sangh
          </p>
          <div className="w-20 h-0.5 saffron-gradient mx-auto mt-3 rounded-full" />
          <p className="text-muted-foreground text-xs mt-2">
            शाखा उपस्थिति प्रपत्र — Shakha Attendance Form
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Shakha (शाखा)</label>
              <input
                type="text"
                value={shakha}
                onChange={(e) => setShakha(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder="Shakha name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Date (दिनांक)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Place (स्थान)</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder="Location"
              />
            </div>
          </div>

          {/* Attendance Counts */}
          <div className="saffron-gradient-subtle rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 font-display">
              उपस्थिति विवरण — Attendance Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {numInput("Taruna (तरुण)", taruna, setTaruna)}
              {numInput("Balaka (बालक)", balaka, setBalaka)}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Total (कुल)
                </label>
                <div className="w-full px-3 py-2.5 rounded-lg border border-primary/30 bg-secondary text-foreground font-bold text-sm">
                  {total}
                </div>
              </div>
              {numInput("Shishu (शिशु)", shishu, setShishu)}
              {numInput("Abhyagata (अभ्यागत)", abhyagata, setAbhyagata)}
              {numInput("Anya (अन्य)", anya, setAnya)}
            </div>
          </div>

          {/* Additional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {numInput("Pravasa (प्रवास)", pravasa, setPravasa)}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Vishesha (विशेष)
              </label>
              <input
                type="text"
                value={vishesha}
                onChange={(e) => setVishesha(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder="Special notes"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation"
          >
            Submit Attendance
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AttendancePage;
