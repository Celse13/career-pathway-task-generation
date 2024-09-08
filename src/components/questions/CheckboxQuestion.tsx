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
                                    type="checkbox"
                                    name="checkbox-choice"
                                    value={choice.choice}
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

export default CheckboxQuestion;