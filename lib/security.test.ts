import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitize, checkRateLimit, scrubData, loginSchema, workoutSchema } from './security';

describe('Security Utils', () => {
    describe('sanitize', () => {
        it('should remove script tags', () => {
            const input = '<script>alert("xss")</script>Hello';
            expect(sanitize(input)).toBe('Hello');
        });

        it('should keep safe HTML', () => {
            const input = '<b>Hello</b>';
            expect(sanitize(input)).toBe('<b>Hello</b>');
        });

        it('should handle empty input', () => {
            expect(sanitize('')).toBe('');
        });
    });

    describe('checkRateLimit', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        it('should allow first call', () => {
            expect(checkRateLimit('test-key')).toBe(true);
        });

        it('should block second call within limit', () => {
            checkRateLimit('test-key', 1000);
            expect(checkRateLimit('test-key', 1000)).toBe(false);
        });

        it('should allow call after limit passed', () => {
            checkRateLimit('test-key', 1000);
            vi.advanceTimersByTime(1100);
            expect(checkRateLimit('test-key', 1000)).toBe(true);
        });
    });

    describe('scrubData', () => {
        it('should redact emails from strings', () => {
            const input = 'Contact me at test@example.com';
            expect(scrubData(input)).toBe('Contact me at [EMAIL_REDACTED]');
        });

        it('should redact passwords from strings', () => {
            const input = 'password=secret123&other=data';
            expect(scrubData(input)).toBe('password=[REDACTED]&other=data');
        });

        it('should redact sensitive keys from objects', () => {
            const input = {
                username: 'user1',
                password: 'password123',
                email: 'test@test.com',
                nested: {
                    token: 'abc-123'
                }
            };
            const expected = {
                username: 'user1',
                password: '[REDACTED]',
                email: '[REDACTED]',
                nested: {
                    token: '[REDACTED]'
                }
            };
            expect(scrubData(input)).toEqual(expected);
        });

        it('should handle null and undefined', () => {
            expect(scrubData(null)).toBe(null);
            expect(scrubData(undefined)).toBe(undefined);
        });

        it('should redact items in arrays', () => {
            const input = [{ email: 'a@b.com' }, 'password=123'];
            const result = scrubData(input);
            expect(result[0].email).toBe('[REDACTED]');
            expect(result[1]).toBe('password=[REDACTED]');
        });

        it('should handle non-string non-object data', () => {
            expect(scrubData(123)).toBe(123);
            expect(scrubData(true)).toBe(true);
        });
    });

    describe('Validation Schemas', () => {
        describe('loginSchema', () => {
            it('should validate correct login data', () => {
                const result = loginSchema.safeParse({
                    email: 'test@example.com',
                    password: 'password123'
                });
                expect(result.success).toBe(true);
            });

            it('should fail on invalid email', () => {
                const result = loginSchema.safeParse({
                    email: 'invalid-email',
                    password: 'password123'
                });
                expect(result.success).toBe(false);
            });

            it('should fail on short password', () => {
                const result = loginSchema.safeParse({
                    email: 'test@example.com',
                    password: '123'
                });
                expect(result.success).toBe(false);
            });
        });

        describe('workoutSchema', () => {
            it('should validate correct workout data', () => {
                const result = workoutSchema.safeParse({
                    exerciseName: 'Bench Press',
                    sets: [{ reps: 10, weight: 60 }],
                    date: '2023-10-01'
                });
                expect(result.success).toBe(true);
            });

            it('should fail on negative reps', () => {
                const result = workoutSchema.safeParse({
                    exerciseName: 'Bench Press',
                    sets: [{ reps: -5, weight: 60 }],
                    date: '2023-10-01'
                });
                expect(result.success).toBe(false);
            });
        });
    });
});
