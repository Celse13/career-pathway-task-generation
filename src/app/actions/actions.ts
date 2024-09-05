// src/app/actions/actions.ts
"use server";

import { QuestionSchema } from "@/db/schema";
import { questionTypes } from "@/Types/QuestionTypes";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';

export const generateQuestions = async (input: string) => {
    'use server';

    const defaultQuestionTypes = Object.keys(questionTypes);
    let selectedQuestionTypes = defaultQuestionTypes;

    try {
        const prompt = `
            ${input}
            Format the response as JSON in the shape of: ${JSON.stringify(QuestionSchema.array())}
            Whenever the user has preferred question types from this object list ${JSON.stringify(selectedQuestionTypes)}
            be sure to provide the question according to the preference. However, if not specific
            provide all relevant and applicable question type to the topic
            following types of questions: ${JSON.stringify(selectedQuestionTypes)}
            Be sure to be cautious about the user preferred question type. That's to say once the user input is requesting
            for the specific question type, be sure to only apply that question type.
            Ensure that the generated questions cover all specified types in the user input ${input}.
            If the user prompt is requesting large information and you realized that it beyond you generation
            capacity, be sure to provide response in chunks considering what you are being asked for
            `;

        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
            system: `You are a question generator! and considering the user input,
            be sure to generate questions referring to this schema ${JSON.stringify(selectedQuestionTypes)}`,
            schema: QuestionSchema,
            output: 'array',
        });

        // Ensure the task is an array of objects
        if (!Array.isArray(task) || !task.every(item => typeof item === 'object')) {
            throw new Error('Validation failed: value must be an object that contains an array of elements');
        }

        console.log('Generated task:', task);
        task.forEach((question, index) => {
            console.log(`Question ${index + 1}:`, question);
            Object.entries(question).forEach(([key, value]) => {
                console.log(`  ${key}:`, value);
            });
        });

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
