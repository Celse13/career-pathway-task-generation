import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ParagraphQuestionProps {
    title: string;
    onAnswerChange: (answer: string) => void;
}

const ParagraphQuestion = ({ title, onAnswerChange } : ParagraphQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={8}
                    onChange={(e) => onAnswerChange(e.target.value)}
                ></textarea>
            </CardContent>
        </Card>
    );
};

export default ParagraphQuestion;
