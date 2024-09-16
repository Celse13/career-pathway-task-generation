'use client';

import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { fetchGeneratedQuestions, gradeAnswers } from "@/utils/api";
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
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import URLQuestion from "@/components/questions/UrlQuestion";
import {useRouter} from 'next/navigation';
import Loader from '@/components/Loader';

export default function Chat() {
    const [messages, setMessages] = useState<CoreMessage[]>([]);
    const [input, setInput] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState(1);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
    const [questions, setQuestions] = useState<any[]>([]);
    const [gradingResults, setGradingResults] = useState<{ questionId: string, isCorrect: boolean | null, automatedResponse?: string, score?: number }[]>([]);
    const router = useRouter();

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
