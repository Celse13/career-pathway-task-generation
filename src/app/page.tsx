'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { fetchGeneratedQuestions, gradeAnswers } from "@/utils/api";
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import {useRouter} from 'next/navigation';
import Loader from '@/components/Loader';

export default function Chat() {
    const [input, setInput] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const router = useRouter();



    const handleTypeChange = (type: string) => {
        setSelectedQuestionTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmittedQuestion(input);

        try {
            const result = await fetchGeneratedQuestions(input, selectedQuestionTypes);
            localStorage.setItem('generatedQuestions', JSON.stringify(result.data));
            router.push('/questions');
        } catch (error) {
            console.error('Error generating questions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            <form onSubmit={handleSubmit}>
                <input
                    className="w-full p-4 mb-4 border border-gray-300 rounded shadow-xl text-lg"
                    value={input}
                    placeholder="Say something..."
                    onChange={e => setInput(e.target.value)}
                />
            </form>
            <QuestionTypeSelector selectedTypes={selectedQuestionTypes} onTypeChange={handleTypeChange} />
            {submittedQuestion && (
                <div className="mt-4">
                    <p className="text-lg">{submittedQuestion}</p>
                </div>
            )}
            {loading && <Loader className="ml-1 mt-4" />}
        </div>
    );
}
