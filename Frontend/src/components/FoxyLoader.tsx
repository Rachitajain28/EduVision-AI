import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Preparing your learning journey…",
  "Getting things ready…",
  "Almost there…",
];

const FoxyLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 2 : 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => onComplete(), 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] overflow-hidden bg-background flex flex-col items-center justify-center"
    >
      {/* Background Blob 1 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl"
        animate={{
          x: [-120, 120, -120],
          y: [-60, 60, -60],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Background Blob 2 */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          x: [120, -120, 120],
          y: [60, -60, 60],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Background Blob 3 */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [80, -80, 80],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Brand Name */}
        <motion.h1
          className="font-display text-4xl font-bold text-gradient"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          EduVision AI
        </motion.h1>

        {/* Progress Bar */}
        <div className="w-56 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <span className="text-sm text-primary font-medium">
          {progress}%
        </span>

        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-muted-foreground"
          >
            {messages[msgIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FoxyLoader;