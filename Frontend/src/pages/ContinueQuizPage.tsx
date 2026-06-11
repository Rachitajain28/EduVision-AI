import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useCareerStore } from "@/store/useCareerStore"
import {
  ArrowLeft, ArrowRight, CheckCircle,
  XCircle, BookOpen, Loader2, Sparkles
} from "lucide-react"

interface QuizQuestion {
  q: string
  options: string[]
  answer: number
}

const ContinueQuizPage = () => {
  const navigate = useNavigate()
  const mainCareer = useCareerStore((s) => s.mainCareer)
  const careerName = mainCareer?.career ?? ""

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)

  const fetchQuestions = async () => {
    setLoading(true)
    setError("")
    setCurrent(0)
    setAnswers({})
    setShowResult(false)
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

        const res = await fetch(`${API_URL}/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career: careerName }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setQuestions(data.questions)
    } catch (e: any) {
      setError("Failed to generate quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (careerName) fetchQuestions()
  }, [careerName])

  // ── No career recommended ────────────────────────────────
  if (!mainCareer) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-20">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold">No Career Recommended Yet</h2>
        <p className="text-muted-foreground">
          Complete the Career Path quiz first to unlock your personalised quiz.
        </p>
        <button
          onClick={() => navigate("/dashboard/career")}
          className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-all"
        >
          Go to Career Path
        </button>
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-20">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        <h2 className="font-display text-xl font-bold">Generating your quiz...</h2>
        <p className="text-muted-foreground text-sm">
          Creating 10 AI-powered questions for <span className="text-primary font-semibold">{careerName}</span>
        </p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-20">
        <p className="text-red-500 bg-red-500/10 px-4 py-3 rounded-xl">{error}</p>
        <button
          onClick={fetchQuestions}
          className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-all"
        >
          Try Again
        </button>
      </div>
    )
  }

  const isLast = current === questions.length - 1
  const progress = Math.round(((current + 1) / questions.length) * 100)
  const currentAnswer = answers[current]
  const isAnswered = currentAnswer !== undefined

  const handleSelect = (i: number) => {
    if (isAnswered) return
    setAnswers((prev) => ({ ...prev, [current]: i }))
  }

  const handleNext = () => {
    if (isLast) setShowResult(true)
    else setCurrent((c) => c + 1)
  }

  // ── Result Screen ────────────────────────────────────────
  if (showResult) {
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0
    )
    const fitPercent = Math.round((score / questions.length) * 100)
    const fitLabel =
      fitPercent >= 71 ? "Strong Fit 🎯" :
      fitPercent >= 41 ? "Good Foundation 📈" :
      "Keep Exploring 🌱"
    const fitColor =
      fitPercent >= 71 ? "text-green-500" :
      fitPercent >= 41 ? "text-yellow-500" :
      "text-red-400"

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="glass-card rounded-2xl p-8 space-y-6">

          {/* Score */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{careerName} · AI Quiz</p>
            <h2 className="font-display text-5xl font-bold">{score}<span className="text-muted-foreground text-2xl">/{questions.length}</span></h2>
            <p className={`text-2xl font-bold ${fitColor}`}>{fitPercent}% Career Fit</p>
            <p className={`text-base font-semibold ${fitColor}`}>{fitLabel}</p>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${fitPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Answer Review */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-sm font-semibold text-muted-foreground">Answer Review:</p>
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-sm ${
                    isCorrect
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-400/30 bg-red-400/10"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect
                      ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="font-medium">{q.q}</p>
                      {!isCorrect && (
                        <p className="text-green-500 mt-1 text-xs">
                          ✓ Correct: {q.options[q.answer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary/40 transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={fetchQuestions}
              className="flex-1 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> New Questions
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Quiz Screen ──────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold">{careerName}</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Generated · 10 Questions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-foreground rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22 }}
          className="glass-card rounded-2xl p-8 space-y-6"
        >
          <h2 className="font-display text-xl font-bold leading-snug">
            {questions[current].q}
          </h2>

          <div className="space-y-3">
            {questions[current].options.map((opt, i) => {
              const isSelected = currentAnswer === i
              const isCorrect = i === questions[current].answer
              let style = "border-border bg-secondary/20 hover:border-foreground/40 hover:bg-secondary/40 cursor-pointer"

              if (isAnswered) {
                if (isCorrect) style = "border-green-500 bg-green-500/10 cursor-default"
                else if (isSelected) style = "border-red-400 bg-red-400/10 cursor-default"
                else style = "border-border bg-secondary/20 opacity-40 cursor-default"
              } else if (isSelected) {
                style = "border-foreground bg-foreground/10"
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-sm font-medium ${style}`}
                >
                  <span className="text-muted-foreground font-bold mr-3">
                    {["A", "B", "C", "D"][i]}.
                  </span>
                  {opt}
                  {isAnswered && isCorrect && (
                    <span className="ml-2 text-green-500">✓</span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="ml-2 text-red-400">✗</span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium disabled:opacity-30 hover:bg-secondary/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all"
        >
          {isLast ? "See Results" : "Next"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ContinueQuizPage
