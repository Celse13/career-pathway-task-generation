"use server";

import { QuestionSchema } from "@/db/schema";
import { questionTypes } from "@/Types/QuestionTypes";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';

export const generateQuestions = async (input: string, userPreferences = []) => {
    'use server';

    const selectedQuestionTypes = userPreferences.map(pref => {
        if (!questionTypes[pref]) {
            throw new Error(`Invalid question type: ${pref}`);
        }
        return questionTypes[pref];
    });

    try {
        const prompt = `${input}
            Format the response as JSON in the shape of: ${JSON.stringify(QuestionSchema)}
            Include the following types of questions: ${JSON.stringify(selectedQuestionTypes)}`;

        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
            system: `You are a question generator! and considering the user input, 
            be sure to generate a question referring to this schema ${JSON.stringify(selectedQuestionTypes)}`,
            schema: QuestionSchema,
            output: 'array',
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