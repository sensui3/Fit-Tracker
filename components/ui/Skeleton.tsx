import React from 'react';
import { HTMLAttributes } from 'react';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
            {...props}
        />
    );
};
