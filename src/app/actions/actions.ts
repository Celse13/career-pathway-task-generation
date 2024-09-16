import { generateObject } from "ai";
import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';
import { questionSchema } from "@/db/questionSchema";
import db from "@/database/drizzle";
import {
    baseQuestions, textQuestionTable,
    paragraphQuestionTable,
    multipleChoiceQuestionTable,
    checkboxesQuestionTable,
    dropdownQuestionTable,
    linearScaleQuestionTable,
    fileUploadQuestionTable,
    rangeQuestionTable,
    ratingQuestionTable,
    codingQuestionTable, dateQuestionTable,
    URLQuestionTable
} from "@/database/questionsSchema";

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
            model: anthropic("claude-3-5-sonnet-20240620"),
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

        const validatedQuestions = task.map(question => questionSchema.parse(question));

        validatedQuestions.forEach((question, index) => {
            console.log(`Question ${index + 1}:`, question);
            Object.entries(question).forEach(([key, value]) => {
                console.log(`  ${key}:`, value);
            });
        });

        await saveQuestionsToDB(validatedQuestions);

        return validatedQuestions;

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

const saveQuestionsToDB = async (questions: any[]) => {
    for (const question of questions) {
        const baseQuestionData = {
            id: question.id,
            label: question.label,
            title: question.title,
            description: question.description,
            required: question.required,
            version: question.version,
            orderIndex: question.orderIndex,
            subskillId: question.subskillId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(baseQuestions).values(baseQuestionData);

        switch (question.type) {
            case 'text':
                await db.insert(textQuestionTable).values({
                    id: question.id,
                    maxLength: question.maxLength,
                    placeholder: question.placeholder,
                    metadata: question.metadata,
                });
                break;
            case 'paragraph':
                await db.insert(paragraphQuestionTable).values({
                    id: question.id,
                    maxLength: question.maxLength,
                    placeholder: question.placeholder,
                    metadata: question.metadata,
                });
                break;
            case 'multiple-choice':
                await db.insert(multipleChoiceQuestionTable).values({
                    id: question.id,
                    choices: question.choices,
                });
                break;
            case 'checkboxes':
                await db.insert(checkboxesQuestionTable).values({
                    id: question.id,
                    choices: question.choices,
                });
                break;
            case 'dropdown':
                await db.insert(dropdownQuestionTable).values({
                    id: question.id,
                    choices: question.choices,
                });
                break;
            case 'linear-scale':
                await db.insert(linearScaleQuestionTable).values({
                    id: question.id,
                    min: question.min,
                    max: question.max,
                    minLabel: question.minLabel,
                    maxLabel: question.maxLabel,
                    metadata: question.metadata,
                });
                break;
            case 'file-upload':
                await db.insert(fileUploadQuestionTable).values({
                    id: question.id,
                    allowedFileTypes: question.allowedFileTypes,
                    maxFileSize: question.maxFileSize,
                });
                break;
            case 'range':
                await db.insert(rangeQuestionTable).values({
                    id: question.id,
                    min: question.min,
                    max: question.max,
                    step: question.step,
                    correctValue: question.correctValue,
                });
                break;
            case 'rating':
                await db.insert(ratingQuestionTable).values({
                    id: question.id,
                    maxRating: question.maxRating,
                    icon: question.icon,
                });
                break;
            case 'coding':
                await db.insert(codingQuestionTable).values({
                    id: question.id,
                    language: question.language,
                    codeSnippet: question.codeSnippet,
                    testCases: question.testCases,
                    metadata: question.metadata,
                });
                break;
            case 'date':
                await db.insert(dateQuestionTable).values({
                    id: question.id,
                    date: question.date,
                    metadata: question.metadata,
            });
            case 'url':
                await db.insert(URLQuestionTable).values({
                    id: question.id,
                    allowedFileTypes: question.allowedFileTypes,
                    maxFileSize: question.maxFileSize,
            });
                break;
            default:
                throw new Error(`Unknown question type: ${question.type}`);
        }
    }
};



const answerShape = z.object({
    questionId: z.string(),
    isCorrect: z.boolean().nullable(),
    automatedResponse: z.string().optional(),
    score: z.number().optional(),
});

export const gradeAnswers = async (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
    console.log('questions from the client', userAnswers);

    const results = await Promise.all(questions.map(async question => {
        const userAnswer = userAnswers[question.id];

        let isCorrect = false;
        let score = 0;
        let automatedResponse = '';

        switch (question.type) {
            case 'multiple-choice':
            case 'dropdown':
                const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
                isCorrect = userAnswer === correctChoice?.choice;
                score = isCorrect ? 5 : 0;
                automatedResponse = isCorrect ? 'Correct!' : `Incorrect. The correct answer is '${correctChoice?.choice}'.`;
                break;

            case 'checkboxes':
                const correctAnswers = question.choices.filter((choice: any) => choice.isCorrect).map((choice: any) => choice.choice);
                const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                const correctSelections = userAnswersArray.filter(answer => correctAnswers.includes(answer)).length;
                isCorrect = correctSelections === correctAnswers.length;

                if (correctAnswers.length > 0) {
                    score = (correctSelections / correctAnswers.length) * 5;
                } else {
                    score = 0;
                }

                automatedResponse = isCorrect
                    ? 'Correct!'
                    : `Incorrect. The correct answers are '${correctAnswers.join(', ')}'. You selected '${userAnswersArray.join(', ')}'.`;
                break;

            case 'text':
            case 'paragraph':
                const automatedResponseText = question.metadata?.automatedResponse || '';
                const aiGradingResult = await gradeSubjectiveAnswer(Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer, automatedResponseText);
                isCorrect = aiGradingResult.isCorrect;
                score = aiGradingResult.score;
                automatedResponse = aiGradingResult.automatedResponse;
                break;
            case 'date':
                isCorrect = userAnswer === question.date;
                score = isCorrect ? 5 : 0;
                automatedResponse = isCorrect ? 'Correct!' : `Incorrect. The correct date is '${question.date}'.`;
                break;
            case 'range':
                isCorrect = userAnswer === question.correctValue;
                score = isCorrect ? 5 : 0;
                automatedResponse = isCorrect ? 'Correct!' : `Incorrect. The correct date is '${question.correctAnswer}'.`
                break
            case 'coding':
                break;
            case 'linear-scale':
                break;

            default:
                throw new Error(`Unknown question type: ${question.type}`);
        }

        return {
            questionId: question.id,
            isCorrect,
            automatedResponse,
            score,
        };
    }));

    console.log('Grading Results:', results);
    return results;
};

const gradeSubjectiveAnswer = async (userAnswer: string, expectedAnswer: string) => {
    const prompt = `
    You are an AI grader. Evaluate the following user answer based on the expected answer:
    User Answer: "${userAnswer}"
    Expected Answer: "${expectedAnswer}"
    Provide a score out of 5 and indicate if the answer is correct. Include an explanation in the automated response.
  `;

    const system = `
    You are an AI grader.
    Evaluate the user answer based on the expected answer.
    Provide a score out of 5 and indicate if the answer is correct.
    Include an explanation in the automated response.
  `;

    const { object: gradingResult } = await generateObject({
        model: anthropic("claude-3-5-sonnet-20240620"),
        output: 'object',
        schema: z.object({
            isCorrect: z.boolean(),
            score: z.number(),
            automatedResponse: z.string(),
        }),
        prompt: prompt,
        system: system,
    });

    return gradingResult;
};
