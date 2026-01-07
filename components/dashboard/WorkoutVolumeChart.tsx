import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ChartData {
    day: string;
    val: number;
}

const WorkoutVolumeChart: React.FC<{ data?: ChartData[] }> = ({ data = [] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[200px]">
                <span className="material-symbols-outlined text-4xl">analytics</span>
                <p className="text-sm font-medium">Nenhum dado de volume disponível</p>
                <p className="text-xs">Registre treinos para ver seu progresso técnico.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13ec13" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#13ec13" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Tooltip
                    contentStyle={{ backgroundColor: '#102210', borderColor: '#283928', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#13ec13' }}
                    cursor={{ stroke: '#13ec13', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#13ec13"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                    isAnimationActive={true}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default WorkoutVolumeChart;
