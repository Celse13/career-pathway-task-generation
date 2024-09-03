
import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Question } from "@/Types/questions";

interface CardProps {
    questionData: Question;
}

const TriviaCard = ({ questionData }: CardProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
        setIsCorrect(answer === questionData.correctAnswer);
    };

    const allAnswers = [...questionData.wrongAnswers, questionData.correctAnswer].sort();

    return (
        <Card className="w-full m-4">
            <CardHeader>
                <CardTitle>{questionData.question}</CardTitle>
            </CardHeader>
            <CardContent>
                {allAnswers.map((answer, index) => (
                    <div
                        key={index}
                        onClick={() => handleAnswerClick(answer)}
                        className="cursor-pointer my-2 p-2 border rounded hover:bg-gray-200"
                    >
                        {answer}
                    </div>
                ))}
                {selectedAnswer && (
                    <CardDescription>
                        {isCorrect ? 'Correct!' : `Wrong! The correct answer is ${questionData.correctAnswer}.`}
                    </CardDescription>
                )}
            </CardContent>
        </Card>
    );
};

export default TriviaCard;
