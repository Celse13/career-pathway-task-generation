import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RatingQuestionProps {
    title: string;
    maxRating: number;
}

const RatingQuestion = ({ title, maxRating } : RatingQuestionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex">
                    {[...Array(maxRating)].map((_, index) => (
                        <span key={index} className="text-xl cursor-pointer">
                            &#9733;
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RatingQuestion;
