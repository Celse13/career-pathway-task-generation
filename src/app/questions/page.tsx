'use client';

import { FaArrowLeft } from 'react-icons/fa';
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
import URLQuestion from "@/components/questions/UrlQuestion";
import { useQuestions } from '@/hooks/useQuestions';

export default function QuestionsPage() {
    const { questions, gradingResults, checkAnswers, handleAnswerChange, router } = useQuestions();

    const renderQuestion = (question: any) => {
        switch (question.type) {
            case 'multiple-choice':
                return <MultipleChoiceQuestion title={question.title} choices={question.choices} questionId={question.id} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'checkboxes':
                return <CheckboxQuestion title={question.title} choices={question.choices} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'dropdown':
                return <DropdownQuestion title={question.title} choices={question.choices} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'text':
                return <TextQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'paragraph':
                return <ParagraphQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'coding':
                return <CodingQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'linear-scale':
                return <LinearScaleQuestion title={question.title} min={question.min} max={question.max} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'date':
                return <DateQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'file-upload':
                return <FileUploadQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'range':
                return <RangeQuestion title={question.title} min={question.min} max={question.max} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            case 'url':
                return <URLQuestion title={question.title} onAnswerChange={(answer) => handleAnswerChange(question.id, answer)} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full max-w-3xl px-4 py-20 mx-auto">
            <div className="absolute left-4">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center px-4 py-2 rounded"
                >
                    <FaArrowLeft className="mr-2 text-xl" />
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Generated Questions</h1>
            <div className="flex flex-col space-y-4">
                {questions.map((question, index) => (
                    <div key={index} className="">
                        {renderQuestion(question)}
                    </div>
                ))}
            </div>
            {questions.length > 0 && (
                <button onClick={checkAnswers} className="px-4 py-2 bg-green-500 text-white rounded mt-4">
                    Check Answers
                </button>
            )}
            <div className="mt-4 space-y-2">
                {gradingResults?.map(result => (
                    <div key={result?.questionId} className="p-2 border rounded">
                        <span className="font-bold">Question {result?.questionId}:</span>
                        {result?.isCorrect === null ? (
                            <span className="text-gray-500 ml-2">Not applicable</span>
                        ) : result?.isCorrect ? (
                            <span className="text-green-500 ml-2">Correct</span>
                        ) : (
                            <span className="text-red-500 ml-2">Incorrect</span>
                        )}
                        {result?.automatedResponse && (
                            <div className="mt-2 text-gray-700">{result?.automatedResponse}</div>
                        )}
                        <div className="mt-2 text-gray-700">Score: {result?.score} / 5</div>
                    </div>
                ))}
                <div className="mt-4 text-xl font-bold">
                    Total Score: {gradingResults.reduce((acc, result) => acc + (result?.score || 0), 0)} / {gradingResults.length * 5}
                </div>
            </div>
        </div>
    );
}
