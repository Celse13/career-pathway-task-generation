import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Choice {
    id: string;
    choice: string;
    isCorrect: boolean;
}

interface CheckboxQuestionProps {
    title: string;
    choices: Choice[];
}

const CheckboxQuestion = ({ title, choices } : CheckboxQuestionProps) => {
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
                                <input type="checkbox" name="checkbox-choice" value={choice.id} />
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
