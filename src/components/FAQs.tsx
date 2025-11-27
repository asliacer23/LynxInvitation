import { useState, useMemo, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CreditCard,
  Layers,
  Globe,
  Calendar,
  FileText,
  Gift,
  Music,
  Users,
  Palette,
  BarChart3,
  RefreshCw,
  Search,
} from "lucide-react";

const faqs = [
  {
    icon: Clock,
    question: "How long does it take to build my digital invitation?",
    answer:
      "Work begins once all event details and photos are submitted.\n\n• Express Processing (₱500): 1–2 business days\n• Standard Timeline: 4–5 business days\n• If details are incomplete: 7–9 business days",
  },
  {
    icon: CreditCard,
    question: "Do I need to pay upfront?",
    answer:
      "Yes. A 50% non-refundable reservation fee is required. The remaining balance is paid after final approval.",
  },
  {
    icon: Layers,
    question: "How many revisions are included?",
    answer:
      "You receive 5 free revisions (2 design + 3 content).\n\nMinor changes: typos, replacing up to 5 photos, updating schedule, aligning elements.\nMajor changes: redesigning multiple sections, changing theme or layout, switching templates.",
  },
  {
    icon: Globe,
    question: "What will my website link look like?",
    answer:
      "Your invitation link will follow this format:\nwww.lynxinvitation.com/your-names\nCustom URLs may be requested.",
  },
  {
    icon: Calendar,
    question: "How long will my website remain accessible?",
    answer: "Your invitation remains online for 1 year. Renewal fee is ₱299/year.",
  },
  {
    icon: FileText,
    question: "What information do you need to start?",
    answer:
      "Event date, venue, theme, RSVP deadline, estimated guests, photos/videos, dress code, theme song, and optional hashtag.",
  },
  {
    icon: Gift,
    question: "What events can your system support?",
    answer:
      "Debuts, weddings, birthdays, anniversaries, baby showers, corporate events, and more.",
  },
  {
    icon: Music,
    question: "Can my invitation include music, videos, and animations?",
    answer:
      "Yes. The system supports background music, embedded videos, animations, and smooth transitions.",
  },
  {
    icon: Users,
    question: "Can multiple people access the invitation at the same time?",
    answer:
      "Yes. Since it's fully web-hosted, your invitation can handle multiple visitors simultaneously.",
  },
  {
    icon: Palette,
    question: "Can I request a custom design?",
    answer:
      "Yes. Full custom designs are available upon request with custom pricing.",
  },
  {
    icon: BarChart3,
    question: "Do you provide visitor or RSVP analytics?",
    answer:
      "Yes. Analytics such as visit count, RSVP submissions, and device-type tracking can be enabled.",
  },
  {
    icon: RefreshCw,
    question: "Can I update my website after it's published?",
    answer:
      "Yes. You may request updates anytime during the 1-year active period. Major changes may incur additional fees.",
  },
];

export function FAQs() {
  const [search, setSearch] = useState("");
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

  // Filter FAQ based on search input
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <section className="py-28 px-6 relative" ref={ref}>
      {/* Floating Panel Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Search or browse through the most common inquiries.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="relative max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <motion.input
              type="text"
              placeholder="Search a question..."
              className="w-full bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-base shadow-md focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              whileFocus={{ borderColor: "rgba(0, 200, 255, 0.4)" }}
            />
          </motion.div>
        </motion.div>

        {/* FAQ List */}
        <Accordion type="single" collapsible className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <AccordionItem
                      value={`faq-${index}`}
                      className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:shadow-[0_0_30px_rgba(0,200,255,0.2)] transition overflow-hidden"
                    >
                      <AccordionTrigger className="flex items-center gap-4 text-left text-lg font-semibold hover:no-underline group">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <faq.icon className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                        <span className="group-hover:text-cyan-300 transition-colors">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-muted-foreground whitespace-pre-line leading-relaxed mt-3"
                        >
                          {faq.answer}
                        </motion.p>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No results found for "{search}".
              </motion.p>
            )}
          </AnimatePresence>
        </Accordion>
      </div>
    </section>
  );
}
