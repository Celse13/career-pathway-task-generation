import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RangeQuestionProps {
    title: string;
    min: number;
    max: number;
    onAnswerChange: (answer: string[]) => void;
}

const RangeQuestion = ({ title, min, max, onAnswerChange }: RangeQuestionProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onAnswerChange([event.target.value]);
    };

    return (
        <Card className="shadow-lg rounded-lg border border-gray-200 w-full">
            <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                />
                <div className="flex justify-between mt-2 text-gray-600">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default RangeQuestion;
