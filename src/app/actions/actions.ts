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
            Whenver the user has preferred question types from this object list  ${JSON.stringify(selectedQuestionTypes)}
            be sure to provide the question according to the preference. However, if not specific 
            provide all relevant and application questinon type to the topic
            following types of questions: ${JSON.stringify(selectedQuestionTypes)}
            Ensure that the generated questions cover all specified types.`;

        const { object: task } = await generateObject({
            model: anthropic('claude-3-5-sonnet-20240620'),
            prompt: prompt,
            system: `You are a question generator! and considering the user input,
            be sure to generate questions referring to this schema ${JSON.stringify(selectedQuestionTypes)}`,
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
