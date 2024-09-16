import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gradeAnswers } from "@/utils/api";

export const useQuestions = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [gradingResults, setGradingResults] = useState<{ questionId: string, isCorrect: boolean | null, automatedResponse?: string, score?: number }[]>([]);

    const router = useRouter();

    useEffect(() => {
        const storedQuestions = localStorage.getItem('generatedQuestions');
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        }
    }, []);

    const checkAnswers = async () => {
        console.log('User Answers:', userAnswers);
        console.log('Questions:', questions);

        const results = await gradeAnswers(userAnswers, questions);
        console.log('Grading results:', results);

        const resultsArray = Array.isArray(results.data) ? results.data : [results.data];

        let totalScore = 0;

        const scoredResults = resultsArray.map((result: { questionId: string, isCorrect: boolean | null, automatedResponse?: string, score?: number }) => {
            const score = result.score || 0;
            totalScore += score;
            console.log(`Question ${result.questionId} Score: ${score}`);
            return { ...result, score };
        });

        setGradingResults(scoredResults);
        console.log('Total Score:', totalScore);
    };

    const handleAnswerChange = (questionId: string, answer: string | string[]) => {
        console.log(`Updating answer for question ${questionId}:`, answer);
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    return {
        questions,
        gradingResults,
        checkAnswers,
        handleAnswerChange,
        router,
    };
};
