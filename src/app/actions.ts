// import { anthropic } from "@ai-sdk/anthropic";
// import { z } from 'zod';
// import { generateObject } from "ai";

// const gradeAnswerSchema = z.object({
//     questionId: z.string(),
//     isCorrect: z.boolean().nullable(),
//     automatedResponse: z.string().optional(),
// });

// export const gradeAnswers = async (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
//     const prompt = `
//         You are an AI grader. Grade the following user answers based on the provided questions.
//         Return the results in the format: [{ "questionId": "string", "isCorrect": boolean | null, "automatedResponse": "string" | null }].
//         If the question type is subjective (e.g., text, paragraph), return null for "isCorrect" and provide an "automatedResponse".
//         Questions and answers:
//         ${JSON.stringify({ userAnswers, questions })}
//     `;

//     const { object: gradingResults } = await generateObject({
//         model: anthropic('claude-3-5-sonnet-20240620'),
//         prompt: prompt,
//         system: `
//             You are an AI grader.
//             Grade the user answers based on the provided questions.
//             Return the results in the format: [{ "questionId": "string", "isCorrect": boolean | null, "automatedResponse": "string" | null }].
//             If the question type is subjective (e.g., text, paragraph), return null for "isCorrect" and provide an "automatedResponse".
//         `,
//         schema: z.array(gradeAnswerSchema),
//         output: 'array',
        
//     });

//     return gradingResults;
// };