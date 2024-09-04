export const QuestionTypeEnum = {
    MULTIPLE_CHOICE: 1,
    CHECKBOX: 2,
    TEXT: 3,
    PARAGRAPH: 4,
    CODING: 5,
    DROPDOWN: 6,
    LINEAR_SCALE: 7,
    DATE: 8,
    FILE_UPLOAD: 9,
    RANGE: 10,
    RATING: 11,
};


export const questionTypes = {
    multipleChoice: {
        type: QuestionTypeEnum.MULTIPLE_CHOICE,
        description: 'Select the correct answer from the given options.',
    },
    checkbox: {
        type: QuestionTypeEnum.CHECKBOX,
        description: 'Select all correct answers from the given options.',
    },
    text: {
        type: QuestionTypeEnum.TEXT,
        description: 'Provide a detailed answer to the question.',
    },
    paragraph: {
        type: QuestionTypeEnum.PARAGRAPH,
        description: 'Provide a long-form answer to the question.',
    },
    coding: {
        type: QuestionTypeEnum.CODING,
        description: 'Write code to solve the given problem.',
    },
    dropdown: {
        type: QuestionTypeEnum.DROPDOWN,
        description: 'Select the correct answer from the dropdown options.',
    },
    linearScale: {
        type: QuestionTypeEnum.LINEAR_SCALE,
        description: 'Rate on a scale from min to max.',
    },
    date: {
        type: QuestionTypeEnum.DATE,
        description: 'Select a date.',
    },
    fileUpload: {
        type: QuestionTypeEnum.FILE_UPLOAD,
        description: 'Upload a file.',
    },
    range: {
        type: QuestionTypeEnum.RANGE,
        description: 'Select a value within a range.',
    },
    rating: {
        type: QuestionTypeEnum.RATING,
        description: 'Rate on a scale.',
    },
};
