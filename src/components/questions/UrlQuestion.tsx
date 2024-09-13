import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface URLQuestionProps {
    title: string;
    onAnswerChange: (answer: string) => void;
}

const URLQuestion = ({ title, onAnswerChange }: URLQuestionProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onAnswerChange(event.target.value);
    };

    return (
        <Card className="shadow-lg rounded-lg border border-gray-200">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <input
                    type="url"
                    placeholder="Type your answer here..."
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </CardContent>
        </Card>
    );
};

export default URLQuestion;