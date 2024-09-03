import fs from 'fs';
import path from 'path';

export const writeQuestionsToFile = async (questions: any) => {

    const filePath = path.join('./src/data', 'triviaQuestions.json');
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));

    console.log('Written questions to file:', filePath);
};
