import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const baseQuestionSchema = z.object({
    id: z.string().uuid().default(() => uuidv4()),
    label: z.string(),
    title: z.string(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    version: z.number(),
    orderIndex: z.number(),
    subskillId: z.number().optional(),
});