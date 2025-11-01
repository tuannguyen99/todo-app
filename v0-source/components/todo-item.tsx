"use client"

import { CheckCircle2, Circle, Trash2, Edit2, Check, X } from "lucide-react"

interface TodoItemProps {
  todo: {
    id: string
    text: string
    completed: boolean
  }
  isEditing: boolean
  editText: string
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onEditTextChange: (text: string) => void
}

export default function TodoItem({
  todo,
  isEditing,
  editText,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onEditTextChange,
}: TodoItemProps) {
  return (
    <div className="glass-dark rounded-xl p-4 hover:bg-slate-800/40 transition-all duration-200 group animate-slide-in">
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="flex-shrink-0 text-primary/60 hover:text-primary transition-colors">
          {todo.completed ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6" />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
            autoFocus
            className="flex-1 bg-slate-800/50 text-foreground px-3 py-2 rounded-lg border border-primary/30 focus:border-primary focus:outline-none"
          />
        ) : (
          <span
            className={`flex-1 text-base transition-all duration-200 ${
              todo.completed ? "line-through text-foreground/50" : "text-foreground"
            }`}
          >
            {todo.text}
          </span>
        )}

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button onClick={onSaveEdit} className="text-green-400 hover:text-green-300 transition-colors p-2">
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEditTextChange(todo.text)}
                className="text-red-400 hover:text-red-300 transition-colors p-2"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={onStartEdit} className="text-primary/60 hover:text-primary transition-colors p-2">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="text-destructive/60 hover:text-destructive transition-colors p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
