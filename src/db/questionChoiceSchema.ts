import { z } from 'zod';

export const QuestionChoiceSchema = z.object({
    id: z.string(),
    choice: z.string(),
    isCorrect: z.boolean(),
});
