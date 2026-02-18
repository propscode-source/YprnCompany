# AGENTS.md

This file provides guidance for AI coding agents operating in this repository.

## Project Overview

Full-stack JavaScript web application for Yayasan Pemerhati Rimba Nusantara (YPRN), an Indonesian nonprofit.
Two independent npm projects share one repo: a React frontend (root) and an Express backend (`backend/`).

| Layer     | Stack                                          |
|-----------|-------------------------------------------------|
| Frontend  | React 19 + Vite 7, Tailwind CSS 3, Framer Motion |
| Backend   | Express 4, PostgreSQL (Supabase), JWT auth       |
| Language  | JavaScript only (JSX) -- no TypeScript           |
| Package   | npm (no monorepo tooling)                        |

## Build / Lint / Dev Commands

### Frontend (run from repo root)

```sh
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build (outputs to dist/)
npm run lint         # ESLint check: eslint .
npm run preview      # Preview production build locally
```

### Backend (run from backend/)

```sh
npm install          # Install dependencies
npm run dev          # Dev server with auto-reload (node --watch server.js)
npm start            # Start Express server
npm run start:prod   # Production mode (cross-env NODE_ENV=production)
npm run migrate      # Run database migrations
npm run seed         # Seed the database
npm run db:setup     # Migrate + seed in sequence
npm run db:reset-password  # Reset admin password
```

### Testing

There is **no test framework** configured. No test files, no test scripts, no test dependencies exist.
If adding tests, use Vitest (natural fit with Vite): `npm install -D vitest` and add a `test`
block to `vite.config.js`.

## Code Style Guidelines

### Formatting

- **No semicolons** -- omit trailing semicolons everywhere
- **Single quotes** for JS strings; **double quotes** for JSX attributes
- **2-space indentation** (no tabs)
- **Trailing commas** in multi-line arrays and objects
- No Prettier configured -- conventions enforced manually

### Module System

- ESM everywhere (`import`/`export`). Never use `require()`.
- Frontend uses Vite's `import.meta.env.VITE_*` for env vars.
- Backend has `"type": "module"` in package.json; uses `import 'dotenv/config'` at top of server.js.
- Backend uses `node:` protocol for built-in modules (e.g., `import process from 'node:process'`).

### Import Ordering

No blank lines between groups. Order:

1. External/library imports (React, react-router-dom, motion, lucide-react)
2. Internal project imports (context, hooks, utils, config, components)
3. CSS/asset imports last

```js
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { useAuth } from '../../context/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../common/Button'
import './styles.css'
```

### Naming Conventions

| Category            | Convention       | Example                          |
|---------------------|------------------|----------------------------------|
| Component files     | PascalCase .jsx  | `ContactForm.jsx`                |
| Hook files          | camelCase .js    | `useLanguage.js`                 |
| Utility/config/data | camelCase .js    | `animations.js`, `api.js`       |
| Directories         | lowercase        | `components/`, `hooks/`, `utils/`|
| Components          | PascalCase       | `PageTransition`, `TeamCard`     |
| Variables/state     | camelCase        | `formData`, `activeDropdown`     |
| Boolean state       | `is`/`has` prefix| `isLoading`, `isScrolled`        |
| Event handlers      | `handle` prefix  | `handleSubmit`, `handleChange`   |
| Env constants       | UPPER_SNAKE_CASE | `JWT_SECRET`, `API_URL`          |

### Component Patterns

- **Arrow function components**: `const MyComponent = () => { ... }` (not function declarations)
- **Default export on separate line at EOF**: `export default MyComponent`
- **Named exports for providers/hooks**: `export const AuthProvider = ...`
- **Destructure props in parameters** with defaults; no PropTypes:

```js
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  // ...
}

export default Button
```

### State Management

- React Context + custom hooks (no Redux/Zustand)
- Custom hooks always validate context:

```js
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}
```

### Styling

- Tailwind CSS utility classes exclusively (no CSS modules)
- Custom utility classes defined globally: `container-custom`, `section-padding`, `card-glow`, `btn-primary`, `gradient-text`
- Conditional classes via template literals with ternaries:

```js
className={`fixed top-0 z-50 transition-all ${
  isScrolled ? 'bg-dark/95 backdrop-blur-xl' : 'bg-transparent'
}`}
```

### Error Handling

**Frontend** -- try/catch/finally with state:

```js
try {
  await login(username, password)
  navigate('/admin/dashboard')
} catch (err) {
  setError(err.message || t('loginPage.errorDefault'))
} finally {
  setIsLoading(false)
}
```

**Backend** -- every route handler wrapped in try/catch:

```js
app.post('/api/resource', async (req, res) => {
  try {
    if (!data) return res.status(400).json({ message: 'Validation error' })
    // ... business logic
    res.json({ message: 'Success', ...result })
  } catch (error) {
    console.error('Route error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
```

- Use parameterized queries (`$1`, `$2`) for all SQL to prevent injection.
- Required env vars validated at startup with `process.exit(1)` on failure.

### API Conventions

- RESTful routes: `GET/POST/PUT/DELETE /api/<resource>[/:id]`
- Auth via JWT Bearer token in Authorization header
- Protected routes use `authMiddleware` as inline middleware argument
- Responses: `{ message: '...' }` for errors, `{ message: '...', ...data }` for success
- HTTP client: plain `fetch` (no axios)

### Comments

- Single-line `//` comments for inline explanations
- `{/* ... */}` for JSX comments
- Decorative section banners in server.js: `// ==================== SECTION ====================`
- Comments may be in Indonesian or English (codebase is bilingual)

### ESLint Configuration

Flat config (`eslint.config.js`) with:
- `js.configs.recommended` + React/hooks/refresh plugins
- `no-unused-vars`: error (ignores PascalCase/UPPER_CASE vars via `varsIgnorePattern: '^[A-Z_]'`)
- ECMAScript 2020, source type `module`
- React version auto-detected
