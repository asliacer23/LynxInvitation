import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export function Privacy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect information necessary to provide and improve our services, including account information, invitation data, and usage analytics.",
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "Your data is encrypted and protected with industry-standard security measures. We never sell your personal information to third parties.",
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your personal data at any time. Contact our privacy team for assistance.",
    },
    {
      icon: FileText,
      title: "Policy Updates",
      content: "We may update this policy periodically. Continued use of our service indicates acceptance of changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 28, 2025</p>

          <div className="space-y-8">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-lg border border-cyber-border bg-background/50"
                >
                  <div className="flex gap-4 items-start">
                    <Icon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{section.title}</h3>
                      <p className="text-muted-foreground text-sm">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 p-6 rounded-lg border border-cyber-border bg-background/50">
            <h3 className="font-semibold mb-3">Contact Privacy Team</h3>
            <p className="text-muted-foreground text-sm">
              For privacy inquiries, contact us at privacy@lynxinvitation.com
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
