import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (class name utility)', () => {
    it('should merge class names correctly', () => {
        const result = cn('px-4', 'py-2');
        expect(result).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
        const isActive = true;
        const result = cn('base-class', isActive && 'active-class');
        expect(result).toContain('base-class');
        expect(result).toContain('active-class');
    });

    it('should handle falsy values', () => {
        const result = cn('base-class', false, null, undefined, 'another-class');
        expect(result).toBe('base-class another-class');
    });

    it('should resolve Tailwind conflicts (last wins)', () => {
        const result = cn('px-4', 'px-8');
        expect(result).toBe('px-8');
    });
});
