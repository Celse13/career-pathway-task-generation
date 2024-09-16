import { questionTypes, QuestionType } from '@/Types/QuestionTypes';
import icons from './questions/QuestionTypeIcon'; // Import the icons

interface QuestionTypeSelectorProps {
    selectedTypes: string[];
    onTypeChange: (type: string) => void;
}

const QuestionTypeSelector = ({ selectedTypes, onTypeChange }: QuestionTypeSelectorProps) => {
    return (
        <div className="grid grid-cols-2 gap-3 w-full">
            {Object.keys(questionTypes).map((type) => (
                <button
                    key={type}
                    className={`flex items-center justify-start p-3 w-full border rounded-lg space-x-2 
            ${selectedTypes.includes(type) ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                    onClick={() => onTypeChange(type)}
                >
                    <span className="w-5 h-5 flex-shrink-0">{icons[type as keyof typeof icons]}</span>
                    <span className="text-gray-700 text-base font-medium text-left">{questionTypes[type as QuestionType]}</span>
                </button>
            ))}
        </div>
    );
};

export default QuestionTypeSelector;
