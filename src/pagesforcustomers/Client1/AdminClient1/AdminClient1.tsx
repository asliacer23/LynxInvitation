/**
 * AdminClient1 - Wedding Admin Dashboard (REDESIGNED)
 * Elegant, responsive, fully-featured admin dashboard with modern UI
 * Manages guest list and RSVP responses for Client1 (Wedding Event)
 */

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Users,
  Heart,
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
  Search,
  Filter,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_CREDENTIALS = {
  email: "admin@client1wedding.com",
  password: "Client1Wedding2026!",
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
        "client1_admin_auth",
        JSON.stringify({ email, loggedInAt: new Date().toISOString() })
      );
      onLogin();
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg border border-rose-100"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-6 shadow-lg"
          >
            <Heart className="w-10 h-10 text-rose-600 fill-rose-600" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Admin Access
          </h1>
          <p className="text-gray-600 text-sm mt-3 font-medium">Wedding Event Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@client1wedding.com"
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-rose-50 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition bg-rose-50 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium border border-red-200"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Protected admin dashboard • Secure access only
        </p>
      </motion.div>
    </div>
  );
};

/* ====================== MAIN DASHBOARD ======================= */
interface Guest {
  id: number;
  guest_name: string;
  created_at: string;
  updated_at: string;
}

interface Rsvp {
  id: number;
  guest_list_id: number;
  guest_name: string;
  attending: boolean | null;
  guest_count: number | null;
  dietary_restrictions: string | null;
  allergies: string | null;
  special_requests: string | null;
  wish: string | null;
  submitted_at: string | null;
}

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeleteingId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"guests" | "rsvps" | "analytics">("guests");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttending, setFilterAttending] = useState<"all" | "yes" | "no" | "pending">("all");

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guest_list")
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
        .from("rsvp_responses")
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
      const { error } = await supabase.from("guest_list").insert([
        {
          guest_name: guestName.trim(),
        },
      ]);

      if (error) {
        if ((error.message as string).includes("duplicate")) {
          setMessage({ type: "error", text: "This guest name already exists" });
        } else if ((error.message as string).includes("row-level security")) {
          setMessage({ type: "error", text: "RLS Policy Error - Contact support" });
        } else {
          setMessage({ type: "error", text: `Failed: ${error.message}` });
        }
      } else {
        setMessage({ type: "success", text: "✓ Guest added successfully" });
        setGuestName("");
        setShowAddForm(false);
        fetchGuests();
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}" from guest list?`)) return;

    setDeleteingId(id);
    try {
      const { error } = await supabase.from("guest_list").delete().eq("id", id);

      if (error) {
        setMessage({ type: "error", text: `Failed to delete: ${error.message}` });
      } else {
        setMessage({ type: "success", text: "✓ Guest removed successfully" });
        fetchGuests();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error removing guest" });
    } finally {
      setDeleteingId(null);
    }
  };

  const resetRsvp = async (rsvpId: number, guestName: string) => {
    if (!confirm(`Reset RSVP for ${guestName}? They can fill it again.`)) return;

    setResettingId(rsvpId);
    try {
      const { error } = await supabase
        .from("rsvp_responses")
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
        setMessage({ type: "error", text: `Failed to reset: ${error.message}` });
      } else {
        setMessage({ type: "success", text: "✓ RSVP reset successfully" });
        fetchRsvps();
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error resetting RSVP" });
    } finally {
      setResettingId(null);
    }
  };

  const filteredRsvps = rsvps.filter((rsvp) => {
    const matchesSearch = rsvp.guest_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAttending === "all" ||
      (filterAttending === "yes" && rsvp.attending === true) ||
      (filterAttending === "no" && rsvp.attending === false) ||
      (filterAttending === "pending" && rsvp.submitted_at === null);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalGuests: guests.length,
    totalRsvps: rsvps.filter((r) => r.submitted_at !== null).length,
    attending: rsvps.filter((r) => r.attending === true).length,
    notAttending: rsvps.filter((r) => r.attending === false).length,
    pending: rsvps.filter((r) => r.submitted_at === null).length,
  };

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col md:flex-row overflow-hidden">
      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:relative w-72 h-screen bg-gradient-to-b from-rose-900 to-rose-800 text-white flex flex-col shadow-2xl border-r border-rose-700 z-50"
          >
            <div className="p-8 border-b border-rose-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-pink-200 flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-rose-900 fill-rose-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Wedding</h2>
                  <p className="text-rose-200 text-xs">Admin Panel</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
              {[
                { id: "guests", icon: Users, label: "Guests" },
                { id: "rsvps", icon: Heart, label: "RSVPs" },
                { id: "analytics", icon: BarChart3, label: "Analytics" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === item.id
                      ? "bg-rose-500 shadow-lg"
                      : "hover:bg-rose-700"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <div className="p-6 border-t border-rose-700 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onLogout();
                  localStorage.removeItem("client1_admin_auth");
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 px-4 py-3 rounded-lg font-semibold transition"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden w-full flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 px-4 py-3 rounded-lg font-semibold transition"
              >
                <X size={18} />
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-white border-b border-rose-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-rose-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Wedding Event Dashboard
            </h1>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Wedding Admin</p>
                <p className="text-xs text-gray-500">Event Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGE ALERT */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-4 mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <Check size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {/* GUESTS TAB */}
            {activeTab === "guests" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Guest List</h2>
                    <p className="text-gray-500 mt-1 text-sm">{guests.length} guests invited</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    <Plus size={20} />
                    Add Guest
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleAddGuest}
                      className="bg-white rounded-xl shadow-md border border-rose-100 p-6 mb-6"
                    >
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Add New Guest</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Enter guest name..."
                          className="flex-1 px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 font-semibold transition"
                        >
                          {isSubmitting ? "Adding..." : "Add"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="grid gap-3">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader className="animate-spin text-rose-500" size={32} />
                    </div>
                  ) : guests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                      <Heart className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 text-lg">No guests added yet</p>
                    </div>
                  ) : (
                    guests.map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg border border-rose-100 p-4 flex justify-between items-center hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{guest.guest_name}</p>
                          <p className="text-xs text-gray-500">
                            Added {new Date(guest.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                          disabled={deletingId === guest.id}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
                        >
                          {deletingId === guest.id ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* RSVPS TAB */}
            {activeTab === "rsvps" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">RSVP Responses</h2>

                  {/* FILTERS */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <select
                      value={filterAttending}
                      onChange={(e) => setFilterAttending(e.target.value as any)}
                      className="px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-700"
                    >
                      <option value="all">All Responses</option>
                      <option value="yes">Attending</option>
                      <option value="no">Not Attending</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader className="animate-spin text-rose-500" size={32} />
                    </div>
                  ) : filteredRsvps.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-rose-100">
                      <Heart className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 text-lg">No RSVPs to display</p>
                    </div>
                  ) : (
                    filteredRsvps.map((rsvp) => (
                      <motion.div
                        key={rsvp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg border border-rose-100 p-5 hover:shadow-md transition"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Guest Name</p>
                            <p className="font-bold text-gray-800 text-lg">{rsvp.guest_name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <div className="flex items-center gap-2 mt-1">
                              {rsvp.submitted_at === null ? (
                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                  ⏳ Pending
                                </span>
                              ) : rsvp.attending ? (
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                  ✓ Attending
                                </span>
                              ) : (
                                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                  ✗ Not Attending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {rsvp.submitted_at !== null && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded-lg">
                              {rsvp.guest_count !== null && (
                                <div>
                                  <span className="text-gray-600 text-xs">Guests</span>
                                  <p className="font-bold text-gray-800">{rsvp.guest_count}</p>
                                </div>
                              )}
                              {rsvp.dietary_restrictions && (
                                <div>
                                  <span className="text-gray-600 text-xs">Dietary</span>
                                  <p className="font-bold text-gray-800">{rsvp.dietary_restrictions}</p>
                                </div>
                              )}
                              {rsvp.allergies && (
                                <div>
                                  <span className="text-gray-600 text-xs">Allergies</span>
                                  <p className="font-bold text-gray-800">{rsvp.allergies}</p>
                                </div>
                              )}
                              {rsvp.special_requests && (
                                <div>
                                  <span className="text-gray-600 text-xs">Requests</span>
                                  <p className="font-bold text-gray-800">{rsvp.special_requests}</p>
                                </div>
                              )}
                            </div>
                            {rsvp.wish && (
                              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                                <p className="text-xs text-gray-600 mb-2 font-semibold">💌 Wishes & Message</p>
                                <p className="text-gray-800 italic">"{rsvp.wish}"</p>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => resetRsvp(rsvp.id, rsvp.guest_name)}
                            disabled={resettingId === rsvp.id}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 font-semibold transition text-sm"
                          >
                            {resettingId === rsvp.id ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <RotateCcw size={16} />
                            )}
                            Reset
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Analytics</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  {[
                    { label: "Total Guests", value: stats.totalGuests, color: "from-rose-500 to-pink-600", icon: Users },
                    { label: "RSVPs Received", value: stats.totalRsvps, color: "from-blue-500 to-blue-600", icon: Check },
                    { label: "Attending", value: stats.attending, color: "from-green-500 to-green-600", icon: Check },
                    { label: "Not Attending", value: stats.notAttending, color: "from-red-500 to-red-600", icon: X },
                    { label: "Pending", value: stats.pending, color: "from-yellow-500 to-yellow-600", icon: AlertCircle },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gradient-to-br ${stat.color} text-white rounded-lg p-6 shadow-lg`}
                    >
                      <stat.icon className="mb-2" size={24} />
                      <p className="text-4xl font-bold">{stat.value}</p>
                      <p className="text-sm opacity-90 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* SUMMARY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-rose-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Response Rate</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Responses Submitted</span>
                          <span className="text-sm font-bold text-gray-800">
                            {stats.totalGuests > 0
                              ? Math.round((stats.totalRsvps / stats.totalGuests) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-rose-500 to-pink-600 h-3 rounded-full transition-all"
                            style={{
                              width: `${stats.totalGuests > 0 ? (stats.totalRsvps / stats.totalGuests) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 border border-rose-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Attendance Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attending</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${stats.totalRsvps > 0 ? (stats.attending / stats.totalRsvps) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{stats.attending}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Not Attending</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{
                                width: `${stats.totalRsvps > 0 ? (stats.notAttending / stats.totalRsvps) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-12 text-right">{stats.notAttending}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ====================== MAIN COMPONENT ======================= */
export default function AdminClient1() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem("client1_admin_auth");
    return !!auth;
  });

  const handleLogout = () => {
    localStorage.removeItem("client1_admin_auth");
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={() => setIsAuthenticated(true)} />
  );
}
