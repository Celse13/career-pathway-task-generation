
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Choice {
    id: string;
    choice: string;
    isCorrect: boolean;
}

interface MultipleChoiceQuestionProps {
    title: string;
    choices: Choice[];
}

const MultipleChoiceQuestion = ({ title, choices } : MultipleChoiceQuestionProps) => {
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
                                <input type="radio" name="multiple-choice" value={choice.id} />
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
