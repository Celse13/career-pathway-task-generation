'use client';

import { useState } from 'react';
import { fetchGeneratedQuestions } from "@/utils/api";
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import DifficultyTag from '@/components/DifficultyTag';

export default function Chat() {
    const [input, setInput] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
    const [difficultyLevel, setDifficultyLevel] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
    const router = useRouter();

    const handleTypeChange = (type: string) => {
        setSelectedQuestionTypes((prevTypes) =>
            prevTypes.includes(type)
                ? prevTypes.filter((t) => t !== type)
                : [...prevTypes, type]
        );
    };

    const handleDifficultyChange = (level: 'EASY' | 'MEDIUM' | 'HARD') => {
        setDifficultyLevel(level);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmittedQuestion(input);

        try {
            const result = await fetchGeneratedQuestions(input, selectedQuestionTypes, difficultyLevel);
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
                <div className="flex justify-evenly mb-4 border border-gray-300 rounded-lg p-2">
                    {['EASY', 'MEDIUM', 'HARD'].map(level => (
                        <DifficultyTag
                            key={level}
                            level={level as 'EASY' | 'MEDIUM' | 'HARD'}
                            selected={difficultyLevel === level}
                            onClick={() => handleDifficultyChange(level as 'EASY' | 'MEDIUM' | 'HARD')}
                        />
                    ))}
                </div>
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
