// src/app/actions/actions.ts
"use server";

import { questionTypes } from "@/Types/QuestionTypes";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';
import { questionSchema } from "@/db/questionSchema";
import { v4 as uuidv4 } from 'uuid';

export const generateQuestions = async (input: string, selectedQuestionTypes: string[] = []) => {
    'use server';

    try {
        const prompt = `
            Based on the following input: "${input}", generate a list of questions.
            Ensure that the questions are formatted as valid JSON.
            The user has specified preferred question types: ${JSON.stringify(selectedQuestionTypes)}.
            Only generate questions that match the specified types.
            If no types are specified, generate a diverse set of questions.
            Avoid including any questions that do not conform to the specified types.
        `;

        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
            system: `
                 You are a question generator.
                 Adhere strictly to the user's specified question types.
                 If the input specifies a question type, only generate that type.
                 If no types are specified, create a variety of questions.
                 Ensure all output is in valid JSON format.
                 `,
            schema: questionSchema,
            output: 'array',
        });

        console.log('Generated task:', task);
        const questionsWithId = task.map((question, index) => ({
            ...question,
            id: uuidv4(), // Assign unique ID
        }));

        questionsWithId.forEach((question, index) => {
            console.log(`Question ${index + 1}:`, question);
            Object.entries(question).forEach(([key, value]) => {
                console.log(`  ${key}:`, value);
            });
        });

        return questionsWithId;

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation failed:', error.errors);
            throw new Error('Validation failed: ' + error.errors.map(e => e.message).join(', '));
        } else {
            console.error('Error generating questions:', error);
            throw error;
        }
    }
}
