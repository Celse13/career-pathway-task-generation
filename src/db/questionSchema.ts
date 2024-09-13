import {z} from 'zod';
import {
    textQuestionSchema,
    checkboxesQuestionSchema, codingQuestionSchema,
    dateQuestionSchema,
    dropdownQuestionSchema, fileUploadQuestionSchema,
    linearScaleQuestionSchema,
    multipleChoiceQuestionSchema,
    paragraphQuestionSchema, rangeQuestionSchema, URLQuestionSchema
} from "@/db/questionsSchema/allQuestionsTypes";



export const questionSchema = z.union([
    textQuestionSchema,
    paragraphQuestionSchema,
    checkboxesQuestionSchema,
    multipleChoiceQuestionSchema,
    dropdownQuestionSchema,
    linearScaleQuestionSchema,
    dateQuestionSchema,
    fileUploadQuestionSchema,
    rangeQuestionSchema,
    URLQuestionSchema,
    codingQuestionSchema,
]);
