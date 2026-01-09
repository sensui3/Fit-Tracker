import React, { useEffect } from 'react';
import { Button } from '../ui/Button';
import { useTimerStore } from '../../stores/useTimerStore';

interface RestTimerProps {
    onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ onClose }) => {
    const {
        timeLeft,
        isActive,
        tick,
        stopTimer,
        adjustTime,
        initialTime,
        setTimeLeft
    } = useTimerStore();

    useEffect(() => {
        if (!isActive) {
            onClose();
            return;
        }

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, tick, onClose]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    return (
        <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-0 w-full flex justify-center z-40 pointer-events-none px-4">
            <div className="pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/10 dark:ring-black/10">
                <div className="flex items-center gap-3 pr-5 border-r border-white/10 dark:border-black/10">
                    <div className="size-10 rounded-full bg-[#16a34a] flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-white">timer</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none">Descanso</span>
                        <span className="text-2xl font-black tabular-nums leading-tight w-[64px]">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => adjustTime(-10)}
                        className="size-9 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-black"
                        title="-10s"
                    >
                        <span className="text-xs font-bold">-10</span>
                    </button>
                    <button
                        onClick={() => adjustTime(10)}
                        className="size-9 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-black"
                        title="+10s"
                    >
                        <span className="text-xs font-bold">+10</span>
                    </button>
                    <button
                        onClick={() => setTimeLeft(initialTime)}
                        className="size-9 flex items-center justify-center rounded-full bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors text-slate-300 dark:text-slate-600 hover:text-white dark:hover:text-black"
                        title={`Reiniciar (${initialTime}s)`}
                    >
                        <span className="material-symbols-outlined text-xl">replay</span>
                    </button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={stopTimer}
                        className="ml-2"
                    >
                        Pular
                    </Button>
                </div>
            </div>
        </div>
    );
};
