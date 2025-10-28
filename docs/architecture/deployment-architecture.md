# Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (automatic)
- **CDN/Edge:** Vercel Edge Network (global distribution)
- **Static Generation:** Next.js builds static HTML at build time

**Deployment Process:**
1. Push code to GitHub repository
2. Vercel automatically detects changes (via GitHub integration)
3. Runs `npm run build` to generate static assets
4. Deploys to global CDN
5. Provides unique preview URL for each PR
6. Production deployment on merge to main branch

**No Backend Deployment:** Application is entirely client-side, no server or API deployment needed.

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Environments

| Environment | Frontend URL | Purpose | Deployment |
|-------------|-------------|---------|------------|
| Development | `http://localhost:3000` | Local development | Manual (npm run dev) |
| Preview | `https://<branch>-todo-app.vercel.app` | PR previews and testing | Automatic on PR |
| Production | `https://todo-app.vercel.app` | Live application | Automatic on merge to main |
