import React, { memo } from 'react';
import { Card } from '../ui/Card';
import { OptimizedImage } from '../ui/OptimizedImage';

interface ExerciseCardProps {
    exercise: any;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    onClick: () => void;
}

export const ExerciseCard = memo(({ exercise, isFavorite, onToggleFavorite, onClick }: ExerciseCardProps) => {
    return (
        <Card
            onClick={onClick}
            noPadding
            className="group flex flex-col p-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
        >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-black/40 relative rounded-xl">
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-white/90 dark:bg-black/60 px-2 py-1 text-[10px] font-bold text-slate-900 dark:text-white shadow-sm backdrop-blur-md">
                        {exercise.muscle}
                    </span>
                </div>
                <OptimizedImage
                    src={exercise.image_url || exercise.image}
                    alt={exercise.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                            {exercise.name}
                        </h3>
                        {exercise.isExample && (
                            <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                Exemplo
                            </span>
                        )}
                    </div>
                    <button
                        className={`transition-colors ${isFavorite ? 'text-[#16a34a]' : 'text-slate-400 hover:text-[#16a34a]'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(exercise.id);
                        }}
                    >
                        <span className={`material-symbols-outlined text-xl ${isFavorite ? 'filled' : ''}`}>
                            {isFavorite ? 'bookmark' : 'bookmark_border'}
                        </span>
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 dark:text-text-secondary">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                        <span className="material-symbols-outlined text-[14px]">fitness_center</span>
                        {exercise.equipment}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded ${exercise.difficulty === 'Iniciante' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        exercise.difficulty === 'Intermediário' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        <span className="material-symbols-outlined text-[14px]">equalizer</span>
                        {exercise.difficulty}
                    </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {exercise.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-[#16a34a] group/link">
                    Ver Detalhes
                    <span className="material-symbols-outlined ml-1 text-[16px] transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                </div>
            </div>
        </Card>
    );
});
