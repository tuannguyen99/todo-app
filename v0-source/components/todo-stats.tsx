"use client"

import { Target, CheckCircle2, Circle } from "lucide-react"

interface TodoStatsProps {
  total: number
  completed: number
}

export default function TodoStats({ total, completed }: TodoStatsProps) {
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-in">
      <div className="glass-dark rounded-xl p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Target className="w-5 h-5 text-secondary/70" />
        </div>
        <p className="text-foreground/70 text-sm">Total Tasks</p>
        <p className="text-3xl font-bold text-primary mt-1">{total}</p>
      </div>

      <div className="glass-dark rounded-xl p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle2 className="w-5 h-5 text-accent/70" />
        </div>
        <p className="text-foreground/70 text-sm">Completed</p>
        <p className="text-3xl font-bold text-accent mt-1">{completed}</p>
      </div>

      <div className="glass-dark rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-center mb-2">
          <Circle className="w-5 h-5 text-primary/70" />
        </div>
        <p className="text-foreground/70 text-sm">Progress</p>
        <div className="mt-2">
          <p className="text-3xl font-bold text-primary">{completionPercentage}%</p>
          <div className="w-full bg-slate-800/50 rounded-full h-2 mt-2 border border-white/10">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
