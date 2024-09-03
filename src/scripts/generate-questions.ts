import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export const triviaQuestionShape = z.object({
    question: z.string(),
    correctAnswer: z.string(),
    wrongAnswers: z.array(z.string()),
});
export const responseShape = z.object({
    questions: z.array(triviaQuestionShape)
});

