import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('handles undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('merges tailwind classes correctly', () => {
      // tailwind-merge should handle conflicting classes
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toContain('px-4');
      expect(result).toContain('py-1');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });

    it('handles array input', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles object input with boolean values', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });
  });
});

