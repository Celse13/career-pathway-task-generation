export const gradeAnswers = (userAnswers: { [key: string]: string | string[] }, questions: any[]) => {
    return questions.map(question => {
        const userAnswer = userAnswers[question.id];
        let isCorrect = false;

        console.log('Grading question:', question);
        console.log('User answer:', userAnswer);

        switch (question.type) {
            case 'multiple-choice':
                const multipleChoiceAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
                isCorrect = question.choices.some((choice: any) => {
                    console.log('Checking choice:', choice);
                    return choice.choice === multipleChoiceAnswer && choice.isCorrect;
                });
                break;
            case 'checkboxes':
                isCorrect = Array.isArray(userAnswer) &&
                    userAnswer.every(answer =>
                        question.choices.some((choice: any) => {
                            console.log('Checking choice:', choice);
                            return choice.choice === answer && choice.isCorrect;
                        })
                    ) &&
                    userAnswer.length === question.choices.filter((choice: any) => choice.isCorrect).length;
                break;
            case 'dropdown':
                const dropdownAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
                isCorrect = question.choices.some((choice: any) => {
                    console.log('Checking choice:', choice);
                    return choice.choice === dropdownAnswer && choice.isCorrect;
                });
                break;
            case 'linear-scale':
                isCorrect = userAnswer === question.correctAnswer;
                break;
            case 'range':
                isCorrect = userAnswer >= question.min && userAnswer <= question.max;
                break;
            case 'rating':
                isCorrect = userAnswer === question.correctRating;
                break;
            case 'text':
            case 'paragraph':
                return {
                    questionId: question.id,
                    isCorrect: null,
                };
            default:
                break;
        }

        console.log('Is correct:', isCorrect);

        return {
            questionId: question.id,
            isCorrect,
        };
    });
};