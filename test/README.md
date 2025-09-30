# Testing Setup for Git Garden

This directory contains test configuration and utilities for the Git Garden project.

## Test Framework

- **Vitest**: Fast unit test framework for Vite projects
- **React Testing Library**: Testing utilities for React components
- **jsdom**: DOM environment for testing

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
test/
├── setup.ts          # Global test setup and mocks
├── mocks/            # Mock data and API responses (created as needed)
└── README.md         # This file
```

## Writing Tests

### Component Tests

Create test files alongside components with `.test.tsx` extension:

```typescript
// client/src/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Hook Tests

Test custom hooks:

```typescript
// client/src/hooks/use-mobile.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMobile } from './use-mobile';

describe('useMobile', () => {
  it('returns mobile state', () => {
    const { result } = renderHook(() => useMobile());
    expect(typeof result.current).toBe('boolean');
  });
});
```

### Utility Tests

Test utility functions:

```typescript
// client/src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
});
```

## Test Utilities

The `test/setup.ts` file provides:

- Global test matchers from `@testing-library/jest-dom`
- Automatic cleanup after each test
- Mocks for browser APIs:
  - `window.matchMedia`
  - `IntersectionObserver`
  - `ResizeObserver`

## Coverage Thresholds

Minimum coverage requirements (configured in `vitest.config.ts`):

- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Keep tests simple** - One assertion per test when possible
4. **Mock external dependencies** - API calls, browser APIs, etc.
5. **Test accessibility** - Use `getByRole` to ensure proper ARIA attributes

## Debugging Tests

```bash
# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --grep "Button"

# Run with verbose output
npm test -- --reporter=verbose
```

## CI Integration

Tests run automatically in CI:
- On every push to feature branches
- On pull requests to master
- Coverage reports uploaded to CI artifacts

