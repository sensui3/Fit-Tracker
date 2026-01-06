import React, { memo } from 'react';
import { WorkoutSetDraft } from '../../stores/useWorkoutStore';

interface WorkoutSetItemProps {
    set: WorkoutSetDraft;
    index: number;
    onUpdate: (id: number, field: keyof WorkoutSetDraft, value: any) => void;
    onRemove: (id: number) => void;
}

export const WorkoutSetItem = memo(({ set, index, onUpdate, onRemove }: WorkoutSetItemProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className={`grid grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-300 p-2 rounded-2xl border transition-all ${set.completed ? 'bg-green-50/50 dark:bg-green-900/10 border-[#16a34a]/30' : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-white/5 shadow-sm'}`}>
                <div className="col-span-2 flex justify-center">
                    <div className={`size-9 rounded-full font-black text-xs flex items-center justify-center transition-colors ${set.completed ? 'bg-[#16a34a] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                        {index + 1}
                    </div>
                </div>

                <div className="col-span-3">
                    <input
                        type="number"
                        value={set.weight || ''}
                        disabled={set.completed}
                        placeholder="0.0"
                        onChange={(e) => onUpdate(set.id, 'weight', parseFloat(e.target.value) || 0)}
                        className={`w-full h-12 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] outline-none transition-all ${set.completed ? 'bg-slate-100/50 dark:bg-white/5 opacity-70 cursor-not-allowed border-transparent' : 'bg-slate-50 dark:bg-background-dark/50'}`}
                    />
                </div>

                <div className="col-span-3">
                    <input
                        type="number"
                        value={set.reps || ''}
                        disabled={set.completed}
                        placeholder="0"
                        onChange={(e) => onUpdate(set.id, 'reps', parseFloat(e.target.value) || 0)}
                        className={`w-full h-12 border border-slate-200 dark:border-white/10 rounded-xl px-3 text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] outline-none transition-all ${set.completed ? 'bg-slate-100/50 dark:bg-white/5 opacity-70 cursor-not-allowed border-transparent' : 'bg-slate-50 dark:bg-background-dark/50'}`}
                    />
                </div>

                <div className="col-span-4 flex justify-center gap-2">
                    <button
                        onClick={() => onUpdate(set.id, 'showNotes', !set.showNotes)}
                        title={set.notes ? "Ver Nota" : "Adicionar Nota"}
                        className={`size-10 rounded-lg flex items-center justify-center transition-all ${set.showNotes || set.notes
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${set.notes ? 'filled' : ''}`}>
                            {set.notes ? 'description' : 'sticky_note_2'}
                        </span>
                    </button>
                    <button
                        onClick={() => onUpdate(set.id, 'completed', !set.completed)}
                        title={set.completed ? "Editar Série" : "Finalizar Série"}
                        className={`size-10 rounded-lg flex items-center justify-center transition-all ${set.completed
                            ? 'bg-[#16a34a] text-white shadow-lg shadow-green-500/20'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-[#16a34a] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {set.completed ? 'edit' : 'check'}
                        </span>
                    </button>
                    <button
                        onClick={() => onRemove(set.id)}
                        className="size-10 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>

            {set.showNotes && (
                <div className="col-span-12 -mt-2 animate-in fade-in slide-in-from-top-1">
                    <textarea
                        value={set.notes || ''}
                        onChange={(e) => onUpdate(set.id, 'notes', e.target.value)}
                        placeholder="Adicione observações sobre a execução..."
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-border-dark rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y min-h-[60px]"
                    />
                </div>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for even better performance
    return (
        prevProps.set.id === nextProps.set.id &&
        prevProps.set.weight === nextProps.set.weight &&
        prevProps.set.reps === nextProps.set.reps &&
        prevProps.set.completed === nextProps.set.completed &&
        prevProps.set.notes === nextProps.set.notes &&
        prevProps.set.showNotes === nextProps.set.showNotes &&
        prevProps.index === nextProps.index
    );
});
