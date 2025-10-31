# Todo App

A modern, type-safe todo list application built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

This is a simple and elegant todo list application that allows users to create, read, update, and delete todos. All data is persisted locally in the browser using localStorage, providing a seamless experience without requiring a backend server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18+ (LTS recommended)
- **npm**: 10+ (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tuannguyen99/todo-app.git
cd todo-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

| Script                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Start the development server on http://localhost:3000 |
| `npm run build`         | Build the application for production                  |
| `npm run start`         | Start the production server                           |
| `npm run lint`          | Run ESLint to check for code quality issues           |
| `npm run lint:fix`      | Automatically fix ESLint issues                       |
| `npm run type-check`    | Run TypeScript compiler to check for type errors      |
| `npm test`              | Run all tests                                         |
| `npm run test:watch`    | Run tests in watch mode                               |
| `npm run test:coverage` | Run tests with coverage report                        |
| `npm run format`        | Format all code using Prettier                        |
| `npm run format:check`  | Check if code is formatted correctly                  |

## Tech Stack

| Technology                | Version | Purpose                               |
| ------------------------- | ------- | ------------------------------------- |
| **Next.js**               | 14.2+   | React framework with App Router       |
| **React**                 | 18.3+   | UI library                            |
| **TypeScript**            | 5.3+    | Type-safe JavaScript with strict mode |
| **Tailwind CSS**          | 3.4+    | Utility-first CSS framework           |
| **Jest**                  | 29+     | Testing framework                     |
| **React Testing Library** | 14+     | Component testing                     |
| **ESLint**                | 8.56+   | Code linting                          |
| **Prettier**              | 3.2+    | Code formatting                       |

## Project Structure

```
todo-app/
 app/                    # Next.js App Router
    layout.tsx         # Root layout
    page.tsx           # Home page
    error.tsx          # Error boundary
    globals.css        # Global styles
 components/            # React components
 lib/                   # Business logic and utilities
    hooks/            # Custom React hooks
    services/         # Service layer (storage, etc.)
    utils/            # Utility functions
 types/                 # TypeScript type definitions
 __tests__/            # Test files
    components/       # Component tests
    lib/             # Logic tests
    setup.ts         # Jest setup
 public/               # Static assets
 docs/                 # Documentation
```

## Development Workflow

1. **Create a new feature branch**: `git checkout -b feature/my-feature`
2. **Make your changes**: Write code, add tests
3. **Check types**: `npm run type-check`
4. **Lint your code**: `npm run lint`
5. **Run tests**: `npm test`
6. **Format code**: `npm run format`
7. **Commit your changes**: `git commit -m "feat: add my feature"`
8. **Push to GitHub**: `git push origin feature/my-feature`

## License

ISC

## Author

Todo App Development Team
