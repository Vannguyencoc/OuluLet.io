"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { Lang } from "@/lib/vocab-data"
import { vocabGroups, translations } from "@/lib/vocab-data"
import { VocabCard } from "./vocab-card"
import { cn } from "@/lib/utils"

interface VocabSectionProps {
  lang: Lang
}

export function VocabSection({ lang }: VocabSectionProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const groupLabels = translations[lang].groups

  function toggleGroup(key: string) {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {Object.keys(vocabGroups).map((key, idx) => (
        <div key={key}>
          <button
            onClick={() => toggleGroup(key)}
            className="flex w-full items-center justify-between rounded-lg bg-secondary px-4 py-3 text-left font-semibold text-primary transition-colors hover:bg-secondary/80"
          >
            <span>{groupLabels[idx]}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform",
                openGroups[key] && "rotate-180"
              )}
            />
          </button>

          {openGroups[key] && (
            <div className="mt-2 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
              {vocabGroups[key].map((item, i) => (
                <VocabCard key={`${key}-${i}`} item={item} lang={lang} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
