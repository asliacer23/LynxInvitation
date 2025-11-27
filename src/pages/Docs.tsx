import { motion } from "framer-motion";
import { FileText, BookOpen, Code, Users } from "lucide-react";

export function Docs() {
  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics and set up your first invitation",
      items: ["Overview", "Quick Start", "Installation", "First Steps"],
    },
    {
      icon: Code,
      title: "Customization",
      description: "Customize templates and add your personal touch",
      items: ["Themes", "Colors", "Fonts", "Layouts"],
    },
    {
      icon: Users,
      title: "Sharing & Collaboration",
      description: "Share invitations and manage guest lists",
      items: ["Sharing Options", "Guest Management", "RSVP Tracking", "Analytics"],
    },
    {
      icon: FileText,
      title: "Support",
      description: "Get help and troubleshoot issues",
      items: ["FAQ", "Troubleshooting", "Contact Support", "Community"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guides and resources to help you create amazing invitations
          </p>
        </motion.div>
      </section>

      {/* Documentation Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-xl border border-cyber-border bg-background/50 backdrop-blur-sm hover:border-accent/50 transition-colors"
              >
                <Icon className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      → {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full px-6 py-3 rounded-lg border border-cyber-border bg-background/50 placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
          />
        </motion.div>
      </section>
    </div>
  );
}
