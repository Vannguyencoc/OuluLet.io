"use client"

import { Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpeakButtonProps {
  text: string
  size?: "sm" | "md"
  className?: string
}

export function SpeakButton({ text, size = "sm", className }: SpeakButtonProps) {
  function speak() {
    window.speechSynthesis.cancel()
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = "fi-FI"
    window.speechSynthesis.speak(msg)
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        speak()
      }}
      className={cn(
        "flex items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
      aria-label={`Listen to "${text}" in Finnish`}
    >
      <Volume2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </button>
  )
}
