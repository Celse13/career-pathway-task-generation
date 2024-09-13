import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Choice {
    id: string;
    choice: string;
    isCorrect?: boolean;
}

interface DropdownQuestionProps {
    title: string;
    choices: {
        choice: string;
        isCorrect?: boolean;
    }[];
    onAnswerChange: (answer: string) => void;
}

const DropdownQuestion = ({ title, choices: initialChoices, onAnswerChange }: DropdownQuestionProps) => {
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

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        setSelectedChoice(selectedId);
        const choice = choices.find(choice => choice.id === selectedId);
        if (choice) {
            console.log(`Selected Choice ID: ${choice.id}, Choice: ${choice.choice}`);
            onAnswerChange(choice.choice);
        }
    };

    return (
        <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedChoice}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        Please select an option
                    </option>
                    {choices.length > 0 ? (
                        choices.map(choice => (
                            <option key={choice.id} value={choice.id}>
                                {choice.choice}
                            </option>
                        ))
                    ) : (
                        <option disabled>No options available</option>
                    )}
                </select>
            </CardContent>
        </Card>
    );
};

export default DropdownQuestion;