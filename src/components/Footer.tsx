import { Facebook, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
  const socials = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61584154962667",
      color: "hover:text-blue-600",
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      url: "https://tiktok.com/@LynxInvitation",
      color: "hover:text-black dark:hover:text-white",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/LynxInvitation",
      color: "hover:text-pink-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative border-t border-cyber-border bg-gradient-to-b from-background to-background/80 backdrop-blur-md">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="flex flex-col gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Top Section: Brand + Newsletter */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 group w-fit cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-accent/10 dark:bg-accent/20 hover:scale-110 transition-transform duration-300">
                  <img 
                    src="/favicon.ico" 
                    alt="LynxInvitation Logo" 
                    className="h-6 w-6 md:h-7 md:w-7 brightness-0 dark:brightness-100" 
                  />
                </div>
                <span className="text-lg md:text-xl font-bold tracking-tight text-black dark:text-white">
                  LynxInvitation
                </span>
              </motion.div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Create stunning digital invitations for your special moments. Modern, elegant, and unforgettable.
              </p>
            </div>

            {/* Newsletter CTA */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-foreground">
                Get updates & special offers
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-cyber-border bg-background/50 
                           text-sm placeholder:text-muted-foreground focus:outline-none 
                           focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium 
                           hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Middle Section: Links Grid - NO DUPLICATES */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Features", href: "/#features" },
                  { label: "Pricing", href: "/#pricing" },
                  { label: "Templates", href: "#" },
                  { label: "Documentation", href: "/docs" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground 
                               transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-200 -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground 
                               transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-200 -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Disclaimer", href: "/disclaimer" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground 
                               transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-200 -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-transparent via-cyber-border to-transparent" />

          {/* Bottom Section: Socials + Copyright */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            {/* Socials */}
            <div className="flex items-center gap-6">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-lg border border-cyber-border bg-background/50 
                             text-muted-foreground ${social.color} transition-all duration-200 
                             hover:border-accent/50 hover:bg-accent/5`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>

            {/* Copyright & Contact */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>© 2025 LynxInvitation. All rights reserved.</p>
              <span className="hidden sm:block h-4 w-px bg-cyber-border" />
              <a
                href="mailto:contact@lynxinvitation.com"
                className="hover:text-accent transition-colors duration-200 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
