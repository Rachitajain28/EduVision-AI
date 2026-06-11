import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Moon, Sun } from "lucide-react";
import { signup } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm || !age || !gender || !college || !course) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(name, email, password, age, gender, college, course);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4 relative">

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <button onClick={toggleTheme} className="p-2 rounded-lg glass-card">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card-strong rounded-3xl p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Start your AI-powered learning journey
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-destructive/20 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-accent/40 text-sm font-medium"
            >
              ✅ Account created! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3.5 text-muted-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />

            {/* Row: Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={e => setCollege(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
            <input
              type="text"
              placeholder="Course / Branch"
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />

            <button className="w-full py-3 rounded-xl gradient-primary font-semibold text-sm mt-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;