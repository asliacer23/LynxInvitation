import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Advanced animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--cyber-border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--cyber-border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: mousePosition.x / 20,
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
          x: -mousePosition.x / 20,
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge with animation */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-border bg-card/50 backdrop-blur-sm"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.div>
          <span className="text-sm text-muted-foreground">Next-Gen Digital Invitations</span>
        </motion.div>

        {/* Main heading with staggered text animation */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            <motion.span
              className="block text-gradient"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundSize: "200% 200%",
                backgroundImage: "linear-gradient(to right, #d4af37, #f4e4c1, #d4af37)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Next-Gen Digital Invitations
            </motion.span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Create Your Perfect Invitation
          </h2>
        </motion.div>

        {/* Description with fade-in */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Futuristic, minimal, and stunning digital invitations for your debut, wedding, or any milestone event. 
          Experience the next generation of celebration announcements.
        </motion.p>

        {/* CTA Button with hover animation */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="hero" size="xl" className="group">
              Start My E-Invite
              <motion.div
                className="ml-2 h-5 w-5"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats with staggered animation */}
        <motion.div
          variants={itemVariants}
          className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Instant Delivery</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <span>Fully Customizable</span>
          </motion.div>
        </motion.div>
      </motion.div>

      
    </section>
  );
}
