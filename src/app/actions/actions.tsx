'use server';

import { anthropic } from '@ai-sdk/anthropic';
import { generateText, generateObject } from 'ai';
import {writeQuestionsToFile} from "@/utils/writeToFile";
import {validateTriviaQuestions} from "@/validations/schema";
import {responseShape, triviaQuestionShape} from "@/scripts/generate-questions";
import { z } from 'zod';

export const generateServerSide = async () => {
    try {
        console.log('Starting to generate trivia questions...');
        const object = await generateTriviaQuestions();
        const parsedQuestions = responseShape.parse(object).questions;

        await writeQuestionsToFile(parsedQuestions);

        console.log('Generated trivia questions successfully.');

        return parsedQuestions;
    } catch (error) {
        console.error('Error generating trivia questions:', error);
        throw error;
    }
};


const generateTriviaQuestions = async () => {
    'use server';

    const { text } = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        prompt: `Generate 10 trivia questions for the HTTP Request methods. Include the wrong answers.
            Format the response as JSON in the shape of: ${JSON.stringify(triviaQuestionShape)}`,
        system: 'You are a trivia question generator!',
        schema: z.object({

        })
    });

    const jsonStartIndex = text.indexOf('{');
    const jsonText = text.substring(jsonStartIndex);

    return JSON.parse(jsonText);
};
