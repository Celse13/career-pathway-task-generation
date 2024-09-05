import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RangeQuestionProps {
    title: string;
    min: number;
    max: number;
}

const RangeQuestion = ({ title, min, max } : RangeQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <input type="range" min={min} max={max} className="w-full" />
                <div className="flex justify-between">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default RangeQuestion;
