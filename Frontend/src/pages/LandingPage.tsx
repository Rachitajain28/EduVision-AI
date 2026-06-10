import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import LandingNavbar from "@/components/LandingNavbar";
import foxyMascot from "@/assets/foxy-mascot.png";
import foxyVideo from "@/assets/foxy-animated.webm";
import { BookOpen, Brain, BarChart3, Compass, Sparkles, Zap, Target, ArrowRight, Linkedin } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

const features = [
  { icon: Brain, title: "Learning Style Detection", desc: "Discover how you learn best with our AI-powered quiz", color: "bg-secondary" },
  { icon: BookOpen, title: "AI Study Summarizer", desc: "Instantly summarize complex study materials", color: "bg-accent" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Track grades, study hours, and quiz scores", color: "bg-highlight" },
  { icon: Compass, title: "Career Recommendations", desc: "Get personalized career paths based on your skills", color: "bg-rose" },
  { icon: Zap, title: "Flashcards System", desc: "Interactive flip cards for quick revision", color: "bg-badge" },
  { icon: Target, title: "Gamified Learning", desc: "Earn XP, badges, and maintain streaks", color: "bg-primary" },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds" },
  { num: "02", title: "Take the Quiz", desc: "Discover your unique learning style" },
  { num: "03", title: "Study Smart", desc: "Use AI tools to boost your learning" },
  { num: "04", title: "Track & Grow", desc: "Monitor progress and level up" },
];

const ScrollCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.18)" }}
      className={`transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const AnimatedButton = ({ to, children, primary = false }: { to: string; children: React.ReactNode; primary?: boolean }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
    <Link
      to={to}
      className={`group relative overflow-hidden px-8 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2 transition-all duration-300 ${primary
        ? "gradient-primary hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)]"
        : "glass-card hover:shadow-[0_0_20px_hsl(var(--secondary)/0.3)]"
        }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {primary && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
      </span>
      {primary && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      )}
    </Link>
  </motion.div>
);

const LandingPage = () => {
  const loggedIn = isAuthenticated();

  return (
    <div className="min-h-screen">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-40 right-1/4 w-20 h-20 bg-rose/30 rounded-full blur-2xl animate-float" />

        <div className="relative container mx-auto px-4 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/60 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" /> AI-Powered Learning Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Learn Smarter with{" "}
                <span className="text-gradient">EduVision AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-muted-foreground text-lg leading-relaxed"
              >
                AI-powered personalized learning and career guidance for students.
                Discover your learning style, generate summaries, and track your growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <AnimatedButton to={loggedIn ? "/dashboard" : "/signup"} primary>
                  Start Learning
                </AnimatedButton>
                <AnimatedButton to={loggedIn ? "/dashboard" : "/login"}>
                  Explore Dashboard
                </AnimatedButton>
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative flex justify-center"
            >
              <motion.div
                className="relative w-64 md:w-80 lg:w-96"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <video src={foxyVideo} autoPlay loop muted playsInline className="w-full drop-shadow-2xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 right-0 md:right-4 glass-card-strong rounded-2xl rounded-br-sm px-5 py-3 max-w-[200px]"
              >
                <p className="text-sm font-medium">Hi! I'm Foxy 🦊</p>
                <p className="text-xs text-muted-foreground">Your AI learning companion.</p>
              </motion.div>

              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 left-0 text-3xl">📚</motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-10 left-5 text-3xl">⭐</motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-0 text-3xl">🧠</motion.div>
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-5 right-10 text-3xl">🎓</motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">Everything You Need to Excel</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollCard key={f.title} delay={i * 0.08} className="glass-card rounded-2xl p-6 group cursor-pointer">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <f.icon className="w-6 h-6 transition-transform duration-300 group-hover:animate-pulse" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </ScrollCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">How It Works</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2">Start Learning in 4 Steps</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <ScrollCard key={s.num} delay={i * 0.12} className="text-center">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                  className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl"
                >
                  {s.num}
                </motion.div>
                <h3 className="font-display font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </ScrollCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-display text-lg font-bold mb-1">EduVision AI</div>
              <p className="text-muted-foreground text-sm">Personalize • Learn • Grow</p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="https://www.linkedin.com/in/rachitaj28/" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" /> Rachita Jain
              </a>
              <a href="https://www.linkedin.com/in/rakhi-41a351283/" target="_blank" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" /> Rakhi
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
            © 2026 EduVision AI • Built with ❤️ by R2
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;