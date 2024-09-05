'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { generateQuestions } from "@/app/actions/actions";

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

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <div className="flex flex-col space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                        {m.content as string}
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
                                content: JSON.stringify(question, null, 2),
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