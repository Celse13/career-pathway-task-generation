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
import QuestionTypeSelector from '@/components/QuestionTypeSelector';

export default function Chat() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(1);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setDots(prevDots => (prevDots % 3) + 1);
            }, 500);

            return () => clearInterval(interval);
        }
    }, [loading]);

    const handleTypeChange = (type: string) => {
        setSelectedQuestionTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'multiple-choice':
                return <MultipleChoiceQuestion title={question.title} choices={question.choices} />;
            case 'checkboxes':
                return <CheckboxQuestion title={question.title} choices={question.choices} />;
            case 'text':
                return <TextQuestion title={question.title} />;
            case 'paragraph':
                return <ParagraphQuestion title={question.title} />;
            case 'coding':
                return <CodingQuestion title={question.title} />;
            case 'dropdown':
                return <DropdownQuestion title={question.title} metadata={question.metadata} />;
            case 'linear-scale':
                return <LinearScaleQuestion title={question.title} min={question.min} max={question.max} />;
            case 'date':
                return <DateQuestion title={question.title} />;
            case 'file-upload':
                return <FileUploadQuestion title={question.title} />;
            case 'range':
                return <RangeQuestion title={question.title} min={question.min} max={question.max} />;
            case 'rating':
                return <RatingQuestion title={question.title} maxRating={question.maxRating} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    setLoading(true);
                    const newMessages: CoreMessage[] = [
                        ...messages,
                        { content: input, role: 'user' },
                    ];

                    setMessages(newMessages);
                    setInput('');

                    try {
                        const result = await generateQuestions(input, selectedQuestionTypes);

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
                    className="w-full p-2 mb-4 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={e => setInput(e.target.value)}
                />
            </form>
            <QuestionTypeSelector selectedTypes={selectedQuestionTypes} onTypeChange={handleTypeChange} />
            <div className="flex flex-col space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                        {typeof m.content === 'string' ? m.content : renderQuestion(m.content)}
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
        </div>
    );
}
