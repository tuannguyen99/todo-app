# Coding Standards

### Critical Rules for AI Agents

These rules prevent common mistakes and ensure consistency. **All code must follow these standards.**

- **TypeScript Strict Mode:** Always use strict type checking; never use `any` type without explicit justification
- **Component Naming:** Components use PascalCase with descriptive names (e.g., `TodoInput`, not `Input`)
- **Props Interfaces:** All component props must have explicit TypeScript interfaces defined above the component
- **Client Components:** Mark all interactive components with `'use client'` directive at the top of the file
- **Import Paths:** Use absolute imports with `@/` prefix (e.g., `import { Todo } from '@/types/todo'`)
- **Error Handling:** All localStorage operations must be wrapped in try-catch with user-friendly error messages
- **Validation:** Always validate user input before processing (use validation utilities)
- **Accessibility:** All interactive elements must have proper ARIA labels and keyboard support
- **No Magic Numbers:** Use named constants from TODO_CONSTRAINTS for all limits and config values
- **Test Coverage:** Every new component/function must have corresponding test file
- **CSS Classes:** Use Tailwind utility classes; avoid custom CSS except for animations
- **State Updates:** Never mutate state directly; always use setState with new objects/arrays

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `TodoItem.tsx` |
| Hooks | camelCase with 'use' prefix | `useTodos.ts` |
| Utilities | camelCase | `validation.ts` |
| Types/Interfaces | PascalCase | `Todo`, `TodoItemProps` |
| Constants | UPPER_SNAKE_CASE | `TODO_CONSTRAINTS` |
| Functions | camelCase | `addTodo`, `isValidTodoText` |
| Variables | camelCase | `todoList`, `isEditing` |
| CSS Classes | Tailwind utilities | `flex items-center gap-2` |
