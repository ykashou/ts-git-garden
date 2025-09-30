# Vitest Setup Instructions

This document describes the Vitest testing setup for Git Garden (Issue #4).

## What Was Configured

### 1. Test Framework
- **Vitest 2.1.8** - Fast unit test framework
- **@vitest/ui 2.1.8** - Interactive UI for test results
- **@vitest/coverage-v8 2.1.8** - Code coverage reporting

### 2. React Testing Utilities
- **@testing-library/react 16.1.0** - React component testing utilities
- **@testing-library/jest-dom 6.6.3** - Custom matchers for DOM assertions
- **@testing-library/user-event 14.5.2** - User interaction simulation
- **jsdom 25.0.1** - DOM environment for Node.js

### 3. Configuration Files

#### `vitest.config.ts`
- Configured React plugin
- Set jsdom as test environment
- Configured path aliases (@, @shared)
- Set up code coverage with 80% thresholds
- Configured HTML, JSON, and LCOV coverage reports

#### `test/setup.ts`
- Global test setup
- Automatic cleanup after each test
- Mocks for browser APIs (matchMedia, IntersectionObserver, ResizeObserver)
- Extended expect with jest-dom matchers

#### `package.json`
Added test scripts:
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

### 4. Sample Test
Created `client/src/lib/utils.test.ts` as an example test file.

## Installation

To install the dependencies, run:

```bash
npm install
```

This will install all the testing dependencies listed in `devDependencies`.

## Running Tests

### Watch Mode (Development)
```bash
npm test
```

### Single Run (CI)
```bash
npm run test:run
```

### With UI
```bash
npm run test:ui
```
Opens interactive UI at http://localhost:51204

### With Coverage
```bash
npm run test:coverage
```

Coverage reports will be generated in:
- `coverage/` directory (HTML report)
- Terminal output (text summary)

## Coverage Thresholds

The following coverage thresholds are enforced:
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

Tests will fail if coverage drops below these thresholds.

## Next Steps

After running `npm install`, you can:

1. Run the sample test:
   ```bash
   npm test utils.test.ts
   ```

2. Start writing tests for components (Issue #6-#9)

3. Write tests for hooks (Issue #10)

4. Write tests for utilities (Issue #11)

5. Write integration tests (Issue #12)

## Verifying Setup

To verify the setup is working:

```bash
# 1. Install dependencies
npm install

# 2. Run the sample test
npm run test:run

# 3. Check coverage
npm run test:coverage
```

You should see:
- ✓ Tests passing
- Coverage report generated
- No errors

## Troubleshooting

### Issue: "Cannot find module 'vitest'"
**Solution**: Run `npm install` first

### Issue: "Environment jsdom not found"
**Solution**: Ensure jsdom is installed: `npm install -D jsdom`

### Issue: Coverage thresholds not met
**Solution**: Write more tests or adjust thresholds in `vitest.config.ts`

### Issue: Browser API errors (matchMedia, IntersectionObserver)
**Solution**: These are mocked in `test/setup.ts` - ensure setup file is loaded

## Documentation

- [Test Directory README](./test/README.md)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## Issue Reference

This setup closes Issue #4: Set up Vitest testing framework

