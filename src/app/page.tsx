// src/app/page.tsx
'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { generateQuestions } from "@/app/actions/actions";
import MultipleChoiceQuestion from '@/components/questions/MultipleChoiceQuestion';
import CheckboxQuestion from '@/components/questions/CheckboxQuestion';
import TextQuestion from '@/components/questions/TextQuestion';
import ParagraphQuestion from '@/components/questions/ParagraphQuestion';
import CodingQuestion from '@/components/questions/CodingQuestion';
import DropdownQuestion from '@/components/questions/DropdownQuestion';
import LinearScaleQuestion from '@/components/questions/LinearScaleQuestion';
import DateQuestion from '@/components/questions/DateQuestion';
import FileUploadQuestion from '@/components/questions/FileUploadQuestion';
import RangeQuestion from '@/components/questions/RangeQuestion';
import RatingQuestion from '@/components/questions/RatingQuestion';

export default function Chat() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(1);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setDots(prevDots => (prevDots % 3) + 1);
            }, 500);

            return () => clearInterval(interval);
        }
    }, [loading]);

    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 1:
                return <MultipleChoiceQuestion title={question.title} choices={question.choices} />;
            case 2:
                return <CheckboxQuestion title={question.title} choices={question.choices} />;
            case 3:
                return <TextQuestion title={question.title} />;
            case 4:
                return <ParagraphQuestion title={question.title} />;
            case 5:
                return <CodingQuestion title={question.title} />;
            case 6:
                return <DropdownQuestion title={question.title} choices={question.choices} />;
            case 7:
                return <LinearScaleQuestion title={question.title} min={1} max={5} />;
            case 8:
                return <DateQuestion title={question.title} />;
            case 9:
                return <FileUploadQuestion title={question.title} />;
            case 10:
                return <RangeQuestion title={question.title} min={1} max={100} />;
            case 11:
                return <RatingQuestion title={question.title} maxRating={5} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <div className="flex flex-col space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                        {typeof m.content === 'string' ? m.content : renderQuestion(m.content.QuestionSchema)}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start items-center py-4">
                        <span className="ml-2 text-gray-500">
                            {`Generating questions${'.'.repeat(dots)}`}
                        </span>
                    </div>
                )}
            </div>

            <form
                onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true); // Set loading to true
                    const newMessages: CoreMessage[] = [
                        ...messages,
                        { content: input, role: 'user' },
                    ];

                    setMessages(newMessages);
                    setInput('');

                    try {
                        const result = await generateQuestions(input);

                        setMessages([
                            ...newMessages,
                            ...result.map((question: any) => ({
                                role: 'assistant' as const,
                                content: question,
                            })),
                        ]);
                    } catch (error) {
                        console.error('Error generating questions:', error);
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={e => setInput(e.target.value)}
                />
            </form>
        </div>
    );
}
