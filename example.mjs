"use server";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const triviaQuestionShape = z.object({
    question: z.string(),
    correctAnswer: z.string(),
    wrongAnswers: z.array(z.string()),
});
const responseShape = z.object({
    questions: z.array(triviaQuestionShape)
});

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
    const { text } = await generateText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        prompt: `Generate 10 trivia questions for the HTTP Request methods. Include the wrong answers.
            Format the response as JSON in the shape of: ${JSON.stringify(triviaQuestionShape)}`,
        system: 'You are a trivia question generator!',
    });

    console.log('Received response from AI model:', text);
    const jsonStartIndex = text.indexOf('{');
    const jsonText = text.substring(jsonStartIndex);

    return JSON.parse(jsonText);
};

const writeQuestionsToFile = async (questions) => {

    const filePath = path.join('./src/data', 'triviaQuestions.json');
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));

    console.log('Written questions to file:', filePath);
};

generateServerSide();
