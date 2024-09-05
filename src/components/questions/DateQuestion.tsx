import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DateQuestionProps {
    title: string;
}

const DateQuestion = ({ title }: DateQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <input type="date" className="w-full p-2 border rounded" />
            </CardContent>
        </Card>
    );
};

export default DateQuestion;
