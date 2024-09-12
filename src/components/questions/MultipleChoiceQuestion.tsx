import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Choice {
    id: string;
    choice: string;
    isCorrect?: boolean;
}

interface MultipleChoiceQuestionProps {
    title: string;
    choices: {
        choice: string;
        isCorrect?: boolean;
    }[];
    onAnswerChange: (answer: string) => void;
}

const MultipleChoiceQuestion = ({ title, choices: initialChoices, onAnswerChange }: MultipleChoiceQuestionProps) => {
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
            onAnswerChange(choice.choice);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul>
                    {choices.map(choice => (
                        <li key={choice.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="multiple-choice"
                                    value={choice.id}
                                    checked={selectedChoice === choice.id}
                                    onChange={handleChange}
                                />
                                {choice.choice}
                            </label>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default MultipleChoiceQuestion;
