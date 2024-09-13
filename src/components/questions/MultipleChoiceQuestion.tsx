import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Choice {
    id: string;
    choice: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQuestionProps {
    questionId: string;
    title: string;
    choices: {
        choice: string;
        isCorrect?: boolean;
    }[];
    onAnswerChange: (questionId: string, answer: string) => void;
}

const MultipleChoiceQuestion = ({ questionId, title, choices: initialChoices, onAnswerChange }: MultipleChoiceQuestionProps) => {
    const [choices, setChoices] = useState<Choice[]>([]);
    const [selectedChoice, setSelectedChoice] = useState<string>('');

    useEffect(() => {
        if (Array.isArray(initialChoices)) {
            const newChoices = initialChoices.map((data, index) => ({
                id: `${index}`,
                choice: data.choice,
                isCorrect: data.isCorrect,
            }));
            setChoices(newChoices);
        }
    }, [initialChoices]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = event.target.value;
        setSelectedChoice(selectedId);
        const choice = choices.find(choice => choice.id === selectedId);
        if (choice) {
            console.log(`Selected Choice ID: ${choice.id}, Choice: ${choice.choice}`);
            onAnswerChange(questionId, choice.choice);
        }
    };

    return (
        <Card className="shadow-lg rounded-lg border border-gray-200 w-full">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <ul className="space-y-2">
                    {choices.map(choice => (
                        <li key={choice.id} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={`multiple-choice-${questionId}`}
                                value={choice.id}
                                checked={selectedChoice === choice.id}
                                onChange={handleChange}
                                className="form-radio h-5 w-5 text-blue-600 focus:ring-0"
                            />
                            <label className="text-gray-700">{choice.choice}</label>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default MultipleChoiceQuestion;
