import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { adminSignOut, isAdmin } from "@/lib/supabase-auth";
import { toast } from "sonner";
import { Users, Calendar, MapPin, LogOut, Plus, Trash2, Edit, Shield, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Member {
  id: string;
  name: string;
  age: number | null;
  phone: string | null;
  address: string | null;
  role: string | null;
  shikshana: string | null;
  created_at: string;
}

interface Attendance {
  id: string;
  shakha_name: string;
  date: string;
  place: string;
  taruna: number;
  balaka: number;
  total: number;
  shishu: number;
  abhyagata: number;
  anya: number;
  pravasa: number;
  vishesha: string | null;
  submitted_by: string | null;
  created_at: string;
}

interface Shakha {
  id: string;
  name: string;
  location: string | null;
  created_at: string;
}

interface LoginRequest {
  id: string;
  username: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [shakhas, setShakhas] = useState<Shakha[]>([]);
  const [loginRequests, setLoginRequests] = useState<LoginRequest[]>([]);

  // Shakha form
  const [shakhaName, setShakhaName] = useState("");
  const [shakhaLocation, setShakhaLocation] = useState("");
  const [shakhaDialogOpen, setShakhaDialogOpen] = useState(false);
  const [editingShakha, setEditingShakha] = useState<Shakha | null>(null);

  // Member edit
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin"); return; }
      const adminCheck = await isAdmin(session.user.id);
      if (!adminCheck) { toast.error("Not authorized"); navigate("/admin"); return; }
      setLoading(false);
      fetchAll();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin");
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAll = async () => {
    const [membersRes, attendanceRes, shakhasRes, requestsRes] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("attendance").select("*").order("date", { ascending: false }),
      supabase.from("shakhas").select("*").order("name"),
      supabase.from("login_requests").select("*").order("created_at", { ascending: false }),
    ]);
    if (membersRes.data) setMembers(membersRes.data);
    if (attendanceRes.data) setAttendance(attendanceRes.data);
    if (shakhasRes.data) setShakhas(shakhasRes.data);
    if (requestsRes.data) setLoginRequests(requestsRes.data);
  };

  const handleLogout = async () => {
    await adminSignOut();
    navigate("/admin");
  };

  // Login request approval
  const updateLoginRequest = async (id: string, status: string) => {
    const { error } = await supabase.from("login_requests").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Request ${status}`);
    fetchAll();
  };

  // Shakha CRUD
  const saveShakha = async () => {
    if (!shakhaName) { toast.error("Name is required"); return; }
    if (editingShakha) {
      const { error } = await supabase.from("shakhas").update({ name: shakhaName, location: shakhaLocation || null }).eq("id", editingShakha.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Shakha updated");
    } else {
      const { error } = await supabase.from("shakhas").insert({ name: shakhaName, location: shakhaLocation || null });
      if (error) { toast.error(error.message); return; }
      toast.success("Shakha added");
    }
    setShakhaName(""); setShakhaLocation(""); setEditingShakha(null); setShakhaDialogOpen(false);
    fetchAll();
  };

  const deleteShakha = async (id: string) => {
    if (!confirm("Delete this shakha?")) return;
    const { error } = await supabase.from("shakhas").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Shakha deleted");
    fetchAll();
  };

  const editShakha = (s: Shakha) => {
    setEditingShakha(s); setShakhaName(s.name); setShakhaLocation(s.location || ""); setShakhaDialogOpen(true);
  };

  // Member CRUD
  const saveMember = async () => {
    if (!editingMember) return;
    const { error } = await supabase.from("members").update({
      name: editingMember.name,
      age: editingMember.age,
      phone: editingMember.phone,
      address: editingMember.address,
      role: editingMember.role,
      shikshana: editingMember.shikshana,
    }).eq("id", editingMember.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Member updated");
    setEditingMember(null); setMemberDialogOpen(false);
    fetchAll();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Member deleted");
    fetchAll();
  };

  const deleteAttendance = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from("attendance").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Record deleted");
    fetchAll();
  };

  const pendingCount = loginRequests.filter(r => r.status === "pending").length;

  const exportCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded`);
  };

  const exportMembers = () => {
    exportCSV("members.csv",
      ["Name", "Age", "Phone", "Address", "Role", "Shikshana", "Registered"],
      members.map(m => [m.name, String(m.age ?? ""), m.phone ?? "", m.address ?? "", m.role ?? "", m.shikshana ?? "", new Date(m.created_at).toLocaleDateString()])
    );
  };

  const exportAttendance = () => {
    exportCSV("attendance.csv",
      ["Date", "Shakha", "Place", "Taruna", "Balaka", "Shishu", "Abhyagata", "Anya", "Pravasa", "Total", "Vishesha", "Submitted By"],
      attendance.map(a => [a.date, a.shakha_name, a.place, String(a.taruna), String(a.balaka), String(a.shishu), String(a.abhyagata), String(a.anya), String(a.pravasa), String(a.total), a.vishesha ?? "", a.submitted_by ?? ""])
    );
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border border-input bg-warm-white text-foreground input-focus-ring outline-none text-sm";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold font-display text-foreground">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl saffron-gradient flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl saffron-gradient flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{attendance.length}</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl saffron-gradient flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{shakhas.length}</p>
              <p className="text-xs text-muted-foreground">Shakhas</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="requests" className="flex-1">
              Requests {pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
            <TabsTrigger value="shakhas" className="flex-1">Shakhas</TabsTrigger>
          </TabsList>

          {/* Login Requests Tab */}
          <TabsContent value="requests">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold font-display text-foreground">Login Requests ({loginRequests.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Username</th>
                      <th className="text-left p-3 font-semibold text-foreground">Date</th>
                      <th className="text-center p-3 font-semibold text-foreground">Status</th>
                      <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginRequests.map((r) => (
                      <tr key={r.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground font-medium">{r.username}</td>
                        <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            r.status === "approved" ? "bg-green-100 text-green-700" :
                            r.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {r.status === "approved" && <CheckCircle className="w-3 h-3" />}
                            {r.status === "rejected" && <XCircle className="w-3 h-3" />}
                            {r.status === "pending" && <Clock className="w-3 h-3" />}
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => updateLoginRequest(r.id, "approved")} className="text-green-600 hover:text-green-800 font-semibold text-xs">
                                Approve
                              </button>
                              <button onClick={() => updateLoginRequest(r.id, "rejected")} className="text-red-600 hover:text-red-800 font-semibold text-xs">
                                Reject
                              </button>
                            </>
                          )}
                          {r.status !== "pending" && (
                            <button onClick={() => updateLoginRequest(r.id, "pending")} className="text-muted-foreground hover:text-foreground text-xs">
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {loginRequests.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No login requests yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold font-display text-foreground">Members ({members.length})</h2>
                <button onClick={exportMembers} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Name</th>
                      <th className="text-left p-3 font-semibold text-foreground">Age</th>
                      <th className="text-left p-3 font-semibold text-foreground">Phone</th>
                      <th className="text-left p-3 font-semibold text-foreground">Role</th>
                      <th className="text-left p-3 font-semibold text-foreground">Shikshana</th>
                      <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground">{m.name}</td>
                        <td className="p-3 text-muted-foreground">{m.age || "-"}</td>
                        <td className="p-3 text-muted-foreground">{m.phone || "-"}</td>
                        <td className="p-3 text-muted-foreground">{m.role || "-"}</td>
                        <td className="p-3 text-muted-foreground">{m.shikshana || "-"}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => { setEditingMember(m); setMemberDialogOpen(true); }} className="text-primary hover:text-primary/80 mr-2">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button onClick={() => deleteMember(m.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No members yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold font-display text-foreground">Attendance Records ({attendance.length})</h2>
                <button onClick={exportAttendance} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Date</th>
                      <th className="text-left p-3 font-semibold text-foreground">Shakha</th>
                      <th className="text-left p-3 font-semibold text-foreground">Place</th>
                      <th className="text-center p-3 font-semibold text-foreground">Taruna</th>
                      <th className="text-center p-3 font-semibold text-foreground">Balaka</th>
                      <th className="text-center p-3 font-semibold text-foreground">Total</th>
                      <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground">{a.date}</td>
                        <td className="p-3 text-foreground">{a.shakha_name}</td>
                        <td className="p-3 text-muted-foreground">{a.place}</td>
                        <td className="p-3 text-center text-muted-foreground">{a.taruna}</td>
                        <td className="p-3 text-center text-muted-foreground">{a.balaka}</td>
                        <td className="p-3 text-center font-bold text-foreground">{a.total}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => deleteAttendance(a.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {attendance.length === 0 && (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No attendance records yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Shakhas Tab */}
          <TabsContent value="shakhas">
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold font-display text-foreground">Shakhas ({shakhas.length})</h2>
                <Dialog open={shakhaDialogOpen} onOpenChange={(open) => { setShakhaDialogOpen(open); if (!open) { setEditingShakha(null); setShakhaName(""); setShakhaLocation(""); } }}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg saffron-gradient text-primary-foreground text-sm font-semibold">
                      <Plus className="w-4 h-4" /> Add Shakha
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingShakha ? "Edit Shakha" : "Add New Shakha"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Name</label>
                        <input value={shakhaName} onChange={(e) => setShakhaName(e.target.value)} className={inputClass} placeholder="Shakha name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Location</label>
                        <input value={shakhaLocation} onChange={(e) => setShakhaLocation(e.target.value)} className={inputClass} placeholder="Location" />
                      </div>
                      <button onClick={saveShakha} className="w-full py-2.5 rounded-lg saffron-gradient text-primary-foreground font-semibold text-sm">
                        {editingShakha ? "Update" : "Add Shakha"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground">Name</th>
                      <th className="text-left p-3 font-semibold text-foreground">Location</th>
                      <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shakhas.map((s) => (
                      <tr key={s.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-foreground font-medium">{s.name}</td>
                        <td className="p-3 text-muted-foreground">{s.location || "-"}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => editShakha(s)} className="text-primary hover:text-primary/80 mr-2">
                            <Edit className="w-4 h-4 inline" />
                          </button>
                          <button onClick={() => deleteShakha(s.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {shakhas.length === 0 && (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No shakhas yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Member Edit Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={(open) => { setMemberDialogOpen(open); if (!open) setEditingMember(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Name</label>
                <input value={editingMember.name} onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Age</label>
                  <input type="number" value={editingMember.age || ""} onChange={(e) => setEditingMember({ ...editingMember, age: e.target.value ? Number(e.target.value) : null })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Phone</label>
                  <input value={editingMember.phone || ""} onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Address</label>
                <input value={editingMember.address || ""} onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Role</label>
                  <input value={editingMember.role || ""} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Shikshana</label>
                  <select value={editingMember.shikshana || ""} onChange={(e) => setEditingMember({ ...editingMember, shikshana: e.target.value })} className={inputClass}>
                    <option value="">Select</option>
                    <option value="OTC">OTC</option>
                    <option value="ITC1">ITC 1</option>
                    <option value="ITC2">ITC 2</option>
                    <option value="ITC3">ITC 3</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
              <button onClick={saveMember} className="w-full py-2.5 rounded-lg saffron-gradient text-primary-foreground font-semibold text-sm">
                Update Member
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
