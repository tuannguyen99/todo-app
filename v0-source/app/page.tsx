"use client"

import { useState, useEffect } from "react"
import { Plus, Sparkles } from "lucide-react"
import TodoItem from "@/components/todo-item"
import TodoStats from "@/components/todo-stats"
import EmptyState from "@/components/empty-state"

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("todos")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTodos(
          parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })),
        )
      } catch (e) {
        console.error("Failed to load todos:", e)
      }
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, mounted])

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: input,
        completed: false,
        createdAt: new Date(),
      }
      setTodos([newTodo, ...todos])
      setInput("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText } : t)))
      setEditingId(null)
      setEditText("")
    }
  }

  const completedCount = todos.filter((t) => t.completed).length

  if (!mounted) return null

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Task Master
              </h1>
            </div>
            <p className="text-foreground/70 text-sm sm:text-base">Stay organized and productive</p>
          </div>

          <TodoStats total={todos.length} completed={completedCount} />

          <div className="glass-dark rounded-2xl p-6 mb-8 animate-slide-in">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 bg-slate-800/50 text-foreground placeholder-foreground/50 px-4 py-3 rounded-xl border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
              />
              <button
                onClick={addTodo}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/50 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>

          {todos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 animate-fade-in">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={editingId === todo.id}
                  editText={editText}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                  onStartEdit={() => startEdit(todo.id, todo.text)}
                  onSaveEdit={() => saveEdit(todo.id)}
                  onEditTextChange={(text) => setEditText(text)}
                />
              ))}
            </div>
          )}

          {todos.length > 0 && (
            <div className="mt-8 text-center text-foreground/50 text-sm">
              {completedCount === todos.length && todos.length > 0 ? (
                <p className="animate-fade-in">🎉 All tasks completed! Great job!</p>
              ) : (
                <p>
                  {todos.length - completedCount} task{todos.length - completedCount !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
