import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTimerStore } from './useTimerStore';

describe('useTimerStore', () => {
    beforeEach(() => {
        useTimerStore.getState().stopTimer();
    });

    it('should initial state be inactive', () => {
        const state = useTimerStore.getState();
        expect(state.timeLeft).toBe(0);
        expect(state.isActive).toBe(false);
    });

    it('should start timer and set initial duration', () => {
        useTimerStore.getState().startTimer(60);

        expect(useTimerStore.getState().timeLeft).toBe(60);
        expect(useTimerStore.getState().initialTime).toBe(60);
        expect(useTimerStore.getState().isActive).toBe(true);
    });

    it('should tick decrease timeLeft', () => {
        useTimerStore.getState().startTimer(60);
        useTimerStore.getState().tick();

        expect(useTimerStore.getState().timeLeft).toBe(59);
    });

    it('should stop timer when tick reaches 0', () => {
        useTimerStore.getState().startTimer(1);
        useTimerStore.getState().tick();

        expect(useTimerStore.getState().timeLeft).toBe(0);
        expect(useTimerStore.getState().isActive).toBe(false);
    });

    it('should adjust time', () => {
        useTimerStore.getState().startTimer(60);
        useTimerStore.getState().adjustTime(10);
        expect(useTimerStore.getState().timeLeft).toBe(70);

        useTimerStore.getState().adjustTime(-20);
        expect(useTimerStore.getState().timeLeft).toBe(50);
    });

    it('should not adjust time below 0', () => {
        useTimerStore.getState().startTimer(10);
        useTimerStore.getState().adjustTime(-20);
        expect(useTimerStore.getState().timeLeft).toBe(0);
    });
});
