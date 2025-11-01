"use client"

import { Inbox } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="glass-dark rounded-2xl p-12 sm:p-16 text-center animate-fade-in">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Inbox className="w-8 h-8 text-primary/70" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">No tasks yet</h3>
      <p className="text-foreground/60 max-w-sm mx-auto">
        Create your first task to get started. Stay organized and track your productivity!
      </p>
    </div>
  )
}
