import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [time, setTime] = useState(0); // in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{ id: number; lapTime: number; totalTime: number }[]>([]);
  const [timerDuration, setTimerDuration] = useState(60); // default 60s for timer mode

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const lastLapTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();

      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;

        if (mode === 'stopwatch') {
          setTime(accumulatedTimeRef.current + elapsed);
        } else {
          const remaining = (timerDuration * 1000) - (accumulatedTimeRef.current + elapsed);
          if (remaining <= 0) {
            setTime(0);
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            // Alert user or play sound logic could go here
          } else {
            setTime(remaining);
          }
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, timerDuration]);

  const toggleTimer = () => {
    if (isRunning) {
      // Pause
      if (mode === 'stopwatch') {
        accumulatedTimeRef.current = time;
      } else {
        accumulatedTimeRef.current = (timerDuration * 1000) - time;
      }
      setIsRunning(false);
    } else {
      // Start
      if (time === 0 && mode === 'timer') {
        setTime(timerDuration * 1000);
        accumulatedTimeRef.current = 0;
      }
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      setTime(0);
      accumulatedTimeRef.current = 0;
    } else {
      setTime(timerDuration * 1000);
      accumulatedTimeRef.current = 0;
    }
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const recordLap = () => {
    if (mode === 'timer') return; // Laps only for stopwatch
    if (!isRunning && time === 0) return;

    const currentTotalTime = time;
    const lapTime = currentTotalTime - lastLapTimeRef.current;

    setLaps(prev => [
      { id: prev.length + 1, lapTime, totalTime: currentTotalTime },
      ...prev
    ]);
    lastLapTimeRef.current = currentTotalTime;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      min: Math.max(0, minutes).toString().padStart(2, '0'),
      sec: Math.max(0, seconds).toString().padStart(2, '0'),
      ms: Math.max(0, milliseconds).toString().padStart(2, '0')
    };
  };

  const adjustTimer = (seconds: number) => {
    if (isRunning) return;
    const newDuration = Math.max(10, timerDuration + seconds);
    setTimerDuration(newDuration);
    setTime(newDuration * 1000);
    accumulatedTimeRef.current = 0;
  };

  const display = formatTime(time);

  return (
    <div className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Foco Total</h2>
        <p className="text-slate-500 dark:text-gray-400 text-lg">Cronômetro de alta precisão para seus treinos.</p>
      </div>

      {/* Timer Card */}
      <div className="w-full max-w-3xl bg-white dark:bg-surface-dark rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-[#2a402a] p-6 sm:p-10 flex flex-col items-center gap-8">

        {/* Segmented Control */}
        <div className="w-full max-w-sm bg-slate-100 dark:bg-[#0a160a] p-1.5 rounded-xl flex items-center mb-2">
          <button
            onClick={() => {
              if (isRunning) return;
              setMode('stopwatch');
              setTime(0);
              accumulatedTimeRef.current = 0;
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'stopwatch' ? 'bg-white dark:bg-[#1f331f] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Cronômetro
          </button>
          <button
            onClick={() => {
              if (isRunning) return;
              setMode('timer');
              setTime(timerDuration * 1000);
              accumulatedTimeRef.current = 0;
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'timer' ? 'bg-white dark:bg-[#1f331f] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Temporizador
          </button>
        </div>

        {/* Timer Settings (Only for Timer Mode) */}
        {mode === 'timer' && !isRunning && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <button onClick={() => adjustTimer(-30)} className="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">-30s</button>
            <button onClick={() => adjustTimer(-10)} className="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">-10s</button>
            <div className="px-4 py-1 bg-primary-DEFAULT/10 rounded-full">
              <span className="text-xs font-black text-primary-DEFAULT uppercase tracking-widest">Ajustar</span>
            </div>
            <button onClick={() => adjustTimer(10)} className="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">+10s</button>
            <button onClick={() => adjustTimer(30)} className="size-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">+30s</button>
          </div>
        )}

        {/* Digital Timer Display - FIXED FOR SHAKING */}
        <div className="flex items-end justify-center gap-1 sm:gap-3 font-mono tabular-nums tracking-tight select-none py-4 bg-slate-50/50 dark:bg-black/20 px-8 rounded-3xl border border-transparent hover:border-primary-DEFAULT/10 transition-colors">
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 dark:text-white leading-none w-[2ch] text-center">
              {display.min}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mt-2">Min</span>
          </div>

          {/* Separator */}
          <div className={`text-4xl sm:text-6xl md:text-7xl font-light text-slate-300 dark:text-slate-700 mb-6 sm:mb-8 md:mb-10 ${isRunning ? 'animate-pulse' : ''}`}>
            :
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black text-slate-900 dark:text-white leading-none w-[2ch] text-center">
              {display.sec}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mt-2">Seg</span>
          </div>

          {/* Milliseconds */}
          <div className="flex flex-col items-start justify-end pb-2 sm:pb-3 md:pb-4 ml-1">
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#16a34a] dark:text-[#13ec13] leading-none w-[2ch]">
              <span className="text-2xl sm:text-3xl opacity-30 mr-0.5">.</span>
              {display.ms}
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 w-full pt-4 border-t border-slate-100 dark:border-white/5">
          {/* Reset Button */}
          <button onClick={resetTimer} className="group flex flex-col items-center gap-3">
            <div className="size-14 sm:size-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all transform active:scale-95">
              <span className="material-symbols-outlined text-3xl">replay</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Zerar</span>
          </button>

          {/* Play/Pause Button (Primary) */}
          <button onClick={toggleTimer} className="group flex flex-col items-center gap-3 relative -top-6">
            <div className={`size-20 sm:size-24 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ${isRunning ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#16a34a] dark:bg-[#13ec13] text-white dark:text-[#0d3b0d] shadow-green-500/30'}`}>
              <span className="material-symbols-outlined text-5xl fill-1">{isRunning ? 'pause' : 'play_arrow'}</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>

          {/* Lap Button */}
          <button
            onClick={recordLap}
            disabled={mode === 'timer'}
            className={`group flex flex-col items-center gap-3 ${mode === 'timer' ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <div className="size-14 sm:size-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all transform active:scale-95">
              <span className="material-symbols-outlined text-3xl">flag</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Volta</span>
          </button>
        </div>
      </div>

      {/* Laps History */}
      <div className="w-full max-w-3xl mt-12">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16a34a]">history</span>
            Voltas Recentes
          </h3>
          {laps.length > 0 && (
            <span className="text-xs font-bold bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
              Total: {formatTime(time).min}m {formatTime(time).sec}s
            </span>
          )}
        </div>

        {laps.length > 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-[#2a402a] overflow-hidden shadow-sm">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-[#152315] z-10">
                  <tr className="border-b border-slate-200 dark:border-[#2a402a] text-xs uppercase text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-6 font-bold w-24">#</th>
                    <th className="py-3 px-6 font-bold">Tempo da Volta</th>
                    <th className="py-3 px-6 font-bold text-right">Tempo Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2a402a]">
                  {laps.map((lap, index) => {
                    const lapDisplay = formatTime(lap.lapTime);
                    const totalDisplay = formatTime(lap.totalTime);
                    const isFastest = index === laps.length - 1 && laps.length > 1; // Simplification (usually implies calculating best lap)

                    return (
                      <tr key={lap.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-bold text-sm">
                          {String(lap.id).padStart(2, '0')}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-lg tabular-nums">
                          {lapDisplay.min}:{lapDisplay.sec}.<span className="text-sm text-slate-400">{lapDisplay.ms}</span>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-500 tabular-nums font-medium">
                          {totalDisplay.min}:{totalDisplay.sec}.{totalDisplay.ms}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-200 dark:border-[#2a402a] rounded-2xl bg-slate-50/50 dark:bg-transparent">
            <div className="size-12 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl opacity-50">timer_off</span>
            </div>
            <p className="text-sm font-medium">Nenhuma volta registrada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;