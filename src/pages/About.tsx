import { motion } from "framer-motion";
import { Users, Target, Zap, Heart } from "lucide-react";

export function About() {
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
      transition: { duration: 0.6 },
    },
  };

  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge technology for modern celebrations",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We care deeply about making your moments special",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections through memorable invitations",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Delivering the highest quality digital experiences",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gradient"
          >
            About LynxInvitation
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            We're revolutionizing the way people celebrate life's special moments with stunning digital invitations.
          </motion.p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2024, LynxInvitation began with a simple vision: to transform how people announce their celebrations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We noticed that traditional invitations were outdated and impersonal. So we created a platform that brings elegance, innovation, and personalization to every milestone celebration.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, thousands of users trust us to create unforgettable digital invitation experiences for debuts, weddings, birthdays, and more.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="h-96 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-cyber-border flex items-center justify-center"
          >
            <div className="text-center text-muted-foreground">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Team Image Placeholder</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Values
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl border border-cyber-border bg-background/50 backdrop-blur-sm hover:border-accent/50 transition-colors"
                >
                  <Icon className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="rounded-2xl bg-gradient-to-r from-accent/10 to-accent/5 border border-cyber-border p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Create Magic?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users creating beautiful digital invitations for their special moments.
          </p>
          <button className="px-8 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
            Get Started Free
          </button>
        </motion.div>
      </section>
    </div>
  );
}
