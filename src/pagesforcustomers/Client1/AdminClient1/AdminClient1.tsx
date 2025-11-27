/**
 * Admin Dashboard for Client1 (Wedding) - MERGED VERSION
 * 
 * All features in one file:
 * ✅ Admin login/logout
 * ✅ Guest list management (add/remove guests)
 * ✅ RSVP management (view all responses)
 * ✅ Admin reset RSVP feature
 * ✅ Analytics dashboard
 * ✅ Real-time data sync with Supabase
 */

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

/* ===========================================================
   SUPABASE CONFIGURATION
   =========================================================== */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ===========================================================
   ADMIN CREDENTIALS
   =========================================================== */

const ADMIN_CREDENTIALS = {
  email: "admin@client1wedding.com",
  password: "Client1Wedding2026!",
};

/* ===========================================================
   LOGIN PAGE
   =========================================================== */

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
      localStorage.setItem("client1_admin_auth", JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
      onLogin();
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 text-sm mt-2">Client1 Wedding Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@client1wedding.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Demo Credentials:</strong><br />
            Email: admin@client1wedding.com<br />
            Password: Client1Wedding2026!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* ===========================================================
   GUEST LIST MANAGEMENT TAB (MERGED)
   =========================================================== */

interface Guest {
  id: number;
  guest_name: string;
  created_at: string;
}

const GuestListManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      // Query from guest_list table (admin's authorized guests)
      const { data, error } = await supabase
        .from("guest_list")
        .select("id, guest_name, created_at")
        .eq("client", "client1")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching guests:", error);
        setMessage({ type: "error", text: "Failed to load guest list" });
      } else {
        setGuests(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "An error occurred while loading guests" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim()) {
      setMessage({ type: "error", text: "Guest name is required" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert into guest_list table
      const { error } = await supabase
        .from("guest_list")
        .insert([
          {
            client: "client1",
            guest_name: guestName.trim(),
          },
        ]);

      if (error) {
        if (error.message.includes("duplicate")) {
          setMessage({ type: "error", text: "This guest name already exists" });
        } else {
          setMessage({ type: "error", text: "Failed to add guest" });
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
      // Delete from guest_list (CASCADE will delete rsvp_responses)
      const { error } = await supabase
        .from("guest_list")
        .delete()
        .eq("id", id);

      if (error) {
        setMessage({ type: "error", text: "Failed to delete guest" });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "responded":
        return "bg-green-100 text-green-800";
      case "invited":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-red-100 border border-red-300 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{message.type === "success" ? "Success" : "Error"}</p>
              <p className="text-sm">{message.text}</p>
            </div>
            <button onClick={() => setMessage(null)} className="ml-auto text-lg hover:opacity-70">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Guest Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6 overflow-hidden"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Guest</h3>

          <form onSubmit={handleAddGuest} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Full name of guest"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Guest
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setGuestName("");
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Add Button */}
      {!showAddForm && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Guest
        </motion.button>
      )}

      {/* Guest List Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Authorized Guests ({guests.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <Loader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Loading guest list...</p>
          </div>
        ) : guests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No guests added yet. Click "Add New Guest" to begin.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Added</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest, idx) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{guest.guest_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(guest.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                        disabled={deletingId === guest.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove guest"
                      >
                        {deletingId === guest.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">How It Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Add guests by entering their names only</li>
          <li>✅ Only guests in this list can access the RSVP form</li>
          <li>✅ Once a guest submits an RSVP, their status changes to "responded"</li>
          <li>✅ Remove guests if needed using the delete button</li>
          <li>✅ See all RSVP responses in the "RSVPs" tab</li>
        </ul>
      </div>
    </div>
  );
};

/* ===========================================================
   RSVP MANAGEMENT TAB
   =========================================================== */

const RsvpManagement: React.FC = () => {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [resettingId, setResettingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRsvps();
  }, []);

  const fetchRsvps = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rsvp_responses")
        .select("*")
        .eq("client", "client1")
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRsvp = async (rsvpId: number, guestName: string) => {
    if (!confirm(`Reset RSVP for ${guestName}? They can fill it again.`)) {
      return;
    }

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
          status: "invited",
        })
        .eq("id", rsvpId);

      if (error) throw error;

      alert(`RSVP for ${guestName} has been reset. They can now fill it again.`);
      fetchRsvps();
    } catch (error) {
      console.error("Error resetting RSVP:", error);
      alert("Error resetting RSVP. Please try again.");
    } finally {
      setResettingId(null);
    }
  };

  const filteredRsvps = rsvps.filter((rsvp) => {
    if (filter === "yes") return rsvp.attending === true;
    if (filter === "no") return rsvp.attending === false;
    return true;
  });

  const attendingCount = rsvps.filter((r) => r.attending === true).length;
  const notAttendingCount = rsvps.filter((r) => r.attending === false).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-semibold">Total Responses</p>
          <p className="text-3xl font-bold text-blue-900">{rsvps.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-semibold">Attending</p>
          <p className="text-3xl font-bold text-green-900">{attendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-semibold">Not Attending</p>
          <p className="text-3xl font-bold text-red-900">{notAttendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-semibold">Total Guests</p>
          <p className="text-3xl font-bold text-purple-900">{totalGuests}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all" ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All ({rsvps.length})
        </button>
        <button
          onClick={() => setFilter("yes")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "yes" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Attending ({attendingCount})
        </button>
        <button
          onClick={() => setFilter("no")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "no" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Not Attending ({notAttendingCount})
        </button>
        <button
          onClick={fetchRsvps}
          className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors ml-auto"
        >
          Refresh
        </button>
      </div>

      {/* RSVP Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading RSVPs...</div>
        ) : filteredRsvps.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No RSVPs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Guest Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Attending</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Guest Count</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Dietary</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Allergies</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Special Requests</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Wedding Wish</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Submitted</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{rsvp.guest_name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rsvp.attending ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rsvp.attending ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{rsvp.guest_count}</td>
                    <td className="px-4 py-3 text-xs">{rsvp.dietary_restrictions || "-"}</td>
                    <td className="px-4 py-3 text-xs">{rsvp.allergies || "-"}</td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate">{rsvp.special_requests || "-"}</td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate">{rsvp.wish || "-"}</td>
                    <td className="px-4 py-3 text-xs">{new Date(rsvp.submitted_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => resetRsvp(rsvp.id, rsvp.guest_name)}
                        disabled={resettingId === rsvp.id}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 disabled:opacity-50"
                      >
                        {resettingId === rsvp.id ? "Resetting..." : "Reset"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===========================================================
   ANALYTICS TAB
   =========================================================== */

const Analytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalRsvps: 0,
    attendingPercentage: 0,
    totalGuests: 0,
    avgGuestsPerRsvp: 0,
    dietaryRestrictions: 0,
    allergies: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from("rsvp_responses")
        .select("*")
        .eq("client", "client1")
        .not("submitted_at", "is", null);

      if (error) throw error;

      if (data && data.length > 0) {
        const attending = data.filter((r) => r.attending).length;
        const totalGuests = data.reduce((sum, r) => sum + (r.guest_count || 0), 0);
        const dietaryCount = data.filter((r) => r.dietary_restrictions).length;
        const allergiesCount = data.filter((r) => r.allergies).length;

        setStats({
          totalRsvps: data.length,
          attendingPercentage: Math.round((attending / data.length) * 100),
          totalGuests,
          avgGuestsPerRsvp: Math.round((totalGuests / data.length) * 10) / 10,
          dietaryRestrictions: dietaryCount,
          allergies: allergiesCount,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-gray-800">Wedding Analytics</h2>

      {isLoading ? (
        <div className="text-center text-gray-500 py-12">Loading analytics...</div>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-semibold">Total RSVP Responses</p>
              <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalRsvps}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-semibold">Acceptance Rate</p>
              <p className="text-4xl font-bold text-green-900 mt-2">{stats.attendingPercentage}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 font-semibold">Total Expected Guests</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.totalGuests}</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold">Avg Guests per RSVP</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgGuestsPerRsvp}</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold">Dietary Restrictions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.dietaryRestrictions}</p>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold">Allergies Reported</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.allergies}</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
              <h4 className="font-semibold text-rose-900 mb-2">Key Insight</h4>
              <p className="text-sm text-rose-800">
                Based on current RSVPs, you're expecting <strong>{stats.totalGuests}</strong> guests in total, with an average of <strong>{stats.avgGuestsPerRsvp}</strong> guests per RSVP.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Dietary Info</h4>
              <p className="text-sm text-blue-800">
                <strong>{stats.dietaryRestrictions}</strong> guests have dietary restrictions and <strong>{stats.allergies}</strong> have reported allergies. Plan accordingly!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ===========================================================
   MAIN ADMIN DASHBOARD
   =========================================================== */

export default function AdminClient1() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"guests" | "rsvp" | "analytics">("guests");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("client1_admin_auth");
    if (auth) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("client1_admin_auth");
    setIsLoggedIn(false);
    setActiveTab("guests");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" />
            {sidebarOpen && <h1 className="text-xl font-serif font-bold">Admin</h1>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("guests")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "guests" ? "bg-rose-600" : "hover:bg-gray-800"
            }`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Guest List</span>}
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "rsvp" ? "bg-rose-600" : "hover:bg-gray-800"
            }`}
          >
            <Heart size={20} />
            {sidebarOpen && <span>RSVPs</span>}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "analytics" ? "bg-rose-600" : "hover:bg-gray-800"
            }`}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Analytics</span>}
          </button>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <div className="p-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-serif font-bold text-gray-900">
                {activeTab === "guests" && "Guest List Management"}
                {activeTab === "rsvp" && "RSVP Management"}
                {activeTab === "analytics" && "Analytics Dashboard"}
              </h1>
              <p className="text-gray-600 mt-2">
                {activeTab === "guests" && "Add, edit, or remove guests from your authorized guest list"}
                {activeTab === "rsvp" && "View and manage all guest RSVPs and wishes"}
                {activeTab === "analytics" && "View insights about your wedding"}
              </p>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "guests" && <GuestListManagement />}
              {activeTab === "rsvp" && <RsvpManagement />}
              {activeTab === "analytics" && <Analytics />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
