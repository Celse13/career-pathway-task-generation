import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic'
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { generateObject } from 'ai';
import fs from 'fs';
import path from 'path';


export const QuestionChoiceSchema = z.object({
    id: z.string(),
    choice: z.string(),
    isCorrect: z.boolean(),
});

export const QuestionSchema = z.object({
    id: z.string(),
    type: z.number(),
    title: z.string(),
    description: z.string().optional(),
    version: z.number(),
    orderIndex: z.number(),
    choices: z.array(QuestionChoiceSchema).optional(),
    subskillId: z.number().optional(),
    metadata: z.object({
        automatedResponse: z.string().optional(),
        codesInfo: z
            .object({
                codeQuestion: z.string().optional(),
                language: z.string().optional(),
            })
            .nullable()
            .optional(),
        validationRules: z.any().optional(),
        linearScale: z
            .object({
                toRangeValue: z.number().optional(),
                fromRangeLabel: z.string().optional(),
                toRangeLabel: z.string().optional(),
            })
            .optional(),
        dropDown: z
            .object({
                dataset: z.string(),
                datasetData: z.array(z.string()).optional(),
            })
            .optional(),
        range: z
            .object({
                min: z.string(),
                max: z.string(),
            })
            .optional(),
    }),
});



const questionTypes = {
    multipleChoice: {
        type: 'multiple choice',
        description: 'Select the correct answer from the given options.',
    },
    checkbox: {
        type: 'checkbox',
        description: 'Select all correct answers from the given options.',
    },
    text: {
        type: 'text',
        description: 'Provide a detailed answer to the question.',
    },
    paragraph: {
        type: 'paragraph',
        description: 'Provide a long-form answer to the question.',
    },
    coding: {
        type: 'coding',
        description: 'Write code to solve the given problem.',
    },
    dropdown: {
        type: 'dropdown',
        description: 'Select the correct answer from the dropdown options.',
    },
    linearScale: {
        type: 'linear scale',
        description: 'Rate on a scale from min to max.',
    },
    date: {
        type: 'date',
        description: 'Select a date.',
    },
    fileUpload: {
        type: 'file upload',
        description: 'Upload a file.',
    },
    range: {
        type: 'range',
        description: 'Select a value within a range.',
    },
    rating: {
        type: 'rating',
        description: 'Rate on a scale.',
    },
};

export const generateQuestions = async (topic, userPreferences = []) => {
    'use server';

    if (!Array.isArray(userPreferences)) {
        throw new Error('userPreferences must be an array');
    }

    const selectedQuestionTypes = userPreferences.map(pref => {
        if (!questionTypes[pref]) {
            throw new Error(`Invalid question type: ${pref}`);
        }
        return questionTypes[pref];
    });

    try {
        const prompt = `Generate 10 questions for the topic: ${topic}
            Format the response as JSON in the shape of: ${JSON.stringify(QuestionSchema)}
            Include the following types of questions: ${JSON.stringify(selectedQuestionTypes)}`;

        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
            system: 'You are a trivia question generator!',
            schema: QuestionSchema,
            output: 'array',
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

        console.log('Generated task:', task);
        return task;

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation failed:', error.errors);
            throw new Error('Validation failed: ' + error.errors.map(e => e.message).join(', '));
        } else {
            console.error('Error generating questions:', error);
            throw error;
        }
    }
};

const writeQuestionsToFile = async (questions) => {
    const filePath = path.join('./src/data', 'triviaQuestions.json');
    const data = JSON.stringify(questions, null, 2);
    fs.writeFileSync(filePath, data);
    console.log('Written questions to file:', filePath);
};

export const generateServerSide = async () => {
    try {
        console.log('Starting to generate trivia questions...');
        const object = await generateQuestions('Sample Topic', ['multipleChoice', 'text']);

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

generateServerSide();
