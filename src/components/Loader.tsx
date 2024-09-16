import React from 'react';

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    return (
        <div className={`relative w-2 h-2 ${className}`}>
            <div className="relative w-2 h-2">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`absolute w-2 h-1 bg-gray-800 mt-0.5 animate-honeycomb ${getPositionClass(i)}`}></div>
                ))}
            </div>
        </div>
    );
};

const getPositionClass = (index: number) => {
    switch (index) {
        case 0: return 'left-[-9px] top-0 animate-delay-0';
        case 1: return 'left-[-4.5px] top-[7px] animate-delay-100';
        case 2: return 'left-[4.5px] top-[7px] animate-delay-200';
        case 3: return 'left-[9px] top-0 animate-delay-300';
        case 4: return 'left-[4.5px] top-[-7px] animate-delay-400';
        case 5: return 'left-[-4.5px] top-[-7px] animate-delay-500';
        case 6: return 'left-0 top-0 animate-delay-600';
        default: return '';
    }
};

export default Loader;
