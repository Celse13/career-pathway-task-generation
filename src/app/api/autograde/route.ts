import { type NextRequest, NextResponse } from 'next/server';
import { gradeAnswers } from '@/app/actions/actions';

export async function POST(req: NextRequest) {
    try {
        const { userAnswers, questions } = await req.json();

        if (!userAnswers || !questions) {
            return NextResponse.json(
                { message: 'User answers and questions are required' },
                { status: 400 }
            );
        }

        const gradingResults = await gradeAnswers(userAnswers, questions);

        return NextResponse.json(
            { message: 'Grading completed', data: gradingResults },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Failed to grade answers', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export const maxDuration = 60;
