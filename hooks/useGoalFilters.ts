import { useMemo, useState, useCallback } from 'react';

export interface Goal {
    id: number;
    title: string;
    category: string;
    icon: string;
    current: number;
    target: number;
    unit: string;
    progress: number;
    statusIcon: string;
    statusText: string;
    trend: string;
    trendColor: string;
    shimmer?: boolean;
    reverse?: boolean;
    completed?: boolean;
}

export type GoalTab = 'Todas as Metas' | 'Curto Prazo' | 'Longo Prazo' | 'Concluídas';
export type ViewMode = 'grid' | 'list';

export const useGoalFilters = (initialGoals: Goal[]) => {
    const [activeTab, setActiveTab] = useState<GoalTab>('Todas as Metas');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const filteredGoals = useMemo(() => {
        return initialGoals.filter((goal) => {
            if (activeTab === 'Todas as Metas') return true;
            if (activeTab === 'Concluídas') return goal.completed || goal.progress >= 100;
            return goal.category.includes(activeTab);
        });
    }, [initialGoals, activeTab]);

    const handleTabChange = useCallback((tab: GoalTab) => {
        setActiveTab(tab);
    }, []);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    return {
        activeTab,
        viewMode,
        filteredGoals,
        handleTabChange,
        handleViewModeChange,
    };
};
