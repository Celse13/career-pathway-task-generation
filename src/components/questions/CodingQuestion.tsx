import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodingQuestionProps {
    title: string;
    onAnswerChange: (answer: string[]) => void;
}

const CodingQuestion = ({ title, onAnswerChange } : CodingQuestionProps) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <textarea className="w-full p-2 border rounded" rows={8} placeholder="Write your code here..."></textarea>
            </CardContent>
        </Card>
    );
};

export default CodingQuestion;
