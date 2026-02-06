"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle2, XCircle, PartyPopper } from "lucide-react"
import type { Lang, VocabItem } from "@/lib/vocab-data"
import { getAllWords, translations } from "@/lib/vocab-data"
import { SpeakButton } from "./speak-button"
import { cn } from "@/lib/utils"

interface UserStat {
  interval: number
  reps: number
  next: number
}

function getStats(): Record<string, UserStat> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem("suomi_stats_final") || "{}")
  } catch {
    return {}
  }
}

function saveStats(stats: Record<string, UserStat>) {
  localStorage.setItem("suomi_stats_final", JSON.stringify(stats))
}

function getDueWords(stats: Record<string, UserStat>): VocabItem[] {
  const now = Date.now()
  const allWords = getAllWords()
  return allWords.filter((i) => !stats[i.fi] || stats[i.fi].next <= now)
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface QuizSectionProps {
  lang: Lang
  onDueCountChange: (count: number) => void
}

export function QuizSection({ lang, onDueCountChange }: QuizSectionProps) {
  const [stats, setStats] = useState<Record<string, UserStat>>({})
  const [currentItem, setCurrentItem] = useState<VocabItem | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [dueCount, setDueCount] = useState(0)

  const loadQuestion = useCallback(
    (currentStats: Record<string, UserStat>) => {
      const dueWords = getDueWords(currentStats)
      setDueCount(dueWords.length)
      onDueCountChange(dueWords.length)

      if (dueWords.length === 0) {
        setCurrentItem(null)
        return
      }

      const item = dueWords[Math.floor(Math.random() * dueWords.length)]
      setCurrentItem(item)
      setSelectedAnswer(null)
      setIsCorrect(null)

      const allWords = getAllWords()
      const correctAnswer = item[lang]
      let opts = [correctAnswer]
      while (opts.length < 3) {
        const rand = allWords[Math.floor(Math.random() * allWords.length)][lang]
        if (!opts.includes(rand)) opts.push(rand)
      }
      setOptions(shuffle(opts))
    },
    [lang, onDueCountChange]
  )

  useEffect(() => {
    const s = getStats()
    setStats(s)
    loadQuestion(s)
  }, [loadQuestion])

  function handleAnswer(answer: string) {
    if (selectedAnswer) return

    const correct = currentItem![lang]
    const isRight = answer === correct

    setSelectedAnswer(answer)
    setIsCorrect(isRight)

    const newStats = { ...stats }
    const word = currentItem!.fi
    if (!newStats[word]) newStats[word] = { interval: 0, reps: 0, next: Date.now() }

    if (isRight) {
      newStats[word].reps++
      newStats[word].interval =
        newStats[word].reps === 1
          ? 1
          : newStats[word].reps === 2
            ? 3
            : Math.round(newStats[word].interval * 2.4)
    } else {
      newStats[word].reps = 0
      newStats[word].interval = 0
    }
    newStats[word].next = Date.now() + newStats[word].interval * 24 * 60 * 60 * 1000

    setStats(newStats)
    saveStats(newStats)

    setTimeout(() => {
      loadQuestion(newStats)
    }, 1200)
  }

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <PartyPopper className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {translations[lang].finish}
        </h2>
        <p className="text-sm text-muted-foreground">
          {lang === "vi"
            ? "Quay lai sau de on tap them!"
            : "Come back later for more review!"}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="text-sm text-muted-foreground">
        {translations[lang].due}
        <span className="font-semibold text-primary">{dueCount}</span>
      </p>

      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {currentItem.fi}
        </h2>
        <SpeakButton text={currentItem.fi} size="md" />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {options.map((option) => {
          const isSelected = selectedAnswer === option
          const isCorrectOption = option === currentItem[lang]

          let variant = "default"
          if (selectedAnswer) {
            if (isCorrectOption) variant = "correct"
            else if (isSelected && !isCorrect) variant = "incorrect"
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 px-5 py-4 text-left font-medium transition-all",
                variant === "default" &&
                  "border-primary/30 bg-card text-foreground hover:border-primary hover:bg-primary/5",
                variant === "correct" &&
                  "border-accent bg-accent/10 text-accent",
                variant === "incorrect" &&
                  "border-destructive bg-destructive/10 text-destructive",
                selectedAnswer && !isSelected && !isCorrectOption && "opacity-50"
              )}
            >
              <span>{option}</span>
              {variant === "correct" && (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              )}
              {variant === "incorrect" && (
                <XCircle className="h-5 w-5 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
