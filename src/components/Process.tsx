import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Tell Us Your Story",
    description: "Share your details, theme, and inspirations.",
  },
  {
    number: "02",
    title: "We Design Your Website",
    description: "Made from scratch just for you.",
  },
  {
    number: "03",
    title: "You Approve & We Launch",
    description: "We finalize the design and publish.",
  },
  {
    number: "04",
    title: "You Share the Love",
    description: "Send one link—guests can RSVP instantly.",
  },
];

export function Process() {
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
        staggerChildren: 0.12,
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
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From concept to celebration in four simple steps
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative text-center space-y-4"
            >
              {/* Animated circle background */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent border-2 border-accent/30 mb-4 relative z-10"
                whileHover={{
                  scale: 1.15,
                  backgroundColor: "var(--accent-light)",
                  boxShadow: "0 0 20px rgba(var(--accent), 0.4)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.span
                  className="text-2xl font-bold text-black dark:text-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ delay: 0.1 + index * 0.12, duration: 0.5 }}
                >
                  {step.number}
                </motion.span>
              </motion.div>

              <motion.h3
                className="text-xl font-semibold"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.2 + index * 0.12 }}
              >
                {step.title}
              </motion.h3>

              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 + index * 0.12 }}
              >
                {step.description}
              </motion.p>

              {/* Animated connecting line */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-accent/50 to-transparent"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                  transition={{
                    delay: 0.4 + index * 0.12,
                    duration: 0.6,
                  }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
