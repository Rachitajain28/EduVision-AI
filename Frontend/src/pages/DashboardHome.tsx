import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { Brain, BookOpen,Dumbbell,Trophy, Compass, User, Mail, GraduationCap, Users } from "lucide-react";

const DashboardHome = () => {
  const [user, setUser] = useState<any>(null);
  const [learningStyle, setLearningStyle] = useState<any>(null);
  const [careerResult, setCareerResult] = useState<any>(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getCurrentUser();
    setUser(data);

    // Learning style — localStorage se
    const ls = localStorage.getItem("learning_style_result");
    if (ls) setLearningStyle(JSON.parse(ls));

    // Career result — localStorage se
    const cr = localStorage.getItem("career_result");
    if (cr) setCareerResult(JSON.parse(cr));

    const fetchQuizResults = async () => {
    try {
      const token = localStorage.getItem("token")
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
      const res = await fetch(`${API_URL}/quiz-results`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.results) setQuizResults(data.results.reverse())
    } catch (e) {
      console.error("Failed to fetch quiz results", e)
    }
  }
  fetchQuizResults()
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const bestScore = quizResults.length > 0
    ? Math.max(...quizResults.map((r) => r.fitPercent))
    : null;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          {greeting}, {user?.name?.split(" ")[0] || "Student"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your learning overview</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center font-display font-bold text-2xl shrink-0">
            {(user?.name || "S").charAt(0)}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{user?.name || "Student"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Mail, label: "Email", value: user?.email },
            { icon: Users, label: "Gender", value: user?.gender },
            { icon: GraduationCap, label: "College", value: user?.college },
            { icon: BookOpen, label: "Course", value: user?.course },
          ].map((item) => (
            item.value && (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </motion.div>

      {/* Learning Style + Career — side by side */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Learning Style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Learning Style</h2>
          </div>

          {learningStyle ? (
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-xl gradient-primary font-display font-bold text-lg mb-3 capitalize">
                {learningStyle.style}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{learningStyle.description}</p>
              <div className="flex flex-wrap gap-2">
                {learningStyle.recommendations?.map((r: string) => (
                  <span key={r} className="px-3 py-1 bg-muted rounded-lg text-xs font-medium">{r}</span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm mb-4">You haven't taken the quiz yet!</p>
              <button
                onClick={() => navigate("/dashboard/learning-style")}
                className="px-4 py-2 rounded-xl gradient-primary text-sm font-semibold"
              >
                Take Quiz →
              </button>
            </div>
          )}
        </motion.div>

        {/* Career Path */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Career Path</h2>
          </div>

          {careerResult ? (
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-xl gradient-primary font-display font-bold text-lg mb-3">
                {careerResult.main_career?.career || careerResult.main_career}
              </div>
              {careerResult.other_careers?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Other matches:</p>
                  <div className="flex flex-wrap gap-2">
                    {careerResult.other_careers.slice(0, 3).map((c: any, i: number) => (
                      <span key={i} className="px-3 py-1 bg-muted rounded-lg text-xs font-medium">
                        {c.career || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm mb-4">Discover your ideal career path!</p>
              <button
                onClick={() => navigate("/dashboard/career")}
                className="px-4 py-2 rounded-xl gradient-primary text-sm font-semibold"
              >
                Explore Careers →
              </button>
            </div>
          )}
        </motion.div>
      </div>

       {/* Practice Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Practice Performance</h2>
          </div>
          <button onClick={() => navigate("/dashboard/continue-quiz")}
            className="px-4 py-2 rounded-xl gradient-primary text-sm font-semibold flex items-center gap-2">
            <Dumbbell className="w-4 h-4" /> Practice Now
          </button>
        </div>

        {quizResults.length > 0 ? (
          <div className="space-y-4">
            {/* Best score summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-2xl font-bold text-primary">{bestScore}%</p>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-2xl font-bold">{quizResults.length}</p>
                <p className="text-xs text-muted-foreground">Attempts</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-xl text-center">
                <p className="text-2xl font-bold">
                  {Math.round(quizResults.reduce((a, r) => a + r.fitPercent, 0) / quizResults.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>

            {/* Recent attempts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Recent Attempts:</p>
              {quizResults.slice(0, 3).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">{r.career}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{r.score}/{r.total}</p>
                    <p className={`text-xs font-semibold ${
                      r.fitPercent >= 71 ? "text-green-500" :
                      r.fitPercent >= 41 ? "text-yellow-500" : "text-red-400"
                    }`}>{r.fitPercent}% fit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-2">No practice attempts yet!</p>
            <p className="text-xs text-muted-foreground">
              Complete the Career Path quiz first, then start practicing.
            </p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Learning Style Quiz", icon: Brain, path: "/dashboard/learning-style" },
            { label: "AI Summarizer", icon: BookOpen, path: "/dashboard/summarizer" },
            { label: "Career Path", icon: Compass, path: "/dashboard/career" },
          ].map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className="glass-card rounded-2xl p-5 hover-lift flex flex-col items-center text-center gap-2 w-full"
            >
              <a.icon className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium">{a.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;