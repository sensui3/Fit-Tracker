import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{ id: number; lapTime: number; totalTime: number }[]>([]);
  
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
        setTime(accumulatedTimeRef.current + elapsed);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      // Pause
      accumulatedTimeRef.current = time;
      setIsRunning(false);
    } else {
      // Start
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
    lastLapTimeRef.current = 0;
  };

  const recordLap = () => {
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
      min: minutes.toString().padStart(2, '0'),
      sec: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0')
    };
  };

  const display = formatTime(time);

  return (
    <div className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Treino de Hoje</h2>
        <p className="text-slate-500 dark:text-gray-400 text-lg">Controle seus intervalos de descanso com precisão.</p>
      </div>

      {/* Timer Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-[#2a402a] p-6 sm:p-10 flex flex-col items-center gap-8">
        
        {/* Segmented Control */}
        <div className="w-full max-w-sm bg-slate-100 dark:bg-[#0a160a] p-1 rounded-xl flex items-center">
          <button 
            onClick={() => setMode('stopwatch')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${mode === 'stopwatch' ? 'bg-white dark:bg-[#1f331f] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Cronômetro
          </button>
          <button 
             onClick={() => setMode('timer')}
             className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${mode === 'timer' ? 'bg-white dark:bg-[#1f331f] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Temporizador
          </button>
        </div>

        {/* Digital Timer Display */}
        <div className="flex items-baseline justify-center font-display tabular-nums tracking-tighter text-slate-900 dark:text-white select-none">
          <div className="flex flex-col items-center mx-2">
            <span className="text-[5rem] sm:text-[8rem] font-bold leading-none">{display.min}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-gray-500 uppercase tracking-widest mt-2">Min</span>
          </div>
          <span className="text-[5rem] sm:text-[8rem] font-bold leading-none text-slate-300 dark:text-gray-700 pb-8">:</span>
          <div className="flex flex-col items-center mx-2">
            <span className="text-[5rem] sm:text-[8rem] font-bold leading-none">{display.sec}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-gray-500 uppercase tracking-widest mt-2">Seg</span>
          </div>
          <span className="text-[5rem] sm:text-[8rem] font-bold leading-none text-slate-300 dark:text-gray-700 pb-8">:</span>
          <div className="flex flex-col items-center mx-2 relative">
            <span className="text-[5rem] sm:text-[8rem] font-bold leading-none text-[#16a34a] dark:text-[#13ec13]">{display.ms}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-gray-500 uppercase tracking-widest mt-2">Ms</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full mt-2">
          {/* Reset Button */}
          <button onClick={resetTimer} className="group flex flex-col items-center gap-2">
            <div className="size-14 sm:size-16 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border-2 border-transparent group-hover:border-slate-300 dark:group-hover:border-white/20">
              <span className="material-symbols-outlined text-3xl">replay</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Zerar</span>
          </button>
          
          {/* Play/Pause Button (Primary) */}
          <button onClick={toggleTimer} className="group flex flex-col items-center gap-2">
            <div className={`size-20 sm:size-24 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 ${isRunning ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-[#16a34a] dark:bg-[#13ec13] text-white dark:text-[#0d3b0d] shadow-green-500/30'}`}>
              <span className="material-symbols-outlined text-5xl">{isRunning ? 'pause' : 'play_arrow'}</span>
            </div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wide">{isRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
          
          {/* Lap Button */}
          <button onClick={recordLap} className="group flex flex-col items-center gap-2">
            <div className="size-14 sm:size-16 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border-2 border-transparent group-hover:border-slate-300 dark:group-hover:border-white/20">
              <span className="material-symbols-outlined text-3xl">flag</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Volta</span>
          </button>
        </div>
      </div>

      {/* Laps History */}
      <div className="w-full max-w-2xl mt-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Voltas Recentes</h3>
          {laps.length > 0 && (
             <span className="text-sm text-slate-500 font-medium">Total: {formatTime(time).min}m {formatTime(time).sec}s</span>
          )}
        </div>
        
        {laps.length > 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-[#2a402a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#2a402a] text-xs uppercase text-slate-500 bg-slate-50 dark:bg-white/5">
                  <th className="py-3 px-6 font-semibold w-24">#</th>
                  <th className="py-3 px-6 font-semibold">Tempo da Volta</th>
                  <th className="py-3 px-6 font-semibold text-right">Tempo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2a402a]">
                {laps.map((lap) => {
                  const lapDisplay = formatTime(lap.lapTime);
                  const totalDisplay = formatTime(lap.totalTime);
                  return (
                    <tr key={lap.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-slate-500 font-medium">{String(lap.id).padStart(2, '0')}</td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white text-lg tabular-nums">
                        {lapDisplay.min}:{lapDisplay.sec}.{lapDisplay.ms}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-500 tabular-nums">
                        {totalDisplay.min}:{totalDisplay.sec}.{totalDisplay.ms}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 dark:border-[#2a402a] rounded-2xl">
            <span className="material-symbols-outlined text-4xl opacity-50">history</span>
            <p className="text-sm">Nenhuma volta registrada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;