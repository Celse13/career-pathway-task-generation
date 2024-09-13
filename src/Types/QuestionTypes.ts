export const questionTypes = {
    text: 'Text',
    paragraph: 'Paragraph',
    multipleChoice: 'Multiple Choice',
    checkboxes: 'Checkboxes',
    dropdown: 'Dropdown',
    linearScale: 'Linear Scale',
    date: 'Date',
    fileUpload: 'File Upload',
    range: 'Range',
    url: 'URL',
    coding: 'Coding',
} as const;

export type QuestionType = keyof typeof questionTypes;
