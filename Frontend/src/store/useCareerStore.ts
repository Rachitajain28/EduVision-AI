import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LearningStep {
  step: number
  content: string
}

export interface CareerResult {
  career: string
  salary: string
  skills: string[]
  learning_path: LearningStep[]
  confidence: number
}

interface CareerStore {
  mainCareer: CareerResult | null
  otherCareers: CareerResult[]
  isPersonalized: boolean
  setResults: (main: CareerResult, others: CareerResult[]) => void
  reset: () => void
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set) => ({
      mainCareer: null,
      otherCareers: [],
      isPersonalized: false,
      setResults: (main, others) =>
        set({ mainCareer: main, otherCareers: others, isPersonalized: true }),
      reset: () =>
        set({ mainCareer: null, otherCareers: [], isPersonalized: false }),
    }),
    {
      name: 'career-store',
      version: 1, 
    }
  )
)