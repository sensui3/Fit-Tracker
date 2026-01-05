import React, { useState, useMemo } from 'react';
import { EXERCISES, MUSCLE_FILTERS } from '../../data/exercises';
import { Exercise } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ExerciseSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (exercise: Exercise) => void;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({
    isOpen,
    onClose,
    onSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = !activeFilter || ex.muscle_group === activeFilter || ex.muscle === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, activeFilter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-surface-dark w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02] shrink-0">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Selecionar Exercício</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="p-6 space-y-4 border-b border-slate-100 dark:border-white/5 shrink-0">
                    <Input
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<span className="material-symbols-outlined">search</span>}
                    />

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === null
                                    ? 'bg-[#16a34a] text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                }`}
                        >
                            Todos
                        </button>
                        {MUSCLE_FILTERS.map(m => (
                            <button
                                key={m}
                                onClick={() => setActiveFilter(m)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === m
                                        ? 'bg-[#16a34a] text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercises List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {filteredExercises.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredExercises.map(ex => (
                                <button
                                    key={ex.id}
                                    onClick={() => {
                                        onSelect(ex);
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-[#16a34a]/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group"
                                >
                                    <div className="size-16 rounded-lg overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
                                        <img
                                            src={ex.image_url || ex.image}
                                            alt={ex.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{ex.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                                            {ex.muscle_group || ex.muscle}
                                        </p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                                            {ex.equipment}
                                        </p>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[#16a34a]">add_circle</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                            <p className="font-bold">Nenhum exercício encontrado</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex justify-end shrink-0">
                    <Button variant="ghost" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};
