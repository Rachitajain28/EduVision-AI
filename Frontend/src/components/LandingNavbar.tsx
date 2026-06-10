import { Link } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated } from "@/lib/auth";
import foxyMascot from "@/assets/foxy-mascot.png";

const LandingNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const loggedIn = isAuthenticated();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card-strong border-b border-border/30"
    >
      <div className="w-full grid grid-cols-3 items-center py-3 px-6">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          {/* <img src={foxyMascot} alt="Foxy" className="w-12 h-12" /> */}
          <span className="text-gradient">EduVision AI</span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center justify-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-end gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {loggedIn ? (
            <Link to="/dashboard" className="px-4 py-2 rounded-xl gradient-primary text-sm font-semibold transition-all hover-lift">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-xl gradient-primary text-sm font-semibold transition-all hover-lift">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden flex justify-end col-span-2">
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/30"
          >
            <div className="p-4 flex flex-col gap-3">
              <a href="#features" onClick={() => setOpen(false)} className="text-sm font-medium">Features</a>
              <a href="#how-it-works" onClick={() => setOpen(false)} className="text-sm font-medium">How It Works</a>
              <button onClick={toggleTheme} className="flex items-center gap-2 text-sm">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} Toggle Theme
              </button>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">Log In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="text-sm font-semibold gradient-primary px-4 py-2 rounded-xl text-center">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default LandingNavbar;