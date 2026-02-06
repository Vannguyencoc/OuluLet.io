"use client"

import { useState, useCallback } from "react"
import { BookOpen, GraduationCap, Globe } from "lucide-react"
import type { Lang } from "@/lib/vocab-data"
import { translations } from "@/lib/vocab-data"
import { VocabSection } from "./vocab-section"
import { QuizSection } from "./quiz-section"
import { cn } from "@/lib/utils"

type Tab = "vocab" | "review"

export function SuomiApp() {
  const [lang, setLang] = useState<Lang>("vi")
  const [tab, setTab] = useState<Tab>("vocab")
  const [dueCount, setDueCount] = useState(0)

  const t = translations[lang]

  const handleDueCountChange = useCallback((count: number) => {
    setDueCount(count)
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      {/* Header */}
      <header className="flex items-center justify-center bg-primary px-4 py-4">
        <h1 className="text-lg font-bold tracking-tight text-primary-foreground">
          {t.title}
        </h1>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center gap-2 border-b border-border bg-card px-3 py-2">
        <button
          onClick={() => setTab("vocab")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
            tab === "vocab"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <BookOpen className="h-4 w-4" />
          {t.vocab}
        </button>

        <button
          onClick={() => setTab("review")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
            tab === "review"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <GraduationCap className="h-4 w-4" />
          {t.review} ({dueCount})
        </button>

        <button
          onClick={() => setLang((prev) => (prev === "vi" ? "en" : "vi"))}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Globe className="h-4 w-4" />
          <span>{lang === "vi" ? "VN" : "EN"}</span>
        </button>
      </nav>

      {/* Content */}
      <main>
        {tab === "vocab" && <VocabSection lang={lang} />}
        {tab === "review" && (
          <QuizSection lang={lang} onDueCountChange={handleDueCountChange} />
        )}
      </main>
    </div>
  )
}
