// src/utils/gradeAnswers.ts
export const gradeAnswers = (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
    const results = questions.map(question => {
        const userAnswer = userAnswers[question.id];
        let isCorrect = false;

        switch (question.type) {
            case 'multipleChoice':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case 'checkboxes':
                isCorrect = Array.isArray(userAnswer) && userAnswer.sort().toString() === question.correctAnswers.sort().toString();
                break;
            case 'dropdown':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            default:
                break;
        }

        return {
            questionId: question.id,
            isCorrect,
        };
    });

    return results;
};
