import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from 'zod';
import { questionSchema } from "@/db/questionSchema";
import db from "@/database/drizzle";
import { baseQuestions, textQuestionTable,
    paragraphQuestionTable,
    multipleChoiceQuestionTable,
    checkboxesQuestionTable,
    dropdownQuestionTable,
    linearScaleQuestionTable,
    fileUploadQuestionTable,
    rangeQuestionTable,
    ratingQuestionTable,
    codingQuestionTable } from "@/database/questionsSchema";

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
            default:
                throw new Error(`Unknown question type: ${question.type}`);
        }
    }
};

const answerShape = [
    {
        "questionId": "d33c64b2-9e68-4b2e-9b32-bc70201cafc5",
        "isCorrect": true,
        "automatedResponse": "Correct! 'Procedural Components' is not a type of React component. The main types of React components are Functional Components, Class Components, and Higher-Order Components."
    },
    {
        "questionId": "d14d9f44-db56-48ad-86b8-d98decdc19fe",
        "isCorrect": false,
        "automatedResponse": "Incorrect. The correct answer is 'useEffect'."
    },
    {
        "questionId": "b71150f0-0298-4052-b4ab-517fa2072b52",
        "isCorrect": null,
        "automatedResponse": "Correct! 'componentDidMount', 'componentWillUpdate', and 'componentWillUnmount' are React lifecycle methods."
    }
];

// export const gradeAnswers = async (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
//     console.log('questions from the client', userAnswers);
//     const prompt = `
//         You are an AI grader. Grade the following user answers based on the provided questions: ${JSON.stringify({ userAnswers, questions })}.
//         Return the results as an array of objects, each conforming to the format ${JSON.stringify(answerShape)}.
//         If the question type is subjective (e.g., text, paragraph), return null for "isCorrect" and provide an "automatedResponse".
//         Ensure that the final output is an array, even if there is only one answer.
//     `;
//
//     const system = `
//         You are an AI grader.
//         Grade the user answers based on the provided questions.
//         Ensure that the output is an array of objects that match the format ${JSON.stringify(answerShape)}.
//     `;
//
//     const { object: gradingResults } = await generateObject({
//         model: anthropic('claude-3-5-sonnet-20240620'),
//         output: 'array',
//         schema: z.array(z.object({
//             questionId: z.string(),
//             isCorrect: z.boolean().nullable(),
//             automatedResponse: z.string().optional(),
//         })),
//         prompt: prompt,
//         system: system,
//     });
//
//     // Ensure the response is an array
//     const validatedResults = Array.isArray(gradingResults) ? gradingResults : [gradingResults];
//
//     // Log the results for debugging
//     console.log('Grading Results:', validatedResults);
//
//     return validatedResults;
// }



export const gradeAnswers = async (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
    console.log('questions from the client', userAnswers);
    const prompt = `
        You are an AI grader. Grade the following user answers based on the provided questions: ${JSON.stringify({ userAnswers, questions })}.
        Return the results as an array of objects, each conforming to the format ${JSON.stringify(answerShape)}.
        If the question type is subjective (e.g., text, paragraph), return null for "isCorrect" and provide an "automatedResponse".
        Ensure that the final output is an array, even if there is only one answer.
    `;

    const system = `
        You are an AI grader.
        Grade the user answers based on the provided questions.
        Ensure that the output is an array of objects that match the format ${JSON.stringify(answerShape)}.
    `;

    const { object: gradingResults } = await generateObject({
        model: anthropic('claude-3-5-sonnet-20240620'),
        output: 'array',
        schema: z.object({
            questionId: z.string(),
            isCorrect: z.boolean().nullable(),
            automatedResponse: z.string().optional(),
        }),
        prompt: prompt,
        system: system,
    });

    // Ensure the response is an array
    const validatedResults = Array.isArray(gradingResults) ? gradingResults : [gradingResults];

    // Log the results for debugging
    console.log('Grading Results:', validatedResults);

    return validatedResults;
}
