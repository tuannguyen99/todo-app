# Tech Stack

The following table represents the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions and technologies.

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe JavaScript superset | Enables strict type checking (NFR6), catches errors at compile time, provides excellent IDE support, and serves as living documentation |
| **Frontend Framework** | Next.js | 14.2+ | React framework with App Router | Modern App Router paradigm, built-in optimization, static generation, excellent DX, and Vercel deployment integration |
| **UI Library** | React | 18.3+ | Component-based UI library | Industry standard, large ecosystem, hooks API for state management, and Next.js requirement |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first CSS framework | Rapid UI development, built-in responsive design, consistent design tokens, minimal custom CSS, and excellent Next.js integration |
| **UI Component Library** | None (Custom) | N/A | Build components from scratch | Learning objective to understand component architecture; Tailwind provides sufficient styling primitives |
| **State Management** | React Hooks | Built-in | Client-side state management | useState/useEffect sufficient for single-view CRUD app; no Redux/Zustand needed per PRD requirements |
| **Data Storage** | Browser LocalStorage | Native API | Client-side persistence | Meets PRD requirement for session persistence; no backend needed; ~5-10MB quota sufficient for todo data |
| **ID Generation** | crypto.randomUUID() | Native API | Unique ID generation | Browser-native, no dependencies, cryptographically secure, and simpler than UUID libraries |
| **Frontend Testing** | Jest + React Testing Library | 29+ / 14+ | Unit and component testing | Industry standard for React testing, excellent Next.js integration, and supports PRD's 70% coverage goal |
| **E2E Testing** | None (MVP) | N/A | End-to-end testing | Deferred post-MVP per PRD; Jest + RTL sufficient for initial quality |
| **Type Checking** | TypeScript Compiler | 5.3+ | Static type validation | Enforces strict mode, prevents runtime errors, and validates all code before build |
| **Linting** | ESLint | 8.56+ | Code quality and standards | Next.js recommended config, catches common errors, enforces consistent style |
| **Code Formatting** | Prettier | 3.2+ | Automated code formatting | Consistent formatting, integrates with ESLint, reduces code review friction |
| **Build Tool** | Next.js CLI | 14.2+ | Build and development server | Handles TypeScript compilation, bundling, optimization, and static generation |
| **Bundler** | Webpack (via Next.js) | 5+ | Module bundling | Next.js default bundler, production-optimized output, tree-shaking, code splitting |
| **Package Manager** | npm | 10+ | Dependency management | Node.js default, simple for single-package structure, lockfile for reproducible builds |
| **Node Runtime** | Node.js | 18+ | Development environment | Aligns with Next.js 14 requirements, LTS version, modern JavaScript features |
| **CI/CD** | Vercel (Auto) | N/A | Continuous deployment | Automatic deployment on git push, preview deployments for PRs, zero configuration |
| **Monitoring** | Vercel Analytics | Free tier | Basic performance monitoring | Web Vitals tracking, page load metrics, sufficient for learning project |
| **Error Tracking** | Console + React Error Boundary | Native | Runtime error handling | Built-in error boundaries for graceful degradation; external tools (Sentry) deferred post-MVP |
