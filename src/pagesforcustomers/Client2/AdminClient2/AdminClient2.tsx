/**
 * AdminClient2 - Debut Admin Dashboard
 * Manages guest list and RSVP responses for Client2 (Debutante Ball)
 */

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Users,
  Sparkles,
  BarChart3,
  Menu,
  X,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Loader,
  Check,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_CREDENTIALS = {
  email: "admin@client2debut.com",
  password: "Client2Debut2026!",
};

/* ====================== LOGIN PAGE ======================= */
const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem(
        "client2_admin_auth",
        JSON.stringify({ email, loggedInAt: new Date().toISOString() })
      );
      onLogin();
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-2">Client 2 - Debut Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@client2debut.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/* ===================== MAIN ADMIN DASHBOARD ======================= */
interface Guest {
  id: number;
  guest_name: string;
  client: string;
  created_at: string;
}

interface RsvpResponse {
  id: number;
  guest_list_id: number;
  guest_name: string;
  client: string;
  attending: boolean | null;
  guest_count: number | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  special_requests: string | null;
  wish: string | null;
  submitted_at: string | null;
  created_at: string;
}

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<"guests" | "rsvps" | "analytics">("guests");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RsvpResponse[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [filter, setFilter] = useState<"all" | "yes" | "no" | "pending">("all");
  const [resettingId, setResettingId] = useState<number | null>(null);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client2_guest_list")
        .select("*")
        .order("guest_name", { ascending: true });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setMessage({ type: "error", text: "Failed to fetch guests" });
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("client2_rsvp_responses")
        .select("*")
        .order("submitted_at", { ascending: false, nullsFirst: true });

      if (error) throw error;
      setRsvps(data || []);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      setMessage({ type: "error", text: "Failed to fetch RSVPs" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "guests") {
      fetchGuests();
    } else if (activeTab === "rsvps") {
      fetchRsvps();
    }
  }, [activeTab]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setMessage({ type: "error", text: "Guest name is required" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("client2_guest_list").insert([
        {
          debutante_name: "Alexandra Maria Santos",
          guest_name: guestName.trim(),
        },
      ]);

      if (error) {
        console.error("Supabase Insert Error:", error);
        if ((error.message as string).includes("duplicate")) {
          setMessage({ type: "error", text: "This guest name already exists" });
        } else if ((error.message as string).includes("row-level security")) {
          setMessage({ type: "error", text: "RLS Policy Error" });
        } else {
          setMessage({ type: "error", text: `Failed to add guest: ${error.message}` });
        }
      } else {
        setMessage({ type: "success", text: "Guest added successfully" });
        setGuestName("");
        setShowAddForm(false);
        fetchGuests();
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}" from guest list?`)) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("client2_guest_list").delete().eq("id", id);

      if (error) {
        console.error("Supabase Delete Error:", error);
        setMessage({ type: "error", text: `Failed to delete guest: ${error.message}` });
      } else {
        setMessage({ type: "success", text: "Guest removed successfully" });
        fetchGuests();
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "An error occurred while deleting guest" });
    } finally {
      setDeletingId(null);
    }
  };

  const resetRsvp = async (rsvpId: number, guestName: string) => {
    if (!confirm(`Reset RSVP for ${guestName}? They can fill it again.`)) return;

    setResettingId(rsvpId);
    try {
      const { error } = await supabase
        .from("client2_rsvp_responses")
        .update({
          attending: null,
          guest_count: null,
          dietary_restrictions: null,
          allergies: null,
          special_requests: null,
          wish: null,
          submitted_at: null,
        })
        .eq("id", rsvpId);

      if (error) {
        console.error("Supabase Update Error:", error);
        setMessage({ type: "error", text: `Failed to reset RSVP: ${error.message}` });
      } else {
        setMessage({ type: "success", text: `RSVP for ${guestName} has been reset` });
        fetchRsvps();
      }
    } catch (error) {
      console.error("Error resetting RSVP:", error);
      setMessage({ type: "error", text: "Error resetting RSVP" });
    } finally {
      setResettingId(null);
    }
  };

  const stats = {
    totalGuests: guests.length,
    totalRsvps: rsvps.filter((r) => r.submitted_at).length,
    attending: rsvps.filter((r) => r.attending === true).length,
    notAttending: rsvps.filter((r) => r.attending === false).length,
    pending: rsvps.filter((r) => !r.submitted_at).length,
  };

  const filteredRsvps = rsvps.filter((r) => {
    if (filter === "yes") return r.attending === true;
    if (filter === "no") return r.attending === false;
    if (filter === "pending") return !r.submitted_at;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden flex-col lg:flex-row">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "100%" }}
        className={`fixed lg:relative lg:translate-x-0 z-50 w-64 h-full bg-white shadow-lg p-6 space-y-6 overflow-y-auto`}
      >
        <div className="flex items-center justify-between lg:justify-start">
          <h2 className="text-xl font-bold text-gray-800">Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {[
            { id: "guests" as const, label: "Guests", icon: Users },
            { id: "rsvps" as const, label: "RSVPs", icon: Sparkles },
            { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                activeTab === id
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">Debut Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`m-4 p-4 rounded-lg flex items-start gap-3 border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{message.type === "success" ? "Success" : "Error"}</p>
                <p className="text-sm">{message.text}</p>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "guests" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-800">Invited Guests ({guests.length})</h2>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Plus size={18} />
                    Add Guest
                  </button>
                )}
              </div>

              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddGuest}
                  className="bg-white p-4 rounded-lg border border-gray-200 space-y-4"
                >
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Guest name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Added</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr key={guest.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-800 font-medium">{guest.guest_name}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">
                            {new Date(guest.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                              disabled={deletingId === guest.id}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                            >
                              {deletingId === guest.id ? (
                                <Loader size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {guests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No guests yet. Add one to get started!</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "rsvps" && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">RSVP Responses</h2>
                <div className="flex gap-2 flex-wrap">
                  {["all", "yes", "no", "pending"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        filter === f
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {f === "all" && "All"}
                      {f === "yes" && "Attending"}
                      {f === "no" && "Not Attending"}
                      {f === "pending" && "Pending"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Guest</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Count</th>
                        <th className="text-center px-4 py-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-800">{rsvp.guest_name}</td>
                          <td className="px-4 py-3 text-center">
                            {!rsvp.submitted_at ? (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded inline-block">
                                Pending
                              </span>
                            ) : rsvp.attending ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                                Yes
                              </span>
                            ) : (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">
                            {rsvp.guest_count || "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => resetRsvp(rsvp.id, rsvp.guest_name)}
                              disabled={resettingId === rsvp.id}
                              className="text-blue-500 hover:text-blue-700 disabled:opacity-50 transition"
                              title="Reset RSVP"
                            >
                              {resettingId === rsvp.id ? (
                                <Loader size={18} className="animate-spin" />
                              ) : (
                                <RotateCcw size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredRsvps.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {rsvps.length === 0 ? "No RSVPs yet" : "No results for this filter"}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Total Guests", value: stats.totalGuests, color: "bg-blue-100 text-blue-700" },
                  { label: "RSVPs Received", value: stats.totalRsvps, color: "bg-purple-100 text-purple-700" },
                  { label: "Attending", value: stats.attending, color: "bg-green-100 text-green-700" },
                  { label: "Not Attending", value: stats.notAttending, color: "bg-red-100 text-red-700" },
                  { label: "Pending", value: stats.pending, color: "bg-yellow-100 text-yellow-700" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.color} p-4 rounded-lg text-center`}
                  >
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs sm:text-sm font-medium opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== MAIN COMPONENT ======================= */
const AdminClient2 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("client2_admin_auth");
    if (storedAuth) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return isLoggedIn ? (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem("client2_admin_auth");
        setIsLoggedIn(false);
      }}
    />
  ) : (
    <LoginPage onLogin={() => setIsLoggedIn(true)} />
  );
};

export default AdminClient2;
