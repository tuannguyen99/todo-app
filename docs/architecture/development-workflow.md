# Development Workflow

### Local Development Setup

**Prerequisites:**

```bash
# Required software
Node.js 18+ and npm 10+
Git
A code editor (VS Code recommended)
```

**Initial Setup:**

```bash
# Clone repository
git clone <repository-url>
cd todo-app

# Install dependencies
npm install

# Copy environment template (if needed)
cp .env.example .env.local

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

**Development Commands:**

```bash
# Start development server with hot reload
npm run dev

# Run TypeScript type checking
npm run type-check

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Start production server locally
npm start
```

### Environment Configuration

**Required Environment Variables:**

```bash
# Frontend (.env.local)
# None required for MVP - all client-side

# Future environment variables (post-MVP)
# NEXT_PUBLIC_API_URL=          # If adding backend later
# NEXT_PUBLIC_ANALYTICS_ID=      # If adding analytics
```

**Note:** Since this is a client-side only application, no environment variables are required for the MVP. All configuration is handled through constants in the codebase.
