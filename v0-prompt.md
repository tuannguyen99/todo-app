# v0.dev Prompt: Modern Glassmorphism Todo App

Create a beautiful, modern Todo application with glassmorphism design for Next.js 14 with TypeScript and Tailwind CSS.

## Design Requirements

### Visual Style
- **Glassmorphism aesthetic** with frosted glass effects (backdrop-blur, semi-transparent backgrounds)
- **Animated gradient background** that subtly shifts colors (use purple, blue, pink tones)
- **Smooth animations** for all interactions (add, delete, check, hover states)
- **Clean card-based layout** with soft shadows and rounded corners
- **Modern color palette** with good contrast for accessibility

### Layout Structure
```
┌─────────────────────────────────────┐
│     Gradient Animated Background     │
│  ┌───────────────────────────────┐  │
│  │   "My Tasks" Title + Subtitle │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   Glass Card Container         │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Input + Add Button     │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Stats (Total/Completed)│  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Todo Item 1            │  │  │
│  │  │  [✓] [Edit] [Delete]    │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Todo Item 2            │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Features to Implement

### 1. Add Todo Input
- Modern text input with glass effect
- Placeholder: "What needs to be done?"
- "Add Task" button with gradient background
- Use Plus icon from lucide-react
- Input should expand/glow on focus
- Button should have hover animation (scale + shadow)

### 2. Todo Items
- Each todo in a glass card with subtle border
- Custom checkbox with smooth check animation
- Todo text with line-through animation when completed
- Completed todos should have reduced opacity
- Edit button (Pencil icon) - shows inline edit mode
- Delete button (Trash2 icon) with red accent on hover
- Hover effect: slight scale up + enhanced glow

### 3. Edit Mode
- Click edit icon to enable inline editing
- Text input replaces todo text
- Save (Check icon) and Cancel (X icon) buttons appear
- Smooth transition between view and edit modes

### 4. Stats Display
- Show total tasks count
- Show completed tasks count with percentage
- Use glass card with icons (CheckCircle2, ListTodo from lucide-react)
- Animate number changes

### 5. Empty State
- Show when no todos exist
- Use ClipboardList icon from lucide-react
- Encouraging message: "No tasks yet. Add one to get started!"
- Subtle animation (gentle fade in/pulse)

## Technical Requirements

### Tech Stack
- Next.js 14 with App Router
- TypeScript with proper types
- Tailwind CSS (use arbitrary values for glass effects)
- lucide-react for icons
- Client component ('use client' directive)

### State Management
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
```

Use useState hooks for:
- `todos: Todo[]`
- `inputValue: string`
- `editingId: string | null`
- `editText: string`

### Animations
Use Tailwind's transition and animation utilities:
- `transition-all duration-300`
- `hover:scale-105`
- `animate-fade-in`
- `hover:shadow-lg`
- Add custom animations in Tailwind config if needed

### Glassmorphism CSS
```css
backdrop-blur-md
bg-white/30 or bg-white/70
border border-white/20
shadow-xl
```

### Gradient Background
- Use animated gradient with `bg-gradient-to-br`
- Colors: from-purple-400 via-pink-500 to-red-500
- Add subtle animation with custom CSS or Tailwind animate

## Component Structure

Create a single-file component named `TodoApp` with:
1. TodoInput subcomponent (or inline)
2. TodoItem subcomponent (or inline) 
3. TodoStats subcomponent (or inline)
4. EmptyState subcomponent (or inline)

## Accessibility
- Proper ARIA labels for buttons
- Keyboard navigation support
- Focus visible styles
- Good color contrast

## Example Color Palette
- Background gradient: purple-400, pink-500, blue-500, cyan-400
- Glass cards: white with 30-70% opacity
- Text: gray-800 for primary, gray-600 for secondary
- Accent: purple-600 for buttons
- Success: green-500 for completed
- Danger: red-500 for delete

## Expected Output
Generate a complete, production-ready Next.js component with:
- Beautiful glassmorphism design
- Smooth animations throughout
- All features working (add, edit, delete, toggle)
- Responsive layout (mobile-friendly)
- Clean, modern UI that feels premium

Please create the full component code with inline styles using Tailwind CSS classes.
