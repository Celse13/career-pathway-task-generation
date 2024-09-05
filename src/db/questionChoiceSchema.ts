import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const QuestionChoiceSchema = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    choice: z.string(),
    isCorrect: z.boolean(),
});
