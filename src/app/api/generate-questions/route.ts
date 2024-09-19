import { type NextRequest, NextResponse } from 'next/server';
import { questionSchema } from "@/db/questionSchema";
import {generateQuestions} from "@/app/actions/actions";



export async function POST(req: NextRequest) {
    try {
        const { input, selectedQuestionTypes, difficultyLevel } = await req.json();

        if (!input) {
            return NextResponse.json(
                { message: 'Input is required' },
                { status: 400 }
            );
        }

        const task = await generateQuestions(input, selectedQuestionTypes, difficultyLevel);

        const parsedQuestions = questionSchema.array().parse(task);
        if (!parsedQuestions) {
            throw new Error('Parsed questions are undefined or null');
        }

        return NextResponse.json(
            { message: 'Here is the response from AI', data: parsedQuestions },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Failed to generate questions', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export const maxDuration = 120;
