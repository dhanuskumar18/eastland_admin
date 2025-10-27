"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface NavbarProgressLoaderProps {
  progress?: number
  isLoading?: boolean
  className?: string
  variant?: "default" | "gradient" | "pulse"
  color?: "blue" | "green" | "purple" | "orange"
}

export function NavbarProgressLoader({
  progress = 0,
  isLoading = false,
  className,
  variant = "gradient",
  color = "blue",
}: NavbarProgressLoaderProps) {
  const [displayProgress, setDisplayProgress] = React.useState(0)

  // Smooth progress animation
  React.useEffect(() => {
    if (isLoading && progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress((prev) => Math.min(prev + 1, progress))
      }, 20)
      return () => clearTimeout(timer)
    } else if (!isLoading) {
      setDisplayProgress(progress)
    }
  }, [progress, displayProgress, isLoading])

  const colorVariants = {
    blue: {
      bg: "from-blue-500 via-cyan-500 to-blue-600",
      shadow: "shadow-blue-500/50",
      glow: "before:shadow-[0_0_30px_rgba(59,130,246,0.8),0_0_60px_rgba(59,130,246,0.4),0_0_90px_rgba(59,130,246,0.2)]",
      dropShadow: "drop-shadow-[0_2px_8px_rgba(59,130,246,0.6)] drop-shadow-[0_4px_16px_rgba(59,130,246,0.3)]",
    },
    green: {
      bg: "from-green-500 via-emerald-500 to-green-600",
      shadow: "shadow-green-500/50",
      glow: "before:shadow-[0_0_30px_rgba(34,197,94,0.8),0_0_60px_rgba(34,197,94,0.4),0_0_90px_rgba(34,197,94,0.2)]",
      dropShadow: "drop-shadow-[0_2px_8px_rgba(34,197,94,0.6)] drop-shadow-[0_4px_16px_rgba(34,197,94,0.3)]",
    },
    purple: {
      bg: "from-purple-500 via-violet-500 to-purple-600",
      shadow: "shadow-purple-500/50",
      glow: "before:shadow-[0_0_30px_rgba(147,51,234,0.8),0_0_60px_rgba(147,51,234,0.4),0_0_90px_rgba(147,51,234,0.2)]",
      dropShadow: "drop-shadow-[0_2px_8px_rgba(147,51,234,0.6)] drop-shadow-[0_4px_16px_rgba(147,51,234,0.3)]",
    },
    orange: {
      bg: "from-orange-500 via-amber-500 to-orange-600",
      shadow: "shadow-orange-500/50",
      glow: "before:shadow-[0_0_30px_rgba(249,115,22,0.8),0_0_60px_rgba(249,115,22,0.4),0_0_90px_rgba(249,115,22,0.2)]",
      dropShadow: "drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)] drop-shadow-[0_4px_16px_rgba(249,115,22,0.3)]",
    },
  }

  const currentColor = colorVariants[color]

  if (!isLoading && displayProgress === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-2 bg-gray-200/20 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-b border-white/10",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-[2px]" />

      {/* Progress Bar */}
      <div
        className={cn(
          "h-full transition-all duration-300 ease-out relative overflow-hidden transform-gpu",
          variant === "default" && `bg-gradient-to-r ${currentColor.bg}`,
          variant === "gradient" && `bg-gradient-to-r ${currentColor.bg}`,
          variant === "pulse" && `bg-gradient-to-r ${currentColor.bg} animate-pulse`,
          `before:absolute before:inset-0 before:bg-gradient-to-r before:${currentColor.bg} before:blur-[3px] before:opacity-90 ${currentColor.glow}`,
          `filter ${currentColor.dropShadow}`,
          // Shimmer effect with enhanced brightness
          "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:translate-x-[-100%] after:animate-[shimmer_2s_infinite]",
        )}
        style={{
          width: `${displayProgress}%`,
          boxShadow: `
            0 0 15px ${
              color === "blue"
                ? "rgba(59,130,246,0.6)"
                : color === "green"
                  ? "rgba(34,197,94,0.6)"
                  : color === "purple"
                    ? "rgba(147,51,234,0.6)"
                    : "rgba(249,115,22,0.6)"
            },
            0 0 30px ${
              color === "blue"
                ? "rgba(59,130,246,0.4)"
                : color === "green"
                  ? "rgba(34,197,94,0.4)"
                  : color === "purple"
                    ? "rgba(147,51,234,0.4)"
                    : "rgba(249,115,22,0.4)"
            },
            0 2px 8px rgba(0,0,0,0.1),
            0 4px 16px rgba(0,0,0,0.05)
          `,
        }}
      >
        {isLoading && (
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/50 to-white/20 animate-pulse filter blur-[1px]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />
      </div>

      {displayProgress > 0 && (
        <>
          <div
            className={cn(
              "absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-current to-transparent opacity-70 blur-[4px] transition-all duration-300",
              `text-${color}-400`,
            )}
            style={{ left: `${Math.max(0, displayProgress - 12)}%` }}
          />
          <div
            className={cn(
              "absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 blur-[8px] transition-all duration-300",
              `text-${color}-300`,
            )}
            style={{ left: `${Math.max(0, displayProgress - 8)}%` }}
          />
        </>
      )}
    </div>
  )
}

// Hook for managing progress state
export function useNavbarProgress() {
  const [progress, setProgress] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)

  const startLoading = React.useCallback(() => {
    setIsLoading(true)
    setProgress(0)
  }, [])

  const updateProgress = React.useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)))
  }, [])

  const finishLoading = React.useCallback(() => {
    setProgress(100)
    setTimeout(() => {
      setIsLoading(false)
      setProgress(0)
    }, 500)
  }, [])

  return {
    progress,
    isLoading,
    startLoading,
    updateProgress,
    finishLoading,
  }
}
