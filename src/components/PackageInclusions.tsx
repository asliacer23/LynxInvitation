import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const packages = [
  {
    name: "Infinity – Full Wedding Website",
    features: [
      "Customized full website",
      "RSVP tracking via Google Forms + Sheets",
      "Email notifications for each RSVP",
      "Guest message section",
      "Online envelope",
      "Customized Google Form header",
      "Gallery (up to 16 photos + Save-the-Date video)",
      "Venue info (Waze + Google Maps)",
      "Wedding timeline",
      "Love story section",
      "Entourage list",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music integration",
      "Countdown timer",
      "QR codes",
      "1-year access after the event",
    ],
  },
  {
    name: "Serenity – Mini Wedding Website",
    features: [
      "Mini website",
      "RSVP tracking",
      "Email notifications",
      "Guest messages",
      "Online envelope linked to video invite",
      "Customized Google Form header",
      "Venue info",
      "1-year website access",
      "Monogram",
    ],
    videoFeatures: [
      "Landing Page",
      "Save the Date",
      "Location",
      "Dress Code",
      "Gift Guide & Reminders",
      "RSVP Page",
    ],
  },
  {
    name: "Legality – Full Debut Website",
    features: [
      "Customized full debut website",
      "RSVP tracking",
      "Online envelope",
      "Guest messages",
      "Customized Google Form header",
      "Venue info",
      "Gallery (up to 16 photos + save-the-date video)",
      "18 Roses",
      "18 Candles",
      "18 Treasures",
      "18 Blue Bills",
      "Event timeline",
      "Dress code",
      "Gift guide",
      "FAQs",
      "Music",
      "Countdown",
      "QR codes",
      "1-year access",
    ],
  },
  {
    name: "Felicity – Full Birthday Website",
    features: [
      "Customized full birthday website",
      "RSVP tracking via Google Forms + Sheets",
      "Email notifications",
      "Guest message section",
      "Online envelope",
      "Customized Google Form header",
      "Gallery (up to 16 photos + video)",
      "Venue info (Waze + Google Maps)",
      "Event timeline",
      "Memory highlights",
      "Dress code",
      "Gift guide",
      "Music integration",
      "Countdown timer",
      "QR codes",
      "1-year access",
    ],
  },
];

export function PackageInclusions() {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            What's <span className="text-gradient">Included</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need for a stunning digital invitation
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {packages.map((pkg, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-cyber-border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                {pkg.name}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 pt-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                {pkg.videoFeatures && (
                  <div className="mt-6 pt-6 border-t border-cyber-border">
                    <p className="font-semibold mb-3 text-sm">6-Page Animated Video Invitation:</p>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                      {pkg.videoFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
