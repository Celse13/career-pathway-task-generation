"use server";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Define QuestionChoiceSchema
const QuestionChoiceSchema = z.object({
    id: z.string(),
    choice: z.string(),
    isCorrect: z.boolean().optional(),
});

// Define OptionsSchema for questions with options
const OptionsSchema = z.object({
    options: z.array(z.string()),
    choices: z.array(QuestionChoiceSchema).optional(),
});





// text question
const textQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('text'),
    maxLength: z.number().optional(),
    placeholder: z.string().optional(),
});

// paragraph question


// checkboxes question
const checkboxesQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('checkboxes'),
}).merge(OptionsSchema);

// multiple-choice question
const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('multiple-choice'),
    correctAnswer: z.string().optional(),
}).merge(OptionsSchema);

// dropdown question
const dropdownQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('dropdown'),
}).merge(OptionsSchema);

// linear scale question
const linearScaleQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('linear-scale'),
    min: z.number(),
    max: z.number(),
    minLabel: z.string().optional(),
    maxLabel: z.string().optional(),
});

// date question
const dateQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('date'),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
});

// file upload question
const fileUploadQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('file-upload'),
    allowedFileTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().optional(),
});

// range question
const rangeQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('range'),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
});

// rating question
const ratingQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('rating'),
    maxRating: z.number(),
    icon: z.string().optional(),
});

// coding question
const codingQuestionSchema = baseQuestionSchema.extend({
    type: z.literal('coding'),
    language: z.string(),
    codeSnippet: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
    })).optional(),
});

// all schemas into a single schema
const QuestionSchema = z.union([
    textQuestionSchema,
    paragraphQuestionSchema,
    checkboxesQuestionSchema,
    multipleChoiceQuestionSchema,
    dropdownQuestionSchema,
    linearScaleQuestionSchema,
    dateQuestionSchema,
    fileUploadQuestionSchema,
    rangeQuestionSchema,
    ratingQuestionSchema,
    codingQuestionSchema,
]);


export const generateServerSide = async () => {
    try {
        console.log('Starting to generate trivia questions...');
        const object = await MultipleChoiceQuestions();

        // Ensure parsedQuestions is defined and correctly formatted
        const parsedQuestions = QuestionSchema.array().parse(object);
        if (!parsedQuestions) {
            throw new Error('Parsed questions are undefined or null');
        }

        await writeQuestionsToFile(parsedQuestions);

        console.log('Generated trivia questions successfully.');

        return parsedQuestions;
    } catch (error) {
        console.error('Error generating trivia questions:', error);
        throw error;
    }
};

const MultipleChoiceQuestions = async (userInput) => {
    'use server';

    try {
        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            output: 'array',
            prompt: `Generate questions on https methods but remember to mix with different types of questions
                Format the response as JSON in the shape of: ${JSON.stringify(QuestionSchema)}`,
            system: 'You are a trivia question generator!',
            schema: QuestionSchema,
            tools: {
                name: "pinecone_query",
                description: "run query against pinecone db",
                input_schema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            }
        });

        console.log('Generated task:', task); // Log the generated task
        return task;

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation failed:', error.errors);
            throw new Error('Validation failed: ' + error.errors.map(e => e.message).join(', '));
        } else {
            console.error('Error generating trivia questions:', error);
            throw error;
        }
    }
};

const writeQuestionsToFile = async (questions) => {
    const filePath = path.join('./src/data', 'triviaQuestions.json');
    const data = JSON.stringify(questions, null, 2); // Convert questions to JSON string
    fs.writeFileSync(filePath, data);
    console.log('Written questions to file:', filePath);
};

generateServerSide();
