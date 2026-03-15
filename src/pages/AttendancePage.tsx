import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getSession } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import PageLayout from "@/components/PageLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AttendancePage = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    if (!isLoggedIn()) navigate("/");
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
  const [loading, setLoading] = useState(false);

  const total = (Number(taruna) || 0) + (Number(balaka) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shakha || !date || !place) {
      toast.error(t.fillRequired);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("attendance").insert({
      shakha_name: shakha,
      date,
      place,
      taruna: Number(taruna) || 0,
      balaka: Number(balaka) || 0,
      total,
      shishu: Number(shishu) || 0,
      abhyagata: Number(abhyagata) || 0,
      anya: Number(anya) || 0,
      pravasa: Number(pravasa) || 0,
      vishesha: vishesha || null,
      submitted_by: getSession(),
    });

    setLoading(false);

    if (error) {
      console.error("Attendance insert error:", error);
      toast.error("Failed to save: " + error.message);
      return;
    }

    toast.success(t.attendanceSuccess);
    setShakha(""); setPlace(""); setTaruna(""); setBalaka("");
    setShishu(""); setAbhyagata(""); setAnya(""); setPravasa(""); setVishesha("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const numInput = (label: string, value: number | "", setter: (v: number | "") => void) => (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1">{label}</label>
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
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold font-display text-foreground">{t.rssTitle}</h1>
          <p className="text-primary font-semibold text-sm mt-1">{t.rssSubtitle}</p>
          <div className="w-20 h-0.5 saffron-gradient mx-auto mt-3 rounded-full" />
          <p className="text-muted-foreground text-xs mt-2">{t.attendanceFormTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">{t.shakha}</label>
              <input type="text" value={shakha} onChange={(e) => setShakha(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder={t.shakhaPlaceholder} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">{t.date}</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">{t.place}</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder={t.locationPlaceholder} />
            </div>
          </div>

          <div className="saffron-gradient-subtle rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 font-display">{t.attendanceDetails}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {numInput(t.taruna, taruna, setTaruna)}
              {numInput(t.balaka, balaka, setBalaka)}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">{t.total}</label>
                <div className="w-full px-3 py-2.5 rounded-lg border border-primary/30 bg-secondary text-foreground font-bold text-sm">{total}</div>
              </div>
              {numInput(t.shishu, shishu, setShishu)}
              {numInput(t.abhyagata, abhyagata, setAbhyagata)}
              {numInput(t.anya, anya, setAnya)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {numInput(t.pravasa, pravasa, setPravasa)}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">{t.vishesha}</label>
              <input type="text" value={vishesha} onChange={(e) => setVishesha(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm"
                placeholder={t.specialNotes} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg saffron-gradient text-primary-foreground font-semibold text-base btn-elevation disabled:opacity-50">
            {loading ? "Submitting..." : t.submitBtn}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            {t.logout}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AttendancePage;
