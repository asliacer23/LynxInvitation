import { motion } from "framer-motion";
import { Newspaper, Calendar, MessageSquare, Tag } from "lucide-react";

export function Blog() {
  const posts = [
    {
      date: "Nov 28, 2025",
      category: "Tips",
      title: "5 Tips for Creating the Perfect Digital Invitation",
      excerpt: "Learn how to design invitations that stand out and impress your guests.",
      image: "from-blue-500/10 to-blue-600/10",
    },
    {
      date: "Nov 20, 2025",
      category: "Trends",
      title: "Digital Invitations Are Taking Over",
      excerpt: "See why more people are choosing digital over traditional paper invitations.",
      image: "from-pink-500/10 to-pink-600/10",
    },
    {
      date: "Nov 15, 2025",
      category: "Tutorial",
      title: "How to Host a Virtual Celebration",
      excerpt: "Complete guide to planning and executing a memorable virtual event.",
      image: "from-purple-500/10 to-purple-600/10",
    },
    {
      date: "Nov 10, 2025",
      category: "Case Study",
      title: "10,000 Invitations in 2025",
      excerpt: "How we helped thousands celebrate their special moments digitally.",
      image: "from-green-500/10 to-green-600/10",
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
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Blog & News</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stories, tips, and trends about digital invitations
          </p>
        </motion.div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-8">
          {posts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer"
            >
              <div className="p-8 rounded-xl border border-cyber-border bg-background/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 items-start">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${post.image}`} />
                    <div>
                      <div className="flex gap-2 items-center mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <span className="px-2 py-1 rounded-full text-xs bg-accent/10 text-accent font-medium">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{post.excerpt}</p>
                <button className="mt-4 text-accent hover:text-accent/80 transition-colors font-medium text-sm">
                  Read More →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-xl border border-cyber-border bg-gradient-to-r from-accent/10 to-accent/5 text-center"
        >
          <Newspaper className="h-8 w-8 mx-auto mb-4 text-accent" />
          <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mb-6">Get the latest tips and updates delivered to your inbox</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-lg border border-cyber-border bg-background focus:outline-none focus:border-accent/50"
            />
            <button className="px-6 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
