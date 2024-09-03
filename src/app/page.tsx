
'use client';

import TriviaCard from "@/components/Card";
import triviaQuestions from "@/data/triviaQuestions.json";

export default function Chat() {
    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {triviaQuestions.map((question, index) => (
                <TriviaCard key={index} questionData={question} />
            ))}
        </div>
    );
}
