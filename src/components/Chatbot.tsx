import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Send, X, Sparkles, Zap, HelpCircle, Package, Clock } from "lucide-react";
import { Button } from "./ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  { icon: Package, label: "Packages", query: "What packages do you offer?" },
  { icon: Zap, label: "Pricing", query: "How much do the packages cost?" },
  { icon: Clock, label: "Timeline", query: "What's your turnaround time?" },
  { icon: HelpCircle, label: "Revisions", query: "How many revisions are included?" },
];

const CHATBOT_RESPONSES: Record<string, string> = {
  // Greeting patterns
  hello: "👋 Hello! Welcome to LynxInvitation! I'm here to help you with any questions about our digital invitation services. What would you like to know?",
  hi: "👋 Hi there! Welcome to LynxInvitation! I'm your friendly assistant. How can I help you today?",
  hey: "👋 Hey! Thanks for reaching out. I'm here to answer questions about our wedding, debut, and birthday invitation packages.",

  // Services & Packages
  package: "📦 We offer 4 amazing packages:\n\n1. **Serenity** (₱1,499) - Mini Website + Animated Video\n2. **Infinity** (₱1,899) - Full Wedding Website\n3. **Legality** (₱1,799) - Full Debut Website\n4. **Felicity** (₱1,799) - Full Birthday Website\n\nWhich package interests you?",
  pricing: "💰 Here are our prices:\n• **Serenity**: ₱1,499 (was ₱2,500)\n• **Infinity**: ₱1,899 (was ₱1,999)\n• **Legality**: ₱1,799 (was ₱2,300)\n• **Felicity**: ₱1,799 (was ₱2,300)\n\nAll prices are one-time payments with no hidden fees!",
  infinity: "✨ **Infinity** is our premium Full Wedding Website (₱1,899)\n\nIncludes:\n✅ Customized full website\n✅ Love story section\n✅ Wedding timeline\n✅ Entourage showcase\n✅ Venue details with maps\n✅ Full photo gallery\n✅ Guest RSVP system\n✅ Gift registry integration\n✅ Music & video integration\n✅ 1-year access\n\nPerfect for couples who want everything!",
  serenity: "🌟 **Serenity** - Mini Website + Video (₱1,499)\n\nIncludes:\n✅ Custom mini website\n✅ Animated video invitation\n✅ Online envelope delivery\n✅ Basic gallery\n✅ Guest RSVP system\n✅ Venue information\n✅ 1-year access\n\nGreat for quick, elegant invitations!",
  legality: "👗 **Legality** - Full Debut Website (₱1,799)\n\nIncludes:\n✅ 18 Roses showcase\n✅ 18 Candles gallery\n✅ 18 Treasures display\n✅ Event timeline\n✅ Photo gallery\n✅ Guest RSVP\n✅ Dress code section\n✅ Gift guide\n✅ 1-year access\n\nPerfect for your debutante ball!",
  felicity: "🎂 **Felicity** - Birthday Website (₱1,799)\n\nIncludes:\n✅ Customized birthday site\n✅ Photo timeline\n✅ Guest messages board\n✅ RSVP management\n✅ Gallery section\n✅ Music & video embedding\n✅ Milestone highlights\n✅ Gift registry\n✅ 1-year access\n\nWorks for any age celebration!",

  // Turnaround time
  turnaround: "⏱️ **Our Turnaround Times:**\n\n🚀 **Rush Order** (+₱500): 1-2 business days\n⚡ **Standard**: 5 business days\n📝 **With incomplete details**: 7-9 business days\n\nWe start working immediately after you place your order!",
  "how long": "⏱️ We typically deliver your website in:\n• **1-2 days** (Rush)\n• **5 days** (Standard)\n• **7-9 days** (If details need gathering)\n\nWould you like rush delivery?",

  // Downpayment & payment
  downpayment: "💳 **Payment Structure:**\n\n• **50% upfront** (non-refundable) to secure your slot\n• **50% upon completion** after final approval\n\nThis ensures both you and us are committed to the project!",
  payment: "💳 We require a **50% non-refundable deposit** to secure your order date. The remaining **50% is due after final approval** of your website.\n\nThis protects your booking and ensures quality service!",

  // Revisions
  revision: "✏️ **Revision Policy:**\n\n**Free Revisions:** 5 total\n• 2 design revisions\n• 3 content revisions\n\n**Major revisions**: +30% of package price\n\nMinor examples: typos, date changes, photo swaps\nMajor examples: redesigning pages, theme changes",
  revisions: "✏️ You get **5 free revisions** total:\n• 2 design revisions\n• 3 content revisions\n\nEach major revision after that is +30% of your package price. We want you to be 100% happy with your website!",

  // URL & Website
  url: "🔗 **Your Website URL:**\n\nWe create unique links like:\nwww.lynxinvitation.com/your-names\n\nBased on your names unless you request otherwise. You can also customize it!",
  website: "🌐 Your custom website is included with every package! It features your personal invitation with all event details, photos, RSVP system, and more—all in one beautiful place!",

  // Duration & Renewal
  duration: "⏰ **Website Duration:**\n\n✅ **1 year included** with your purchase\n🔄 **Renewal**: ₱299/year after the first year\n\nYou get a full year to celebrate and share your memories!",
  access: "⏰ Your website stays active for **1 full year** from purchase. After that, renewals are just ₱299/year to keep it online. We also provide 1-year archives!",

  // What we need
  "what do you need": "📋 **To Get Started, We Need:**\n\n✅ Event date\n✅ Expected guest count\n✅ RSVP deadline\n✅ Preferred theme/style\n✅ Venue name & time\n✅ Photos or videos\n✅ Dress code\n✅ Song/music preference\n✅ Hashtag (optional)\n\nWe collect more details via Messenger/Instagram afterward!",
  start: "🚀 **Getting Started:**\n\n1. Choose your package\n2. Make 50% payment\n3. Share event details\n4. We design & customize\n5. You review & approve\n6. Get your live website!\n\nSimple as that! Want to proceed?",

  // Other events
  "other events": "🎉 **Yes! We Do Multiple Event Types:**\n\n💍 Weddings\n👗 Debutante balls\n🎂 Birthdays (any age)\n👶 Baby showers\n💍 Anniversaries\n🎊 Reunions\n📸 Family events\n\nAny celebration you have in mind!",
  events: "🎉 We can create invitations for almost any occasion - weddings, debuts, birthdays, anniversaries, baby showers, and more! Tell us about your event!",

  // Features
  rsvp: "📝 **RSVP Features:**\n\n✅ Guest tracking via Google Forms\n✅ Real-time responses\n✅ Dietary restrictions collection\n✅ Guest count management\n✅ Email notifications\n✅ Export to sheets for easy organization\n\nNo more manual counting!",
  gallery: "🖼️ **Gallery Features:**\n\n✅ Up to 16 photos per package\n✅ Save-the-date video\n✅ Lightbox/carousel viewing\n✅ Mobile optimized\n✅ High quality display\n✅ Easy photo management\n\nShowcase your memories beautifully!",

  // Contact & Support
  contact: "📞 **Get In Touch:**\n\n💬 Messenger\n📱 Instagram DM\n💌 Email\n🌐 Website chat\n\nWe're here to help! What's your question?",
  help: "🆘 **How Can I Help?**\n\nI can answer questions about:\n• Our packages & pricing\n• Turnaround times\n• Features included\n• Payment & revisions\n• Getting started\n• Technical support\n\nWhat would you like to know?",

  // Customization
  custom: "🎨 **Customization:**\n\nEverything is customized for you:\n✅ Your chosen theme\n✅ Your colors & style\n✅ Your photos & content\n✅ Your event details\n✅ Your personal touch\n\nEach website is unique to your celebration!",

  // Video
  video: "🎬 **Animated Video Feature:**\n\nAvailable with Serenity package:\n✅ Professional animation\n✅ Custom content\n✅ Music integration\n✅ Shareable link\n✅ Premium presentation\n\nMake your save-the-date shine!",

  // Default response
  default: "Great question! 🤔 I can help with:\n• Package info & pricing\n• Features & services\n• Turnaround times\n• Getting started\n• Customization options\n\nCould you be more specific? Or type 'menu' to see all topics!",
};

export function Chatbot() {
  const location = useLocation();
  
  // Only show chatbot on homepage
  if (location.pathname !== "/") {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi! I'm LynxInvitation's assistant. How can I help you today? Feel free to ask about our packages, pricing, features, or anything else!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for exact matches first
    if (CHATBOT_RESPONSES[lowerMessage]) {
      return CHATBOT_RESPONSES[lowerMessage];
    }

    // Check for keyword matches
    const keywords: Record<string, string[]> = {
      package: ["package", "what do you offer", "services", "options"],
      pricing: ["price", "cost", "how much", "expensive", "cheap"],
      infinity: ["infinity", "full wedding"],
      serenity: ["serenity", "mini wedding", "video"],
      legality: ["legality", "debut"],
      felicity: ["felicity", "birthday"],
      turnaround: ["turnaround", "how long", "days", "rush", "fast"],
      downpayment: ["downpayment", "deposit", "payment", "cost"],
      revision: ["revision", "change", "edit", "modify"],
      url: ["url", "link", "website address", "domain"],
      duration: ["duration", "how long", "access", "year", "renew"],
      "what do you need": ["what do you need", "information", "details", "require", "start"],
      "other events": ["birthday", "anniversary", "baby shower", "other events", "events"],
      rsvp: ["rsvp", "guests", "tracking", "responses"],
      gallery: ["gallery", "photos", "images", "pictures"],
      contact: ["contact", "reach", "phone", "email"],
      custom: ["custom", "personalize", "unique"],
      video: ["video", "animation", "animated"],
    };

    for (const [key, keywordList] of Object.entries(keywords)) {
      if (keywordList.some((keyword) => lowerMessage.includes(keyword))) {
        return CHATBOT_RESPONSES[key] || CHATBOT_RESPONSES.default;
      }
    }

    return CHATBOT_RESPONSES.default;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = findBestResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Chat Button - Advanced Black & White */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group"
          aria-label="Open chat"
        >
          {/* Button Container */}
          <div className="relative w-16 h-16 rounded-full bg-black border border-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 cursor-pointer overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-1 rounded-full border border-white/20"></div>
            
            {/* Logo as main icon */}
            <img
              src="/favicon.ico"
              alt="LynxInvitation"
              className="w-8 h-8 rounded-full group-hover:scale-125 transition-transform duration-300 relative z-10"
            />
            
            {/* Animated pulse dot */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white border border-black rounded-full animate-pulse shadow-md"></div>
          </div>
        </button>
      )}

      {/* Chat Window - Advanced Design */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[90vh] rounded-3xl overflow-hidden flex flex-col bg-black border border-white shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-500">
          
          {/* Header */}
          <div className="bg-black border-b border-white/20 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/favicon.ico"
                  alt="LynxInvitation"
                  className="w-9 h-9 rounded-lg border border-white/50"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  
                  LynxChat Pro
                </h3>
                <p className="text-white/60 text-xs">Advanced AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/70 hover:text-white"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions - Show on first message only */}
          {messages.length === 1 && !isLoading && (
            <div className="bg-black border-b border-white/10 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Quick Suggestions</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const userMessage: Message = {
                          id: Date.now().toString(),
                          text: suggestion.query,
                          sender: "user",
                          timestamp: new Date(),
                        };
                        setMessages((prev) => [...prev, userMessage]);
                        setIsLoading(true);
                        setTimeout(() => {
                          const botResponse = findBestResponse(suggestion.query);
                          const botMessage: Message = {
                            id: (Date.now() + 1).toString(),
                            text: botResponse,
                            sender: "bot",
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, botMessage]);
                          setIsLoading(false);
                        }, 500);
                      }}
                      className="relative group px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-200 overflow-hidden flex flex-col items-center gap-2"
                    >
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-full group-hover:translate-x-full"></div>
                      
                      <Icon className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-200 relative z-10" />
                      <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors duration-200 text-center relative z-10">
                        {suggestion.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-black to-black/95">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src="/favicon.ico"
                      alt="LynxChat"
                      className="w-5 h-5 rounded-sm"
                    />
                  </div>
                )}
                
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 ${
                    message.sender === "user"
                      ? "bg-white text-black rounded-br-none ml-auto"
                      : "bg-white/10 border border-white/20 text-white rounded-bl-none"
                  }`}
                >
                  {message.text.split("\n").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="/favicon.ico"
                    alt="LynxChat"
                    className="w-5 h-5 rounded-sm animate-spin"
                  />
                </div>
                <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl rounded-bl-none flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-white/20 bg-black p-4 space-y-3"
          >
            <div className="flex gap-2 group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all duration-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-semibold"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-white/50 text-xs text-center">Powered by LynxChat AI</p>
          </form>
        </div>
      )}
    </>
  );
}
