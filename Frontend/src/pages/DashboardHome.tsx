import { motion } from "framer-motion";
import { getCurrentUser } from "@/lib/auth";
import { BookOpen, Trophy, Brain, Compass, Flame, Star, Award, TrendingUp, Lightbulb, Target, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import foxyMascot from "@/assets/foxy-mascot.png";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Study Hours", value: "142", icon: BookOpen, color: "bg-secondary" },
  { label: "Quiz Score", value: "85%", icon: Trophy, color: "bg-accent" },
  { label: "Summaries", value: "23", icon: Brain, color: "bg-highlight" },
  { label: "Career Paths", value: "4", icon: Compass, color: "bg-rose" },
];

const weeklyActivity = [
  { day: "Mon", study: 4, quiz: 2 },
  { day: "Tue", study: 3, quiz: 1 },
  { day: "Wed", study: 5, quiz: 3 },
  { day: "Thu", study: 4, quiz: 2 },
  { day: "Fri", study: 6, quiz: 4 },
  { day: "Sat", study: 3, quiz: 1 },
  { day: "Sun", study: 2, quiz: 0 },
];

const aiInsights = [
  { title: "Performance Boost", text: "Your quiz scores have improved by 23% this week", icon: TrendingUp, color: "bg-green-100 dark:bg-green-900/30" },
  { title: "Focus Area", text: "Consider spending more time on complex topics", icon: Target, color: "bg-pink-100 dark:bg-pink-900/30" },
  { title: "Learning Path", text: "Recommended: Start Intermediate module next", icon: BookOpen, color: "bg-blue-100 dark:bg-blue-900/30" },
  { title: "Smart Tip", text: "Study for 45 mins then take a 15 min break", icon: Lightbulb, color: "bg-orange-100 dark:bg-orange-900/30" },
];

const achievements = [
  { name: "First Step", desc: "Complete your first quiz", icon: Star, unlocked: true, gradient: "from-yellow-300 to-amber-400" },
  { name: "Brain Power", desc: "Summarize 10 documents", icon: Zap, unlocked: true, gradient: "from-purple-400 to-violet-500" },
  { name: "Streak Master", desc: "7-day learning streak", icon: Flame, unlocked: false },
  { name: "Scholar", desc: "Reach level 10", icon: BookOpen, unlocked: false },
  { name: "Champion", desc: "Rank in top 10 leaderboard", icon: Trophy, unlocked: false },
];

const leaderboard = [
  { rank: 1, name: "Alex Chen", xp: 15240, emoji: "🥇" },
  { rank: 2, name: "Jordan Park", xp: 14820, emoji: "2" },
  { rank: 3, name: "You", xp: 12560, emoji: "3", isYou: true },
  { rank: 4, name: "Sam Wilson", xp: 11930, emoji: "4" },
  { rank: 5, name: "Taylor Swift", xp: 10450, emoji: "5" },
];

const quickActions = [
  { label: "Continue Quiz", icon: Brain, path: "/dashboard/continue-quiz" }, // ✅ updated
  { label: "Review Flashcards", icon: BookOpen, path: "/dashboard/flashcards" },
  { label: "Career Guide", icon: Compass, path: "/dashboard/career" },
]

const DashboardHome = () => {
  const user = getCurrentUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting with Foxy */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <motion.img
          src={foxyMascot}
          alt="Foxy"
          className="w-14 h-14 shrink-0"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            {greeting}, {user?.name?.split(" ")[0] || "Student"} 👋
          </h1>
          <p className="text-muted-foreground mt-0.5">
            🦊 Let's continue your learning streak today!
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5 hover-lift"
          >
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Gamification row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Flame className="w-8 h-8 text-destructive" />
            <div>
              <p className="font-bold text-lg">5 Days</p>
              <p className="text-xs text-muted-foreground">Learning Streak 🔥</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Star className="w-8 h-8 text-accent-foreground" />
            <div>
              <p className="font-bold text-lg">12,560 XP</p>
              <p className="text-xs text-muted-foreground">Experience Points ⭐</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Award className="w-8 h-8 text-primary" />
            <div>
              <p className="font-bold text-lg">2 Badges</p>
              <p className="text-xs text-muted-foreground">Achievements 🏆</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Activity Chart + AI Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="font-display font-semibold text-lg mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="study" fill="hsl(220, 60%, 25%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quiz" fill="hsl(260, 60%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-accent-foreground" />
            <h2 className="font-display font-semibold text-lg">AI Insights</h2>
          </div>
          <div className="space-y-3">
            {aiInsights.map((ins, i) => (
              <div key={i} className={`p-3 rounded-xl ${ins.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <ins.icon className="w-4 h-4" />
                  <p className="font-display font-semibold text-sm">{ins.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{ins.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements + Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="font-display font-semibold text-lg mb-4">Your Achievements</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div
                key={a.name}
                className={`rounded-2xl p-5 text-center ${
                  a.unlocked
                    ? `bg-gradient-to-br ${a.gradient} text-white`
                    : "bg-muted/60"
                }`}
              >
                <a.icon className={`w-8 h-8 mx-auto mb-2 ${a.unlocked ? "text-white" : "text-muted-foreground"}`} />
                <p className="font-display font-bold text-sm">{a.name}</p>
                <p className={`text-xs mt-1 ${a.unlocked ? "text-white/80" : "text-muted-foreground"}`}>
                  {a.unlocked ? a.desc : "Locked"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Weekly Leaderboard</h2>
          </div>
          <div className="space-y-3">
            {leaderboard.map((l) => (
              <div
                key={l.rank}
                className={`flex items-center gap-3 p-2.5 rounded-xl ${
                  l.isYou ? "bg-primary/10 ring-1 ring-primary/30" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  l.rank === 1 ? "bg-accent text-accent-foreground" : "bg-muted"
                }`}>
                  {l.rank === 1 ? "🥇" : l.rank}
                </div>
                <span className="text-lg">🧑‍🎓</span>
                <p className="flex-1 font-medium text-sm">{l.name}</p>
                <p className="font-display font-bold text-sm text-primary">{l.xp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <a key={a.label} href={a.path}
              className="glass-card rounded-2xl p-5 hover-lift flex flex-col items-center text-center gap-2"
            >
              <a.icon className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium">{a.label}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
