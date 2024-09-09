import axios from 'axios';

interface GenerateQuestionsResponse {
    message: string;
    data: any[]
}

export const fetchGeneratedQuestions = async (input: string, selectedQuestionTypes: string[]): Promise<GenerateQuestionsResponse> => {
    try {
        const response = await axios.post('/api/generate-questions', {
            input,
            selectedQuestionTypes,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching generated questions:', error);
        throw error;
    }
};
