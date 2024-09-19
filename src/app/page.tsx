'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { fetchGeneratedQuestions } from "@/utils/api";
import QuestionTypeSelector from '@/components/QuestionTypeSelector';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import DifficultyTag from '@/components/DifficultyTag';

interface FormData {
    question: string;
}

export default function Chat() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
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

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        setSubmittedQuestion(data.question);

        try {
            const result = await fetchGeneratedQuestions(data.question, selectedQuestionTypes, difficultyLevel);
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="w-full p-4 mb-4 border border-gray-300 rounded shadow-xl text-lg"
                    placeholder="Generate questions..."
                    {...register('question', { required: 'This field is required' })}
                />
                {errors.question && <p className="text-red-500 mb-2">{errors.question.message}</p>}

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

            <button
                className="mt-4 p-2 border border-gray-300 rounded-lg bg-transparent flex justify-center items-center"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
            >
                <span className="mr-2">{loading ? 'Generating questions' : 'Generate questions'}</span>
                {loading && <Loader />}
            </button>

            {submittedQuestion && (
                <div className="mt-4">
                    <p className="text-lg">{submittedQuestion}</p>
                </div>
            )}
        </div>
    );
}
