import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchGeneratedQuestions } from "@/utils/api";

export const useChat = () => {
    const [input, setInput] = useState('');
    const [submittedQuestion, setSubmittedQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
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

    return {
        input,
        setInput,
        submittedQuestion,
        loading,
        selectedQuestionTypes,
        handleTypeChange,
        handleSubmit,
    };
};
