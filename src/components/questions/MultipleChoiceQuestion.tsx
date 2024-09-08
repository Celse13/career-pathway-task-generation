import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Choice {
    id: string;
    choice: string;
    isCorrect: boolean;
}

interface MultipleChoiceQuestionProps {
    title: string;
    choices: Choice[];
    onAnswerChange: (answer: string[]) => void;
}

const MultipleChoiceQuestion = ({ title, choices, onAnswerChange }: MultipleChoiceQuestionProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onAnswerChange([event.target.value]);
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

export default MultipleChoiceQuestion;