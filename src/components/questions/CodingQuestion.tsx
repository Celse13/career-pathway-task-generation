import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodingQuestionProps {
    title: string;
}

const CodingQuestion = ({ title } : CodingQuestionProps) => {
    return (
        <Card>
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
