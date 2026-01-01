import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    containerClassName = '',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-slate-200 dark:bg-white/10 ${containerClassName}`}>
            {/* Skeleton / Placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-white/5" />
            )}

            {/* Fallback for error */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-400">
                    <span className="material-symbols-outlined text-2xl">broken_image</span>
                </div>
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true); // Stop loading state
                }}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                {...props}
            />
        </div>
    );
};
