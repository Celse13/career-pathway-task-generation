interface DifficultyTagProps {
    level: 'EASY' | 'MEDIUM' | 'HARD';
    selected: boolean;
    onClick: () => void;
}

const DifficultyTag = ({ level, selected, onClick }: DifficultyTagProps) => {
    const getTagStyles = () => {
        const baseStyles = 'inline-flex items-center px-2 py-1 border rounded-full text-sm font-medium cursor-pointer';
        const selectedStyles = selected ? 'outline outline-2 outline-blue-500' : '';
        switch (level) {
            case 'EASY':
                return `${baseStyles} bg-green-100 text-green-700 border-green-400 ${selectedStyles}`;
            case 'MEDIUM':
                return `${baseStyles} bg-orange-100 text-orange-700 border-orange-400 ${selectedStyles}`;
            case 'HARD':
                return `${baseStyles} bg-red-100 text-red-700 border-red-400 ${selectedStyles}`;
            default:
                return baseStyles;
        }
    };

    const getTagLabel = () => {
        switch (level) {
            case 'EASY':
                return 'Easy';
            case 'MEDIUM':
                return 'Medium';
            case 'HARD':
                return 'Hard';
            default:
                return '';
        }
    };

    return (
        <div className={getTagStyles()} onClick={onClick}>
            <span className="w-2 h-2 rounded-full mr-2"
                style={{
                    backgroundColor: level === 'EASY' ? '#22c55e' : level === 'MEDIUM' ? '#f59e0b' : '#ef4444'
                }}>
            </span>
            {getTagLabel()}
        </div>
    );
};

export default DifficultyTag;
