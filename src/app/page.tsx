'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { fetchGeneratedQuestions } from "@/utils/api";
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
import { gradeAnswers } from '@/utils/gradeAnswers';

export default function Chat() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(1);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [questions, setQuestions] = useState<any[]>([]);
    const [gradingResults, setGradingResults] = useState<{ questionId: string, isCorrect: boolean | null }[]>([]);

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

    const handleAnswerChange = (questionId: string, answer: string | string[]) => {
        console.log(`Updating answer for question ${questionId}:`, answer);
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'multiple-choice':
                return <MultipleChoiceQuestion title={question.title} choices={question.choices} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'checkboxes':
                return <CheckboxQuestion title={question.title} choices={question.choices} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'dropdown':
                return <DropdownQuestion title={question.title} choices={question.choices} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'text':
                return <TextQuestion title={question.title} />;
            case 'paragraph':
                return <ParagraphQuestion title={question.title} />;
            case 'coding':
                return <CodingQuestion title={question.title} />;
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

    const checkAnswers = () => {
        console.log('User Answers:', userAnswers);
        console.log('Questions:', questions);
        const results = gradeAnswers(userAnswers, questions);
        setGradingResults(results);
        console.log('Grading results:', results);
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
                        const result = await fetchGeneratedQuestions(input, selectedQuestionTypes);
                        console.log('Generated questions:', result.data);
                        setQuestions(result.data);

                        setMessages([
                            ...newMessages,
                            ...result.data.map((question: any) => ({
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
            {questions.length > 0 && (
                <button onClick={checkAnswers} className="px-4 py-2 bg-green-500 text-white rounded mt-4">Check Answers</button>
            )}
            <div className="mt-4 space-y-2">
                {gradingResults.map(result => (
                    <div key={result.questionId} className="p-2 border rounded">
                        <span className="font-bold">Question {result.questionId}:</span>
                        {result.isCorrect === null ? (
                            <span className="text-gray-500 ml-2">Not applicable</span>
                        ) : result.isCorrect ? (
                            <span className="text-green-500 ml-2">Correct</span>
                        ) : (
                            <span className="text-red-500 ml-2">Incorrect</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}