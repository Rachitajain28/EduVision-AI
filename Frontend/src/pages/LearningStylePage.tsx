import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight } from "lucide-react";
import learningData from "../data/learningStyleData.json";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const shuffleArray = (array: any[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const LearningStylePage = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  useEffect(() => {
    if (questions.length > 0) {
      setShuffledOptions(shuffleArray(questions[current].options));
    }
  }, [current, questions]);

  useEffect(() => {
    const shuffledQuestions = shuffleArray(learningData.questions);
    setQuestions(shuffledQuestions);
  }, []);

  if (questions.length === 0) return null;


  // ✅ Send answers to backend
  const sendToBackend = async (finalAnswers: string[]) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/predict-learning-style`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: finalAnswers,
        }),
      });

      const data = await res.json();
      setResult(data);
      localStorage.setItem("learning_style_result", JSON.stringify(data)); // ADD
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle answer click
  const selectAnswer = (text: string) => {
    const newAnswers = [...answers, text];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      sendToBackend(newAnswers); // 🔥 ML call
    }
  };

  const reset = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">Analyzing your learning style... 🧠</h2>
      </div>
    );
  }

  // ✅ RESULT UI (FROM ML BACKEND)
  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-3xl p-8 text-center"
        >
          <div className="text-5xl mb-2">🎉</div>

          <h2 className="font-display text-2xl font-bold mb-2">
            {result.style.toUpperCase()} LEARNER
          </h2>

          <p className="text-muted-foreground mb-6">
            {result.description}
          </p>

          <div className="text-left">
            <h3 className="font-display font-semibold mb-3">
              Recommended Methods:
            </h3>

            <div className="space-y-2">
              {result.recommendations.map((rec: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={reset}
            className="mt-6 px-6 py-2.5 rounded-xl gradient-primary font-semibold hover-lift"
          >
            Retake Quiz
          </button>
        </motion.div>
      </div>
    );
  }

  // ✅ QUESTIONS UI
  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold mb-2">
        Learning Style Detection
      </h1>
      <p className="text-muted-foreground mb-6">
        Answer {questions.length} questions to discover how you learn best.
      </p>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>
            {Math.round((current / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(current / questions.length) * 100}%` }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display text-lg font-semibold mb-4">
            {q.question}
          </h2>

          <div className="space-y-3">
            {shuffledOptions.map((opt: any) => (
              <button
                key={opt.text}
                onClick={() => selectAnswer(opt.text)}
                className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-primary/20 border border-transparent hover:border-primary/30 transition-all flex items-center justify-between group"
              >
                <span className="text-sm">{opt.text}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LearningStylePage;