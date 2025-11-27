import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";

export function Terms() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 28, 2025</p>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Acceptance of Terms
              </h3>
              <p className="text-muted-foreground text-sm">
                By accessing and using LynxInvitation, you accept and agree to be bound by the terms of this agreement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                User Responsibilities
              </h3>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You agree not to use the service for unlawful purposes</li>
                <li>• You will not distribute harmful content or spam</li>
                <li>• You agree to comply with all applicable laws and regulations</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Intellectual Property</h3>
              <p className="text-muted-foreground text-sm">
                All content on LynxInvitation is owned or licensed by us. Invitations you create are your property, but you grant us permission to display and process them according to our service terms.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground text-sm">
                LynxInvitation is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages resulting from the use of our service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border border-cyber-border bg-background/50"
            >
              <h3 className="font-semibold mb-3">Termination</h3>
              <p className="text-muted-foreground text-sm">
                We reserve the right to terminate accounts that violate these terms. You may cancel your account at any time.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 p-6 rounded-lg border border-cyber-border bg-background/50">
            <h3 className="font-semibold mb-3">Questions?</h3>
            <p className="text-muted-foreground text-sm">
              Contact our legal team at legal@lynxinvitation.com for any questions about these terms.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
