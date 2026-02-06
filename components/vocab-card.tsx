"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { VocabItem, Lang } from "@/lib/vocab-data"
import { SpeakButton } from "./speak-button"
import { cn } from "@/lib/utils"

interface VocabCardProps {
  item: VocabItem
  lang: Lang
}

export function VocabCard({ item, lang }: VocabCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setExpanded(!expanded)
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground">{item.fi}</p>
          <p className="text-sm text-muted-foreground">{item[lang]}</p>
        </div>
        <div className="flex items-center gap-2">
          <SpeakButton text={item.fi} />
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {expanded && (
        <div className="mt-3 rounded-md border-l-4 border-primary bg-secondary/50 p-3 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between">
            <p className="text-sm italic text-foreground">{item.ex}</p>
            <SpeakButton text={item.ex} size="sm" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === "vi" ? item.exVi : item.exEn}
          </p>
        </div>
      )}
    </div>
  )
}
