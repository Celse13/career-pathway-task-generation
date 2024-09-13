import React from 'react';
import { questionTypes, QuestionType } from '@/Types/QuestionTypes';

interface QuestionTypeSelectorProps {
    selectedTypes: string[];
    onTypeChange: (type: string) => void;
}

const QuestionTypeSelector = ({ selectedTypes, onTypeChange }: QuestionTypeSelectorProps) => {
    return (
        <div className="p-4 bg-white rounded shadow-md w-full">
            <h3 className="text-lg font-semibold mb-4">Select Question Types</h3>
            <div className="grid grid-cols-2 gap-4">
                {Object.keys(questionTypes).map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => onTypeChange(type)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-gray-700">{questionTypes[type as QuestionType]}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default QuestionTypeSelector;
