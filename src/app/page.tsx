'use client';

import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { generateQuestions } from "@/app/actions/actions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Chat() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState('');

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.map((m, i) => (
                <div key={i} className="whitespace-pre-wrap">
                    {m.role === 'user' ? 'User: ' : 'AI: '}
                    {m.content as string}
                </div>
            ))}

            <form
                onSubmit={async e => {
                    e.preventDefault();
                    const newMessages: CoreMessage[] = [
                        ...messages,
                        { content: input, role: 'user' },
                    ];

                    setMessages(newMessages);
                    setInput('');

                    const result = await generateQuestions(input);

                    setMessages([
                        ...newMessages,
                        ...result.map((question: any) => ({
                            role: 'assistant' as const,
                            content: JSON.stringify(question, null, 2),
                        })),
                    ]);
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
