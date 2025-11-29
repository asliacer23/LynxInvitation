import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Serenity",
    type: "Wedding Website Package",
    price: "₱1,499",
    originalPrice: "₱2,500",
    description: "Mini Website + Animated Video Invitation",
    tagline: "A sleek mini-website paired with a personalized animated video. Delivered in a premium online envelope—ready to share instantly.",
    features: [
      "Mini website",
      "RSVP tracking",
      "Email notifications",
      "Guest messages",
      "Online envelope linked to video invite",
      "Customized Google Form header",
      "Venue info",
      "1-year website access",
      "Monogram",
    ],
    videoFeatures: [
      "Landing Page",
      "Save the Date",
      "Location",
      "Dress Code",
      "Gift Guide & Reminders",
      "RSVP Page",
    ],
    highlighted: false,
  },
  {
    name: "Infinity",
    type: "Wedding Website Package",
    price: "₱1,899",
    originalPrice: "₱1,999",
    description: "Full Wedding Website",
    tagline: "Perfect for couples who want everything in one place—your love story, timeline, entourage, venue details, gallery, and more.",
    features: [
      "Customized full website",
      "RSVP tracking via Google Forms + Sheets",
      "Email notifications for each RSVP",
      "Guest message section",
      "Online envelope",
      "Customized Google Form header",
      "Gallery (up to 16 photos + Save-the-Date video)",
      "Venue info (Waze + Google Maps)",
      "Wedding timeline",
      "Love story section",
      "Entourage list",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music integration",
      "Countdown timer",
      "QR codes",
      "1-year access after the event",
    ],
    highlighted: true,
  },
  {
    name: "Legality",
    type: "Debut Website Package",
    price: "₱1,799",
    originalPrice: "₱2,300",
    description: "Full Debut Website",
    tagline: "A complete digital debut experience. Showcase your 18 Roses, 18 Candles, 18 Treasures, and more—all in a stunning layout.",
    features: [
      "Customized full debut website",
      "RSVP tracking",
      "Online envelope",
      "Guest messages",
      "Customized Google Form header",
      "Venue info",
      "Gallery (up to 16 photos + save-the-date video)",
      "18 Roses",
      "18 Candles",
      "18 Treasures",
      "18 Blue Bills",
      "Event timeline",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music",
      "Countdown",
      "QR codes",
      "1-year access",
    ],
    highlighted: false,
  },
  {
    name: "Felicity",
    type: "Birthday Website Package",
    price: "₱1,799",
    originalPrice: "₱2,300",
    description: "Full Birthday Website",
    tagline: "Perfect for all ages—1st, 18th, 21st, 30th, or 60th! Highlight memories, messages, galleries, timelines, and more.",
    features: [
      "Customized full birthday website",
      "RSVP tracking",
      "Online envelope",
      "Guest messages",
      "Customized Google Form header",
      "Venue/Party details",
      "Photo gallery (up to 16 photos + video)",
      "Guest birthday wishes board",
      "Event timeline",
      "Age milestone display",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music & video integration",
      "Countdown timer",
      "QR codes",
      "1-year access",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <>
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto" ref={ref}>
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Choose Your <span className="text-gradient">Perfect Package</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Beautifully designed digital invitations at unbeatable prices
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`card-3d relative p-6 cursor-pointer transition-all duration-300 overflow-hidden ${
                    plan.highlighted
                      ? "border-accent shadow-[0_0_30px_hsl(var(--cyber-glow)/0.3)] scale-105 hover:scale-110"
                      : "border-cyber-border hover:border-accent/50"
                  } bg-card flex flex-col hover:shadow-lg group`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {/* Animated gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {plan.highlighted && (
                    <motion.div
                      className="absolute top-6 right-6 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full z-20"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      Most Popular
                    </motion.div>
                  )}

                  <div className="space-y-4 flex-1 flex flex-col relative z-10">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-xs text-muted-foreground mb-1">{plan.type}</p>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm font-semibold text-foreground mb-2">{plan.description}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{plan.tagline}</p>
                    </motion.div>

                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-2xl line-through text-muted-foreground">{plan.originalPrice}</span>
                      <Badge variant="destructive" className="text-xs">SALE</Badge>
                    </div>

                    <motion.div
                      className="flex items-baseline gap-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">one-time</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full mt-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      >
                        View Details
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedPlan && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedPlan(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card 
              className="w-full max-w-4xl bg-card border-accent shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 space-y-6">
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedPlan(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Header */}
                <motion.div
                  className="space-y-3 pr-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-sm text-muted-foreground">{selectedPlan.type}</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-accent">{selectedPlan.name}</h2>
                    {selectedPlan.highlighted && (
                      <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{selectedPlan.description}</p>
                </motion.div>

                {/* Price Section */}
                <motion.div
                  className="bg-secondary/50 rounded-lg p-6 space-y-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold tracking-tight">{selectedPlan.price}</span>
                    <div className="space-y-1 mb-2">
                      <p className="text-sm line-through text-muted-foreground">{selectedPlan.originalPrice}</p>
                      <p className="text-sm text-muted-foreground">one-time payment</p>
                    </div>
                  </div>
                </motion.div>

                {/* Full Description */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-muted-foreground leading-relaxed">{selectedPlan.tagline}</p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold">What's Included</h3>
                  <motion.div
                    className="grid md:grid-cols-2 gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {selectedPlan.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Video Features (for Serenity) */}
                {selectedPlan.videoFeatures && selectedPlan.videoFeatures.length > 0 && (
                  <motion.div
                    className="space-y-4 pt-4 border-t border-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-lg font-bold">Animated Video Invitation Includes</h3>
                    <motion.div
                      className="grid md:grid-cols-2 gap-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {selectedPlan.videoFeatures.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
                        >
                          <Check className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* CTA Buttons */}
                <motion.div
                  className="flex gap-3 pt-6 border-t border-secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-base"
                      onClick={() => {
                        alert(`Proceeding to order ${selectedPlan.name}`);
                      }}
                    >
                      Order {selectedPlan.name}
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline"
                      className="w-full h-12 text-base"
                      onClick={() => setSelectedPlan(null)}
                    >
                      Close
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
