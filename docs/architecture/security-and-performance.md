# Security and Performance

### Security Requirements

**Frontend Security:**

- **CSP Headers:** Configure Content Security Policy in `next.config.js` to prevent XSS attacks
  ```javascript
  const securityHeaders = [
    {
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
    },
  ];
  ```
- **XSS Prevention:** React's built-in XSS protection via JSX escaping; never use `dangerouslySetInnerHTML`
- **Secure Storage:** Use localStorage only for non-sensitive data; todos are not sensitive but validate all data on load

**Client-Side Security:**

- **Input Validation:** Validate all user input before processing (max length, trim whitespace)
- **Data Validation:** Validate data structure when loading from localStorage to prevent injection
- **Error Messages:** Never expose technical details in error messages shown to users

### Performance Optimization

**Frontend Performance:**

- **Bundle Size Target:** < 200KB initial JavaScript bundle (gzipped)
- **Loading Strategy:** Static generation with client-side hydration for instant loads
- **Caching Strategy:** Leverage Vercel CDN for static assets with immutable caching

**React Performance:**

- **Component Memoization:** Use `React.memo` for TodoItem to prevent unnecessary re-renders
- **Callback Memoization:** Use `useCallback` for event handlers passed to child components
- **List Rendering:** Use proper `key` prop (todo.id) for efficient list updates

**Performance Metrics:**

- **Target Lighthouse Score:** 90+ for Performance, Accessibility, Best Practices, SEO
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2s (meets NFR2)
- **Total Blocking Time:** < 200ms

**Optimization Techniques:**

```typescript
// Memoize TodoItem to prevent re-renders
export const TodoItem = React.memo(({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  // Component implementation
});

// Memoize callbacks in TodoApp
const handleToggle = useCallback(
  (id: string) => {
    toggleTodo(id);
  },
  [toggleTodo]
);

const handleDelete = useCallback(
  (id: string) => {
    deleteTodo(id);
  },
  [deleteTodo]
);
```
