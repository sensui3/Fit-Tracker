import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ChartData {
    day: string;
    val: number;
}

const data: ChartData[] = [
    { day: 'Sem 1', val: 30 },
    { day: 'Sem 2', val: 45 },
    { day: 'Sem 3', val: 35 },
    { day: 'Sem 4', val: 70 },
    { day: 'Sem 5', val: 55 },
    { day: 'Sem 6', val: 80 },
    { day: 'Sem 7', val: 65 },
];

const WorkoutVolumeChart: React.FC = () => {
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
                    contentStyle={{ backgroundColor: '#102210', borderColor: '#283928', color: '#fff' }}
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
                    isAnimationActive={false} // Performance optimization
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default WorkoutVolumeChart;
