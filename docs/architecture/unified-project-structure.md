# Unified Project Structure

```
todo-app/
├── .github/                      # GitHub configuration
│   └── workflows/
│       └── ci.yml                # GitHub Actions (if needed)
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout (HTML, body, fonts)
│   ├── page.tsx                  # Home page (renders TodoApp)
│   ├── error.tsx                 # Error boundary page
│   ├── globals.css               # Global styles (Tailwind directives)
│   └── favicon.ico               # App icon
├── components/                   # React components
│   ├── TodoApp.tsx               # Main app container (client component)
│   ├── TodoInput.tsx             # Add todo input field
│   ├── TodoList.tsx              # Todo list container
│   ├── TodoItem.tsx              # Individual todo item
│   ├── Toast.tsx                 # Toast notification
│   └── EmptyState.tsx            # Empty state view
├── lib/                          # Business logic and utilities
│   ├── hooks/
│   │   └── useTodos.ts           # Custom hook for todo management
│   ├── services/
│   │   └── todoStorage.ts        # localStorage wrapper service
│   └── utils/
│       └── validation.ts         # Validation utilities
├── types/                        # TypeScript type definitions
│   └── todo.ts                   # Todo interface and types
├── __tests__/                    # Test files (mirrors src structure)
│   ├── components/
│   │   ├── TodoApp.test.tsx
│   │   ├── TodoInput.test.tsx
│   │   ├── TodoItem.test.tsx
│   │   └── Toast.test.tsx
│   ├── lib/
│   │   ├── hooks/
│   │   │   └── useTodos.test.ts
│   │   └── services/
│   │       └── todoStorage.test.ts
│   └── setup.ts                  # Jest setup file
├── docs/                         # Documentation
│   ├── prd.md                    # Product Requirements Document
│   ├── project-brief.md          # Project brief
│   └── architecture.md           # This document
├── public/                       # Static assets
│   └── (icons, images if needed)
├── .env.example                  # Environment variables template
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Prettier configuration
├── jest.config.js                # Jest configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS config (for Tailwind)
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```
