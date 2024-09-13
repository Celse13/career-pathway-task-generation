import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface Choice {
    id: string;
    choice: string;
    isCorrect: boolean;
}

interface CheckboxQuestionProps {
    title: string;
    choices: Choice[];
    onAnswerChange: (answer: string[]) => void;
}

const CheckboxQuestion = ({ title, choices, onAnswerChange }: CheckboxQuestionProps) => {
    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const newSelectedChoices = checked
            ? [...selectedChoices, value]
            : selectedChoices.filter(choice => choice !== value);

        setSelectedChoices(newSelectedChoices);
        onAnswerChange(newSelectedChoices);
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
                                type="checkbox"
                                name="checkbox-choice"
                                value={choice.choice}
                                onChange={handleChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label className="text-gray-700">{choice.choice}</label>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default CheckboxQuestion;
