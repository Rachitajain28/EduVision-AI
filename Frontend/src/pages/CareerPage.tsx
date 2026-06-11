import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCareerStore } from "@/store/useCareerStore"
import {
  TrendingUp, Compass, ArrowRight, ArrowLeft,
  Loader2, RotateCcw, BadgeCheck
} from "lucide-react"

const questionBank: Record<string, string[]> = {
  R: [
    "How much do you enjoy building, fixing, or working with tools and machines?",
    "How much do you enjoy working outdoors or doing physical/hands-on tasks?",
    "How much do you enjoy assembling, repairing, or operating equipment?",
    "How much do you enjoy working with mechanical or electrical systems?",
  ],
  I: [
    "How much do you enjoy analysing data, solving complex problems, or doing research?",
    "How much do you enjoy learning about science, technology, or how things work?",
    "How much do you enjoy solving mathematical or logical puzzles?",
    "How much do you enjoy reading research papers or investigating new ideas?",
  ],
  A: [
    "How much do you enjoy creative activities like design, writing, or art?",
    "How much do you enjoy expressing yourself through music, photography, or storytelling?",
    "How much do you enjoy creating visual content, videos, or graphic designs?",
    "How much do you enjoy coming up with innovative or unconventional ideas?",
  ],
  S: [
    "How much do you enjoy helping, teaching, or working closely with people?",
    "How much do you enjoy mentoring, counselling, or supporting others?",
    "How much do you enjoy working in teams and building relationships?",
    "How much do you enjoy volunteering or contributing to your community?",
  ],
  E: [
    "How much do you enjoy leading teams, starting ventures, or persuading others?",
    "How much do you enjoy negotiating, pitching ideas, or making business decisions?",
    "How much do you enjoy taking initiative and managing projects?",
    "How much do you enjoy motivating others and driving results?",
  ],
  C: [
    "How much do you enjoy organising, managing records, or working with structured systems?",
    "How much do you enjoy working with numbers, spreadsheets, or financial data?",
    "How much do you enjoy following procedures and maintaining accuracy?",
    "How much do you enjoy planning, scheduling, or managing details?",
  ],
}

const getRandomQuestions = () =>
  ["R", "I", "A", "S", "E", "C"].map((type) => {
    const pool = questionBank[type]
    return { type, text: pool[Math.floor(Math.random() * pool.length)] }
  })

const RIASEC_LABELS: Record<string, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
}

const RATING_LABELS: Record<number, string> = {
  1: "Not at all",
  2: "A little",
  3: "Somewhat",
  4: "Quite a bit",
  5: "Absolutely",
}

const parseStep = (content: string, step: number) => {
  const colonIdx = content.indexOf(":")
  if (colonIdx === -1) return { step, duration: "", title: content, desc: "" }
  const duration = content.substring(0, colonIdx).trim()
  const rest = content.substring(colonIdx + 1).trim()
  const dashIdx = rest.indexOf(" - ")
  return {
    step,
    duration,
    title: dashIdx !== -1 ? rest.substring(0, dashIdx).trim() : rest,
    desc: dashIdx !== -1 ? rest.substring(dashIdx + 3).trim() : "",
  }
}

// ══════════════════════════════════════════════════════════════
// QUIZ VIEW
// ══════════════════════════════════════════════════════════════
const QuizView = ({ onComplete }: { onComplete: () => void }) => {
  const setResults = useCareerStore((s) => s.setResults)
  const [questions] = useState(() => getRandomQuestions()) // ✅ random on mount
  const [current, setCurrent] = useState(0)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const currentRating = ratings[current] ?? null
  const progress = Math.round(((current + 1) / questions.length) * 100)
  const isLast = current === questions.length - 1
  const allAnswered = Object.keys(ratings).length === questions.length

  const handleRate = (val: number) =>
    setRatings((prev) => ({ ...prev, [current]: val }))

  const handleSubmit = async () => {
    // rating 1-5 × 2 = 2-10, fits validate_scores (0 <= x <= 10)
    const scores = questions.map((_, i) => (ratings[i] ?? 1) * 2)

    setLoading(true)
    setError("")
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

        const res = await fetch(`${API_URL}/predict-career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.main_career, data.other_careers)
      onComplete()
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Career Discovery Quiz</h1>
            <p className="text-muted-foreground text-sm">
              Rate each area to find your ideal career path
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
          className="glass-card rounded-2xl p-8 space-y-8"
        >
          <div>
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">
              {questions[current].type} — {RIASEC_LABELS[questions[current].type]}
            </p>
            <h2 className="font-display text-xl font-bold leading-snug">
              {questions[current].text}
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              1 = Not at all · 5 = Absolutely love it
            </p>
          </div>

          {/* Rating buttons */}
          <div className="space-y-3">
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRate(val)}
                  className={`flex-1 py-4 rounded-xl border text-lg font-bold transition-all
                    ${currentRating === val
                      ? "border-foreground bg-foreground text-background scale-105"
                      : "border-border bg-secondary/20 hover:border-foreground/40 hover:bg-secondary/40"
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Selected label */}
            <div className="text-center h-5">
              <AnimatePresence mode="wait">
                {currentRating && (
                  <motion.p
                    key={currentRating}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-primary font-medium"
                  >
                    {RATING_LABELS[currentRating]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Dot navigation */}
          <div className="flex justify-center gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-foreground w-4"
                    : ratings[i] !== undefined
                    ? "bg-foreground/50 w-2"
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center bg-red-500/10 py-3 px-4 rounded-xl">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium disabled:opacity-30 hover:bg-secondary/40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {!isLast ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={currentRating === null}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-all"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</>
              : <>Find my career <ArrowRight className="w-4 h-4" /></>
            }
          </button>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// RESULTS VIEW
// ══════════════════════════════════════════════════════════════
const ResultsView = ({ onRetake }: { onRetake: () => void }) => {
  const { mainCareer, otherCareers } = useCareerStore()
  const [selectedOtherIdx, setSelectedOtherIdx] = useState<number | null>(null)

  if (!mainCareer) return null

  // If user clicked an other career, show that — else show main
  const career = selectedOtherIdx !== null ? otherCareers[selectedOtherIdx] : mainCareer
  const parsedPath = career.learning_path.map((lp) => parseStep(lp.content, lp.step))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Career Path Guidance
            </h1>
            <p className="text-muted-foreground text-sm">
              Personalised result ·{" "}
              <span className="text-primary font-medium">
                {mainCareer.confidence}% match confidence
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary/40 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Retake Quiz
        </button>
      </div>

      {/* Featured Career — main by default, switches on click */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`career-${selectedOtherIdx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 bg-secondary/30"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <TrendingUp className="w-7 h-7 text-primary" />
            <h2 className="font-display text-2xl font-bold">{career.career}</h2>
            {selectedOtherIdx === null && (
              <span className="flex items-center gap-1 ml-auto text-xs px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Best match
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Salary Range</p>
              <p className="font-display text-xl font-bold">{career.salary}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Match Confidence</p>
              <p className="font-display text-xl font-bold text-primary">
                {career.confidence}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Key Skills Required:</p>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((s) => (
                <span
                  key={s}
                  className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Other Career Paths — only 5 others, main not repeated */}
      <div>
        <h3 className="font-display text-xl font-bold mb-4">Other Career Paths</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherCareers.map((c, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedOtherIdx(
                selectedOtherIdx === idx ? null : idx
              )}
              className={`glass-card rounded-2xl p-5 text-left transition-all ${
                selectedOtherIdx === idx ? "ring-2 ring-primary" : "hover:shadow-lg"
              }`}
            >
              <TrendingUp className="w-6 h-6 mb-3 text-primary" />
              <p className="font-display font-bold">{c.career}</p>
              <p className="text-sm text-primary mt-1">{c.salary}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.confidence}% match</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Learning Path — updates when other career clicked */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`path-${selectedOtherIdx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8"
        >
          <h3 className="font-display text-xl font-bold mb-6">
            Recommended Learning Path:
          </h3>
          <div className="space-y-0">
            {parsedPath.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-display font-bold shrink-0">
                    {step.step}
                  </div>
                  {i < parsedPath.length - 1 && (
                    <div className="w-0.5 h-12 bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm text-primary">{step.duration}</p>
                  <p className="font-display font-bold">{step.title}</p>
                  {step.desc && (
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onRetake}
            className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover-lift mt-4 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
const CareerPage = () => {
  const { isPersonalized, reset } = useCareerStore()
  const [showQuiz, setShowQuiz] = useState(!isPersonalized)

  const handleQuizComplete = () => setShowQuiz(false)
  const handleRetake = () => { reset(); setShowQuiz(true) }

  return (
    <AnimatePresence mode="wait">
      {showQuiz ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <QuizView onComplete={handleQuizComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          <ResultsView onRetake={handleRetake} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CareerPage



