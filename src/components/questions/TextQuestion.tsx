import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextQuestionProps {
    title: string;
}

const TextQuestion = ({ title } : TextQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <textarea className="w-full p-2 border rounded" rows={4}></textarea>
            </CardContent>
        </Card>
    );
};

export default TextQuestion;
