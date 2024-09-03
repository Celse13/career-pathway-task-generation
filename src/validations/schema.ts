import { z } from 'zod';

const triviaQuestionShape = z.object({
    question: z.string(),
    correctAnswer: z.string(),
    wrongAnswers: z.array(z.string()),
});

const responseShape = z.object({
    questions: z.array(triviaQuestionShape)
});

export const validateTriviaQuestions = (data: any) => {
    const parsedData = responseShape.parse(data);
    return parsedData.questions;
};
