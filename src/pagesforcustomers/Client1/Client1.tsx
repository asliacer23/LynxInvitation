/**
 * Minimalist Wedding Web Invitation - Client1
 * 
 * Features:
 * ✅ Single page design
 * ✅ Minimalist aesthetic
 * ✅ Responsive (mobile & web)
 * ✅ Custom image support
 * ✅ Smooth scrolling
 * ✅ Elegant animations
 * ✅ RSVP integration
 * ✅ Guest management
 * 
 * Requirements:
 * - Framer Motion
 * - Lucide React
 * - Swiper
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Heart, MapPin, Calendar, Clock, X, Mail, Search, AlertCircle, CheckCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { createClient } from "@supabase/supabase-js";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* ===========================================================
   SUPABASE CONFIGURATION
   =========================================================== */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ===========================================================
   CONFIG & ASSETS
   =========================================================== */

const ASSETS = {
  hero: "/Client1/Client1Pictures/Image2.webp",
  couple: "/Client1/Client1Pictures/Image1.jpg",
  venue: "/Client1/Client1Pictures/venue.jpg",
  gallery: [
    "/Client1/Client1Pictures/Image1.jpg",
    "/Client1/Client1Pictures/Image2.webp",
    "/Client1/Client1Pictures/photo3.jpg",
    "/Client1/Client1Pictures/Image2.webp",
    "/Client1/Client1Pictures/photo5.jpg",
    "/Client1/Client1Pictures/photo6.jpg",
  ],
  reception: "/Client1/Client1Pictures/reception.jpg",
};

const COUPLE_INFO = {
  bride: "Maria Clara",
  groom: "Juan Miguel",
  date: "June 15, 2026",
  time: "4:00 PM",
  venue: "Sacred Heart Church, Manila",
  reception: "The Palace Hotel, Makati",
  dressCode: "Black Tie Optional",
};

// Hardcoded list will be replaced with database guest_list table
const RSVP_GUESTS = [
  { fullName: "John Astley Acer", status: "Pending", notes: "" },
  { fullName: "Maria Clara Santos", status: "Confirmed", notes: "" },
  { fullName: "Juan Dela Cruz", status: "Pending", notes: "" },
  { fullName: "Angela Reyes", status: "Confirmed", notes: "" },
];

/* ===========================================================
   ANIMATIONS
   =========================================================== */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/* ===========================================================
   RSVP MODAL
   =========================================================== */

interface RsvpFormData {
  attending: "yes" | "no" | null;
  guestCount: number;
  dietaryRestrictions: string;
  allergies: string;
  specialRequests: string;
  wish: string;
}

const RsvpModal: React.FC<{ open: boolean; onClose: () => void; query?: string }> = ({
  open,
  onClose,
  query = "",
}) => {
  const [result, setResult] = React.useState<{ found: boolean; guest?: { fullName: string; dbName: string; guestListId?: number; status: string; notes: string }; alreadySubmitted?: boolean } | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<RsvpFormData>({
    attending: null,
    guestCount: 1,
    dietaryRestrictions: "",
    allergies: "",
    specialRequests: "",
    wish: "",
  });

  React.useEffect(() => {
    if (!open) {
      setShowForm(false);
      setShowConfirmation(false);
      setFormData({ attending: null, guestCount: 1, dietaryRestrictions: "", allergies: "", specialRequests: "", wish: "" });
      return;
    }
    if (!query) {
      setResult(null);
      setShowForm(false);
      setShowConfirmation(false);
      return;
    }

    // Check if guest exists in guest_list table and has already submitted RSVP
const checkDuplicateSubmission = async () => {
  try {
    const trimmedQuery = query.trim().toLowerCase();

    // ---- STEP 1: Find guest in list ----
    const { data: guestListData, error: guestListError } = await supabase
      .from("guest_list")
      .select("id, guest_name")
      .eq("client", "client1")
      .ilike("guest_name", `%${trimmedQuery}%`)
      .limit(1);

    if (guestListError) throw guestListError;

    if (!guestListData || guestListData.length === 0) {
      setTimeout(() => setResult({ found: false }), 300);
      return;
    }

    const guest = guestListData[0];

    // ---- STEP 2: Check if guest has already submitted ----
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp_responses")
      .select("id, submitted_at")
      .eq("guest_list_id", guest.id)
      .eq("client", "client1")
      .limit(1);

    if (rsvpError) throw rsvpError;

    const alreadySubmitted = rsvpData && rsvpData.length > 0 && rsvpData[0].submitted_at !== null;

    setTimeout(() =>
      setResult({
        found: true,
        guest: {
          fullName: guest.guest_name,
          dbName: guest.guest_name,
          guestListId: guest.id,
          status: "Pending",
          notes: "",
        },
        alreadySubmitted,
      }), 
    300);

  } catch (error) {
    console.error("Error checking guest status:", error);
    setTimeout(() => setResult({ found: false }), 300);
  }
};

    checkDuplicateSubmission();
  }, [open, query]);

  const handleSubmitRsvp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      if (!result?.guest?.guestListId) {
        throw new Error("Guest ID not found");
      }

      const guestListId = result.guest.guestListId;
      const guestName = result.guest.dbName;

      const rsvpData = {
        guest_list_id: guestListId,
        client: "client1",
        guest_name: guestName,
        attending: formData.attending === "yes",
        guest_count: formData.guestCount,
        dietary_restrictions: formData.dietaryRestrictions || null,
        allergies: formData.allergies || null,
        special_requests: formData.specialRequests || null,
        wish: formData.wish || null,
        submitted_at: new Date().toISOString(),
      };

      console.log("Submitting RSVP with data:", rsvpData);

      // Check if RSVP response already exists for this guest
      const { data: existingRsvp, error: checkError } = await supabase
        .from("rsvp_responses")
        .select("id")
        .eq("guest_list_id", guestListId)
        .eq("client", "client1")
        .limit(1);

      if (checkError) {
        throw checkError;
      }

      if (existingRsvp && existingRsvp.length > 0) {
        // UPDATE existing RSVP response
        const { error: updateError } = await supabase
          .from("rsvp_responses")
          .update({
            attending: rsvpData.attending,
            guest_count: rsvpData.guest_count,
            dietary_restrictions: rsvpData.dietary_restrictions,
            allergies: rsvpData.allergies,
            special_requests: rsvpData.special_requests,
            wish: rsvpData.wish,
            submitted_at: rsvpData.submitted_at,
          })
          .eq("guest_list_id", guestListId)
          .eq("client", "client1");

        if (updateError) {
          throw updateError;
        }
        console.log("RSVP updated successfully");
      } else {
        // INSERT new RSVP response
        const { error: insertError } = await supabase
          .from("rsvp_responses")
          .insert([rsvpData]);

        if (insertError) {
          throw insertError;
        }
        console.log("RSVP inserted successfully");
      }

      alert("RSVP submitted successfully! Thank you for confirming.");
      
      // Update result to show already submitted
      setResult((prev) => prev ? { ...prev, alreadySubmitted: true } : null);
      
      // Reset form but keep modal open to show locked state
      setShowForm(false);
      setShowConfirmation(false);
      setFormData({ attending: null, guestCount: 1, dietaryRestrictions: "", allergies: "", specialRequests: "", wish: "" });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Error submitting RSVP. Please try again.");
      setShowConfirmation(true); // Show confirmation again if error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>

            {!result ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-gray-800">Guest Lookup</h2>
                <p className="text-gray-600">Searching for {query}...</p>
              </div>
            ) : result.alreadySubmitted ? (
              <div className="space-y-6">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-serif text-gray-800 mb-2">Hello, {result.guest!.fullName}!</h2>
                    <p className="text-gray-700 text-sm font-semibold mb-2">Your RSVP has already been submitted.</p>
                    <p className="text-gray-600 text-sm"><strong>Status:</strong> Done</p>
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    You can request changes on the information you sent by contacting the wedding couple.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-700 text-sm font-semibold mb-1">⛔ The form is locked.</p>
                  <p className="text-gray-600 text-sm">✔ Only the wedding couple (admin) can reset it.</p>
                </div>
                <button onClick={onClose} className="w-full py-3 bg-gray-400 text-white rounded-lg font-medium hover:bg-gray-500">
                  Close
                </button>
              </div>
            ) : !result.found ? (
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-serif text-gray-800 mb-2">Not Found</h2>
                    <p className="text-gray-600">Sorry, "{query}" is not on the guest list.</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-full py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400">
                  Close
                </button>
              </div>
            ) : !showConfirmation && !showForm ? (
              <div className="space-y-6">
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-serif text-gray-800 mb-2">Welcome, {result.guest!.fullName}!</h2>
                    <p className="text-gray-600 text-sm">We found you on our guest list.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                >
                  Fill RSVP Information
                </button>
              </div>
            ) : showConfirmation ? (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h2 className="text-xl font-serif text-gray-800 mb-4">Confirm Your RSVP</h2>
                  <p className="text-gray-700 mb-4">
                    Are you sure all information is correct? Once submitted you cannot edit unless the wedding couple resets your RSVP.
                  </p>
                  <div className="bg-white rounded p-3 mb-4 border border-gray-200 text-sm space-y-1">
                    <p><strong>Attending:</strong> {formData.attending === "yes" ? "Yes" : "No"}</p>
                    {formData.attending === "yes" && <p><strong>Guests:</strong> {formData.guestCount}</p>}
                    {formData.dietaryRestrictions && <p><strong>Dietary:</strong> {formData.dietaryRestrictions}</p>}
                    {formData.allergies && <p><strong>Allergies:</strong> {formData.allergies}</p>}
                    {formData.specialRequests && <p><strong>Requests:</strong> {formData.specialRequests}</p>}
                    {formData.wish && <p><strong>Wish:</strong> {formData.wish}</p>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400"
                  >
                    Review Again
                  </button>
                  <button
                    onClick={() => handleSubmitRsvp()}
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRsvp} className="space-y-4">
                <h2 className="text-2xl font-serif text-gray-800 mb-6">RSVP Details</h2>

                {/* Attending */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-800">Will you be attending?</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: "yes" })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        formData.attending === "yes"
                          ? "bg-rose-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: "no" })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        formData.attending === "no"
                          ? "bg-gray-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Guest Count */}
                {formData.attending === "yes" && (
                  <div className="space-y-2">
                    <label className="block font-semibold text-gray-800">Number of guests (including you)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                    />
                  </div>
                )}

                {/* Dietary Restrictions */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-800">Dietary Restrictions</label>
                  <input
                    type="text"
                    placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                  />
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-800">Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g., Peanuts, Shellfish"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                  />
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-800">Special Requests</label>
                  <textarea
                    placeholder="Any special requests or messages?"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600 resize-none h-24"
                  />
                </div>

                {/* Wedding Wish */}
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-800">Wedding Wish (Optional)</label>
                  <textarea
                    placeholder="Share your wishes and congratulations for the happy couple..."
                    value={formData.wish}
                    onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600 resize-none h-20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  disabled={formData.attending === null}
                  className="w-full py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ===========================================================
   MAIN COMPONENT
   =========================================================== */

export default function MinimalistWeddingInvitation(): JSX.Element {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [lookupName, setLookupName] = useState("");

  return (
    <div className="min-h-screen bg-white text-gray-800 font-serif overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${ASSETS.hero}')`,
            filter: "brightness(0.5)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto"
        >
          <p className="text-sm tracking-widest uppercase mb-4 opacity-90">Together with their parents</p>
          <h1 className="text-6xl md:text-8xl font-light mb-4 leading-tight">
            {COUPLE_INFO.bride}
            <br />
            <span className="flex items-center justify-center gap-4 my-4">
              <span className="w-12 h-px bg-white" />
              <Heart className="w-8 h-8" />
              <span className="w-12 h-px bg-white" />
            </span>
            {COUPLE_INFO.groom}
          </h1>
          <p className="text-lg opacity-80 tracking-wide">{COUPLE_INFO.date}</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <div>
              <p className="text-rose-600 text-sm tracking-widest uppercase mb-4">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-light mb-6">A Love Story</h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              We met in a moment that changed everything. What started as a chance encounter became a beautiful journey of love, laughter, and endless memories. 
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Today, we celebrate this incredible bond and invite you to be part of our special day as we unite our families and futures.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="h-96 rounded-lg overflow-hidden shadow-xl">
            <img src={ASSETS.couple} alt="Couple" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      </section>

      {/* WEDDING DETAILS SECTION */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-rose-600 text-sm tracking-widest uppercase mb-4">Details</p>
            <h2 className="text-4xl md:text-5xl font-light">Wedding Day</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Ceremony */}
            <motion.div
              variants={fadeInUp}
              className="space-y-4 p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-light text-rose-600">Ceremony</h3>
              <div className="flex gap-4 items-start">
                <Calendar className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">{COUPLE_INFO.date}</p>
                  <p className="text-gray-600">{COUPLE_INFO.time}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Sacred Heart Church</p>
                  <p className="text-gray-600">Manila</p>
                </div>
              </div>
            </motion.div>

            {/* Reception */}
            <motion.div
              variants={fadeInUp}
              className="space-y-4 p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-light text-rose-600">Reception</h3>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">6:00 PM</p>
                  <p className="text-gray-600">Cocktail & Dinner</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">The Palace Hotel</p>
                  <p className="text-gray-600">Makati</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div variants={fadeInUp} className="mt-12 text-center space-y-4">
            <p className="text-gray-600">
              <span className="font-semibold">Dress Code:</span> {COUPLE_INFO.dressCode}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We kindly request that you arrive 15 minutes early. Light snacks and refreshments will be served before the ceremony.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-rose-600 text-sm tracking-widest uppercase mb-4">Moments</p>
            <h2 className="text-4xl md:text-5xl font-light">Our Memories</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {ASSETS.gallery.map((image, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <img src={image} alt={`Memory ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* GUEST INFORMATION */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-rose-600 text-sm tracking-widest uppercase mb-4">RSVP</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6">Join Our Celebration</h2>
            <p className="text-gray-600">Kindly confirm your attendance by June 1, 2026</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-md space-y-4">
            <div className="flex gap-2">
              <input
                value={lookupName}
                onChange={(e) => setLookupName(e.target.value)}
                placeholder="Enter your full name..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
              />
              <button
                onClick={() => setRsvpOpen(true)}
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                <Search size={18} /> Search
              </button>
            </div>
            <p className="text-sm text-gray-500">Check if you're on our guest list and confirm your attendance.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* VENUE MAP SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <p className="text-rose-600 text-sm tracking-widest uppercase mb-4">Location</p>
            <h2 className="text-4xl md:text-5xl font-light">Where It All Happens</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="h-96 rounded-lg overflow-hidden shadow-xl">
            <iframe
              title="Venue Map"
              src="https://maps.google.com/maps?q=makati,+manila&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <section className="py-16 px-6 bg-white border-t border-gray-200 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-2xl font-light text-gray-800">Thank You</p>
          <p className="text-gray-600">
            We look forward to celebrating with you on our special day.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <a href="mailto:contact@wedding.com" className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Mail size={20} className="text-gray-600" />
            </a>
          </div>
          <p className="text-sm text-gray-500 pt-8">© 2026 Maria Clara & Juan Miguel. All rights reserved.</p>
        </motion.div>
      </section>

      {/* RSVP Modal */}
      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} query={lookupName} />
    </div>
  );
}
