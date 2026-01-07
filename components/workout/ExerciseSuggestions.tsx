import React, { memo } from 'react';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Exercise } from '../../types';

interface ExerciseSuggestionsProps {
    exercises: Exercise[];
    highlightedIndex: number;
    onSelect: (exercise: Exercise) => void;
}

export const ExerciseSuggestions = memo(({ exercises, highlightedIndex, onSelect }: ExerciseSuggestionsProps) => {
    if (exercises.length === 0) return null;

    return (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-surface-darker border border-slate-200 dark:border-border-dark rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
            {exercises.map((exercise, index) => (
                <div
                    key={exercise.id}
                    className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-4 group ${index === highlightedIndex ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                    onClick={() => onSelect(exercise)}
                >
                    <OptimizedImage
                        src={exercise.image_url || exercise.image}
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                        containerClassName="size-10 rounded-md shrink-0 bg-slate-200 dark:bg-white/10"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-slate-900 dark:text-white font-medium truncate group-hover:text-[#16a34a] transition-colors">{exercise.name}</span>
                        <span className="text-xs text-slate-500 dark:text-text-secondary truncate">{exercise.muscle}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-[#16a34a] text-xl opacity-0 group-hover:opacity-100 transition-all -ml-2">add_circle</span>
                </div>
            ))}
        </div>
    );
});
