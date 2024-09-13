import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextQuestionProps {
    title: string;
    onAnswerChange: (answer: string) => void;
}

const TextQuestion = ({ title, onAnswerChange }: TextQuestionProps) => {
    return (
        <Card className="shadow-lg rounded-lg border border-gray-200 w-full|">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Type your answer here..."
                    onChange={(e) => onAnswerChange(e.target.value)}
                ></textarea>
            </CardContent>
        </Card>
    );
};

export default TextQuestion;
