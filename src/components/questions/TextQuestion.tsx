import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextQuestionProps {
    title: string;
    onAnswerChange: (answer: string) => void;
}

const TextQuestion = ({ title, onAnswerChange } : TextQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    onChange={(e) => onAnswerChange(e.target.value)}
                ></textarea>
            </CardContent>
        </Card>
    );
};

export default TextQuestion;
