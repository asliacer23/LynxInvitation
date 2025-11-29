/**
 * Client2 - Debutante Ball Invitation Website
 * Vibrant, celebratory theme for debut event
 * Features RSVP form with guest count, dietary restrictions, and wishes
 */

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Heart,
  Users,
  Clock,
  MapPin,
  Mail,
  ChevronDown,
  Check,
  AlertCircle,
  Loader,
} from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FormData {
  guestName: string;
  attending: "yes" | "no" | "";
  guestCount: number;
  dietaryRestrictions: string;
  allergies: string;
  specialRequests: string;
  wish: string;
}

const ParticleBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-300 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: Math.random() * 0.5 + 0.3,
        }}
        animate={{
          y: [0, -window.innerHeight],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const Client2: React.FC = () => {
  const rsvpRef = useRef<HTMLDivElement>(null);
  const [showRsvp, setShowRsvp] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [guestFound, setGuestFound] = useState(false);
  const [guestListId, setGuestListId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rsvpState, setRsvpState] = useState<"not-submitted" | "submitted">("not-submitted");

  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    attending: "",
    guestCount: 1,
    dietaryRestrictions: "",
    allergies: "",
    specialRequests: "",
    wish: "",
  });

  // Check if guest has already submitted
  const checkDuplicateSubmission = async (name: string) => {
    setIsLoading(true);
    setError("");
    setSearchAttempted(true);

    try {
      // STEP 1: Check if guest exists in guest_list
      const { data: guestList, error: searchError } = await supabase
        .from("client2_guest_list")
        .select()
        .ilike("guest_name", `%${name}%`)
        .limit(1);

      if (searchError) throw searchError;

      if (!guestList || guestList.length === 0) {
        setGuestFound(false);
        setError("Guest name not found in the list. Please check and try again.");
        setIsLoading(false);
        return;
      }

      const guest = guestList[0];
      setGuestListId(guest.id);

      // STEP 2: Check if RSVP already exists
      const { data: existingRsvp } = await supabase
        .from("client2_rsvp_responses")
        .select()
        .eq("guest_list_id", guest.id)
        .limit(1);

      if (existingRsvp && existingRsvp.length > 0) {
        const rsvp = existingRsvp[0];
        if (rsvp.submitted_at) {
          setGuestFound(true);
          setRsvpState("submitted");
          setFormData({
            guestName: rsvp.guest_name || name,
            attending: rsvp.attending ? "yes" : "no",
            guestCount: rsvp.guest_count || 1,
            dietaryRestrictions: rsvp.dietary_restrictions || "",
            allergies: rsvp.allergies || "",
            specialRequests: rsvp.special_requests || "",
            wish: rsvp.wish || "",
          });
        } else {
          setGuestFound(true);
          setRsvpState("not-submitted");
          setFormData({ ...formData, guestName: name });
        }
      } else {
        setGuestFound(true);
        setRsvpState("not-submitted");
        setFormData({ ...formData, guestName: name });
      }
    } catch (err: any) {
      console.error("Error checking guest:", err);
      setError(err.message || "An error occurred");
      setGuestFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestListId) {
      setError("Guest information not found");
      return;
    }

    if (!formData.attending) {
      setError("Please select attending or not attending");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const rsvpData = {
        guest_list_id: guestListId,
        debutante_name: "Alexandra Maria Santos",
        guest_name: formData.guestName,
        attending: formData.attending === "yes",
        guest_count: formData.guestCount,
        dietary_restrictions: formData.dietaryRestrictions || null,
        allergies: formData.allergies || null,
        special_requests: formData.specialRequests || null,
        wish: formData.wish || null,
        submitted_at: new Date().toISOString(),
      };

      console.log("Submitting RSVP with data:", rsvpData);

      // Check if RSVP response already exists
      const { data: existingRsvp, error: checkError } = await supabase
        .from("client2_rsvp_responses")
        .select("id")
        .eq("guest_list_id", guestListId)
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (existingRsvp && existingRsvp.length > 0) {
        // UPDATE existing RSVP response
        const { error: updateError } = await supabase
          .from("client2_rsvp_responses")
          .update({
            attending: rsvpData.attending,
            guest_count: rsvpData.guest_count,
            dietary_restrictions: rsvpData.dietary_restrictions,
            allergies: rsvpData.allergies,
            special_requests: rsvpData.special_requests,
            wish: rsvpData.wish,
            submitted_at: rsvpData.submitted_at,
          })
          .eq("guest_list_id", guestListId);

        if (updateError) {
          throw updateError;
        }
      } else {
        // INSERT new RSVP response
        const { error: insertError } = await supabase
          .from("client2_rsvp_responses")
          .insert([rsvpData]);

        if (insertError) {
          throw insertError;
        }
      }

      setSubmitted(true);
      setRsvpState("submitted");
    } catch (err: any) {
      console.error("RSVP submission error:", err);
      setError(err.message || "Failed to submit RSVP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 text-white overflow-hidden">
      <ParticleBackground />

      {/* HEADER */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-40 bg-gradient-to-b from-black/30 to-transparent border-b border-pink-500/30 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Debut Ball
                </h1>
                <p className="text-xs text-purple-200">2026</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRsvp(!showRsvp)}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg transition text-sm"
            >
              {showRsvp ? "Close" : "RSVP"}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 py-12">
        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200"
          >
            Alexandra Maria Santos
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-purple-200 mb-8 font-light"
          >
            Cordially invites you to celebrate her ✨ Grand Debut ✨
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-2xl backdrop-blur"
          >
            <p className="text-purple-100 text-lg">
              Join us for an evening of elegance, celebration, and unforgettable memories
            </p>
          </motion.div>
        </motion.section>

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Clock,
              title: "Date & Time",
              details: ["May 17, 2026", "7:00 PM - 11:00 PM"],
            },
            {
              icon: MapPin,
              title: "Venue",
              details: ["Grand Ballroom", "Heritage Hotel, Downtown"],
            },
            {
              icon: Sparkles,
              title: "Dress Code",
              details: ["Formal Attire", "White Tie or Evening Gown"],
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="p-6 bg-gradient-to-br from-purple-800/40 to-pink-800/40 border border-purple-400/30 rounded-2xl backdrop-blur hover:border-purple-300/60 transition"
            >
              <item.icon className="w-8 h-8 mb-3 text-pink-300" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              {item.details.map((detail, i) => (
                <p key={i} className="text-purple-100 text-sm">
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* ABOUT DEBUTANTE */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-16 p-8 bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-purple-400/30 rounded-2xl backdrop-blur"
        >
          <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
            About the Debutante
          </h3>
          <p className="text-purple-100 leading-relaxed text-lg">
            Alexandra Maria Santos, daughter of Mr. and Mrs. Manuel Santos, is honored to present herself to society at her Grand Debut. 
            An accomplished student and passionate advocate for community service, Alexandra looks forward to celebrating this 
            milestone moment with those closest to her heart. Her debut marks the beginning of a beautiful chapter in her life.
          </p>
        </motion.section>

        {/* EVENING PROGRAM */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
            Evening Program
          </h3>
          <div className="space-y-4">
            {[
              { time: "7:00 PM", event: "Guests Arrival & Reception" },
              { time: "7:45 PM", event: "Opening Remarks & Waltz Introduction" },
              { time: "8:00 PM", event: "Alexandra's Grand Presentation" },
              { time: "8:15 PM", event: "Formal Dinner & Celebration" },
              { time: "9:30 PM", event: "Dancing & Entertainment" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + idx * 0.1 }}
                className="flex gap-4 p-4 bg-purple-800/30 rounded-lg border border-purple-400/20 hover:border-purple-300/60 transition"
              >
                <span className="text-pink-300 font-bold text-lg w-24">{item.time}</span>
                <span className="text-purple-100">{item.event}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ADDITIONAL INFORMATION */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="p-8 bg-gradient-to-r from-purple-800/40 to-pink-800/40 border border-purple-400/30 rounded-2xl backdrop-blur"
        >
          <h3 className="text-2xl font-bold mb-4">Additional Information</h3>
          <ul className="space-y-2 text-purple-100">
            <li>• RSVP by May 10, 2026</li>
            <li>• Cocktails and appetizers will be served</li>
            <li>• Please inform us of any dietary restrictions</li>
            <li>• Professional photography will be available</li>
            <li>• Indoor venue with full climate control</li>
          </ul>
        </motion.section>
      </div>

      {/* RSVP MODAL */}
      <AnimatePresence>
        {showRsvp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRsvp(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              ref={rsvpRef}
              className="bg-gradient-to-br from-purple-900 to-pink-900 border border-purple-400/50 rounded-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto relative"
            >
              <button
                onClick={() => setShowRsvp(false)}
                className="absolute top-4 right-4 p-2 hover:bg-purple-700 rounded-full transition"
              >
                <X size={24} />
              </button>

              {!guestFound ? (
                // GUEST SEARCH
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                    RSVP
                  </h2>
                  <p className="text-purple-200 mb-6">Enter your name to get started</p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (guestName.trim()) {
                        checkDuplicateSubmission(guestName);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-purple-200 mb-2">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-purple-300"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-500/20 text-red-200 px-4 py-3 rounded-lg border border-red-500/50"
                      >
                        <AlertCircle size={18} />
                        {error}
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !guestName.trim()}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Searching...
                        </>
                      ) : (
                        "Find My Name"
                      )}
                    </motion.button>
                  </form>
                </div>
              ) : rsvpState === "submitted" ? (
                // ALREADY SUBMITTED
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4 inline-block p-4 bg-green-500/20 rounded-full border border-green-500/50"
                  >
                    <Check className="w-8 h-8 text-green-300" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">RSVP Received!</h3>
                  <p className="text-purple-200 mb-6">
                    Thank you, {formData.guestName}! We've received your response.
                  </p>
                  <div className="bg-purple-800/30 border border-purple-400/30 rounded-lg p-4 mb-6 text-left">
                    <p className="text-purple-200 mb-2">
                      <span className="font-semibold">Status:</span>{" "}
                      {formData.attending === "yes" ? "✓ Attending" : "✗ Not Attending"}
                    </p>
                    {formData.attending === "yes" && (
                      <p className="text-purple-200">
                        <span className="font-semibold">Guests:</span> {formData.guestCount}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowRsvp(false)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                // RSVP FORM
                <form onSubmit={handleSubmitRsvp} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                      Welcome, {formData.guestName}!
                    </h3>
                    <p className="text-purple-300 text-sm">Please complete your RSVP</p>
                  </div>

                  {/* ATTENDING TOGGLE */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-3">
                      Will you be attending?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["yes", "no"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              attending: option as "yes" | "no",
                            })
                          }
                          className={`py-3 rounded-lg font-bold transition border ${
                            formData.attending === option
                              ? "bg-pink-500 border-pink-400"
                              : "bg-purple-800/50 border-purple-400/50 hover:border-purple-300"
                          }`}
                        >
                          {option === "yes" ? "✓ Yes, I'm Attending" : "✗ Cannot Attend"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.attending === "yes" && (
                    <>
                      {/* GUEST COUNT */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Number of Guests (including yourself)
                        </label>
                        <select
                          value={formData.guestCount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guestCount: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DIETARY RESTRICTIONS */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Dietary Restrictions (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.dietaryRestrictions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dietaryRestrictions: e.target.value,
                            })
                          }
                          placeholder="e.g., Vegetarian, Vegan, Gluten-free..."
                          className="w-full px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-purple-400"
                        />
                      </div>

                      {/* ALLERGIES */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Allergies (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.allergies}
                          onChange={(e) =>
                            setFormData({ ...formData, allergies: e.target.value })
                          }
                          placeholder="e.g., Peanuts, Shellfish, Dairy..."
                          className="w-full px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-purple-400"
                        />
                      </div>

                      {/* SPECIAL REQUESTS */}
                      <div>
                        <label className="block text-sm font-semibold text-purple-200 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specialRequests: e.target.value,
                            })
                          }
                          placeholder="Any special accommodations or requests..."
                          className="w-full px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-purple-400 resize-none h-20"
                        />
                      </div>
                    </>
                  )}

                  {/* WISHES */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Wishes & Message for Alexandra (Optional)
                    </label>
                    <textarea
                      value={formData.wish}
                      onChange={(e) =>
                        setFormData({ ...formData, wish: e.target.value })
                      }
                      placeholder="Share your wishes, congratulations, or a special message..."
                      className="w-full px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-purple-400 resize-none h-20"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-red-500/20 text-red-200 px-4 py-3 rounded-lg border border-red-500/50"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "✓ Submit RSVP"
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative z-30 border-t border-purple-500/30 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-purple-300">
          <p className="mb-2">For inquiries, please contact:</p>
          <p className="font-semibold text-purple-200">events@santosdebut.com</p>
          <p className="text-sm mt-4">✨ 2026 ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Client2;
