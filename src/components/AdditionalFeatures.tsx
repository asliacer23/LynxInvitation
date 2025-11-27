import { Lock, UserCheck } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const additionalFeatures = [
  {
    icon: Lock,
    title: "Password-Protected Website",
    price: "₱199",
    description: "Keep your event private. Only guests with your password can access your invitation website.",
  },
  {
    icon: UserCheck,
    title: "Find My Invitation (Guest Validation)",
    price: "₱600 per 100 pax",
    description: "Limit uninvited RSVPs. Only guests on your official list can open the website and instantly see their seat count.",
  },
];

export function AdditionalFeatures() {
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
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Make Your Invitation <span className="text-gradient">Extra Secure & Exclusive</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Add an extra layer of privacy and control to your event
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="card-3d relative p-8 border-cyber-border bg-card hover:bg-card/80 overflow-hidden h-full"
              >
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent relative z-10"
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>

                <motion.h3
                  className="text-xl font-bold mb-2 relative z-10"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  className="text-2xl font-bold text-accent mb-3 relative z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {feature.price}
                </motion.p>

                <motion.p
                  className="text-muted-foreground relative z-10"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {feature.description}
                </motion.p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-sm text-muted-foreground italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          Note: Limited slots per month. Rates may change without notice.
        </motion.p>
      </div>
    </section>
  );
}
