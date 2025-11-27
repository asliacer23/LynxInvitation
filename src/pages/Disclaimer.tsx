import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Disclaimer</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 28, 2025</p>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg border border-yellow-500/30 bg-yellow-50/5"
            >
              <div className="flex gap-4 items-start">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Important Notice</h3>
                  <p className="text-muted-foreground text-sm">
                    This disclaimer outlines the terms under which LynxInvitation is provided. By using our service, you agree to the conditions stated herein.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">No Warranty</h3>
              <p className="text-muted-foreground text-sm">
                LynxInvitation is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground text-sm">
                In no event shall LynxInvitation be liable for any damages arising from the use or inability to use the service, including but not limited to data loss or business interruption.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">External Links</h3>
              <p className="text-muted-foreground text-sm">
                LynxInvitation may contain links to external websites. We are not responsible for the content or practices of these external sites.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">User Content</h3>
              <p className="text-muted-foreground text-sm">
                Users are solely responsible for content they upload or create. LynxInvitation is not liable for user-generated content that may violate third-party rights.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Changes to Service</h3>
              <p className="text-muted-foreground text-sm">
                We reserve the right to modify or discontinue the service at any time, with or without notice.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 p-6 rounded-lg border border-cyber-border bg-background/50">
            <h3 className="font-semibold mb-3">Contact Us</h3>
            <p className="text-muted-foreground text-sm">
              For questions about this disclaimer, contact us at legal@lynxinvitation.com
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
