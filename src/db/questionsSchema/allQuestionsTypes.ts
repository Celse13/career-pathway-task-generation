import { z } from 'zod';
import { baseQuestionSchema } from '@/db/questionsSchema/baseQuestionSchema';
import { v4 as uuidv4 } from 'uuid';

const metadataSchema = z.object({
    automatedResponse: z.string().optional(),
});

export const textQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('text'),
    maxLength: z.number().optional(),
    placeholder: z.string().optional(),
    metadata: metadataSchema,
});

export const paragraphQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('paragraph'),
    maxLength: z.number().optional(),
    placeholder: z.string().optional(),
    metadata: metadataSchema,
});

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('multiple-choice'),
    choices: z.array(z.object({
        id: z.string().uuid().default(() => uuidv4()),
        choice: z.string(),
        isCorrect: z.boolean().optional(),
    }))
});

export const checkboxesQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('checkboxes'),
    choices: z.array(z.object({
        id: z.string().uuid().default(() => uuidv4()), 
        choice: z.string(),
        isCorrect: z.boolean().optional(),
    }))
});

export const dropdownQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('dropdown'),
    choices: z.array(z.object({
        id: z.string().uuid().default(() => uuidv4()),
        choice: z.string(),
        isCorrect: z.boolean().optional(),
    }))
});

export const linearScaleQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('linear-scale'),
    min: z.number(),
    max: z.number(),
    minLabel: z.string().optional(),
    maxLabel: z.string().optional(),
    metadata: metadataSchema,
});

export const dateQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('date'),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
    metadata: metadataSchema,
});

export const fileUploadQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('file-upload'),
    allowedFileTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().optional(),
});

export const rangeQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('range'),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
    metadata: metadataSchema,
});

export const URLQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('url'),
    allowedFileTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().optional(),
});

export const codingQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('coding'),
    language: z.string(),
    codeSnippet: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
    })).optional(),
    metadata: metadataSchema,
});