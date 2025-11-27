import { motion } from "framer-motion";

export function Cookies() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 28, 2025</p>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">What Are Cookies?</h3>
              <p className="text-muted-foreground text-sm">
                Cookies are small files stored on your device that help us remember your preferences and improve your experience on LynxInvitation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Types of Cookies We Use</h3>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li><strong>Essential:</strong> Required for site functionality</li>
                <li><strong>Analytics:</strong> Help us understand how you use our service</li>
                <li><strong>Preference:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing:</strong> Track your interests for personalized content</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Your Cookie Choices</h3>
              <p className="text-muted-foreground text-sm mb-3">
                You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent.
              </p>
              <p className="text-muted-foreground text-sm">
                However, disabling cookies may affect the functionality of our service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Third-Party Cookies</h3>
              <p className="text-muted-foreground text-sm">
                We may allow third parties to place cookies on your device for analytics and advertising purposes. These third parties have their own cookie policies.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 p-6 rounded-lg border border-cyber-border bg-background/50">
            <h3 className="font-semibold mb-3">Cookie Preferences</h3>
            <button className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors text-sm">
              Manage Cookie Preferences
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
