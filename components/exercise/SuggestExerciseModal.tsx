import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MUSCLE_FILTERS, DIFFICULTY_FILTERS, EQUIPMENT_FILTERS } from '../../data/exercises';
import { useToast } from '../ui/Toast';

interface SuggestExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuggest: (data: unknown) => Promise<unknown>;
}

export const SuggestExerciseModal: React.FC<SuggestExerciseModalProps> = ({
    isOpen,
    onClose,
    onSuggest
}) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        muscle_group: MUSCLE_FILTERS[0],
        equipment: EQUIPMENT_FILTERS[0],
        difficulty: DIFFICULTY_FILTERS[0],
        description: '',
        image_url: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            addToast({
                type: 'error',
                message: 'Por favor, informe o nome do exercício.'
            });
            return;
        }

        try {
            setLoading(true);
            await onSuggest({
                ...formData,
                instructions: [] // Default empty instructions
            });

            addToast({
                type: 'success',
                title: 'Sucesso!',
                message: 'Exercício sugerido com sucesso!'
            });

            onClose();
            // Reset form
            setFormData({
                name: '',
                muscle_group: MUSCLE_FILTERS[0],
                equipment: EQUIPMENT_FILTERS[0],
                difficulty: DIFFICULTY_FILTERS[0],
                description: '',
                image_url: ''
            });
        } catch (_error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível salvar o exercício.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-surface-dark w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Sugerir Novo Exercício</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                            Nome do Exercício
                        </label>
                        <Input
                            placeholder="Ex: Supino com Halteres"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="h-12"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Grupo Muscular
                            </label>
                            <select
                                value={formData.muscle_group}
                                onChange={(e) => setFormData(prev => ({ ...prev, muscle_group: e.target.value }))}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all"
                            >
                                {MUSCLE_FILTERS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Equipamento
                            </label>
                            <select
                                value={formData.equipment}
                                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all"
                            >
                                {EQUIPMENT_FILTERS.map(e => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                Dificuldade
                            </label>
                            <div className="flex gap-2">
                                {DIFFICULTY_FILTERS.map(d => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, difficulty: d }))}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.difficulty === d
                                            ? 'bg-[#16a34a] border-[#16a34a] text-white'
                                            : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                                URL da Imagem (Opcional)
                            </label>
                            <Input
                                placeholder="https://exemplo.com/imagem.jpg"
                                value={formData.image_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                className="h-12"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                            Descrição
                        </label>
                        <textarea
                            placeholder="Descreva brevemente como realizar o exercício..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loading}
                            className="flex-[2] shadow-lg shadow-green-500/20"
                        >
                            Sugerir Exercício
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
