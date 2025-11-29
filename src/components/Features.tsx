import { Zap, Smartphone, Palette, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant creation and delivery. Your guests receive invitations immediately.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect viewing experience on any device. Responsive and beautiful.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Tailor every detail to match your unique style and theme.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share via link, email, or social media. Track RSVPs in real-time.",
  },
];

export function Features() {
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
        staggerChildren: 0.1,
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
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Why <span className="text-gradient">LynxInvitation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We believe beautiful invitations shouldn't be expensive. LynxInvitation designs digital event websites that reflect your vibe and story—whether you're celebrating a wedding, debut, birthday, or milestone.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-3d group relative p-6 rounded-xl border border-cyber-border bg-card hover:bg-card/80 overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/10 to-purple-500/10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors relative z-10"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className="h-6 w-6 text-black dark:text-white" />
              </motion.div>

              <motion.h3
                className="text-xl font-semibold mb-2 relative z-10"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                className="text-muted-foreground relative z-10"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
