import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
    isActive: boolean;
    timeLeft: number;
    initialTime: number;
    startTimer: (duration: number) => void;
    stopTimer: () => void;
    setTimeLeft: (time: number) => void;
    adjustTime: (seconds: number) => void;
    tick: () => void;
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set) => ({
            isActive: false,
            timeLeft: 0,
            initialTime: 60,
            startTimer: (duration) => set({ isActive: true, timeLeft: duration, initialTime: duration }),
            stopTimer: () => set({ isActive: false, timeLeft: 0 }),
            setTimeLeft: (time) => set({ timeLeft: time }),
            adjustTime: (seconds) => set((state) => ({ timeLeft: Math.max(0, state.timeLeft + seconds) })),
            tick: () => set((state) => {
                if (!state.isActive) return {};
                const newTime = state.timeLeft - 1;
                if (newTime <= 0) {
                    return { isActive: false, timeLeft: 0 };
                }
                return { timeLeft: newTime };
            }),
        }),
        {
            name: 'timer-storage',
        }
    )
);
