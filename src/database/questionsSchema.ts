import { pgTable, serial, varchar, integer, json, boolean, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Base Questions Table
export const baseQuestions = pgTable("baseQuestions", {
    id: uuid('id').primaryKey(),
    label: varchar('label', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    required: boolean('required').default(true),
    version: integer('version').notNull(),
    orderIndex: integer('order_index').notNull(),
    subskillId: integer('subskill_id'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Question Tables
export const textQuestionTable = pgTable('text_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    maxLength: integer('max_length'),
    placeholder: varchar('placeholder', { length: 255 }),
    metadata: json('metadata'),
});

export const paragraphQuestionTable = pgTable('paragraph_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    maxLength: integer('max_length'),
    placeholder: varchar('placeholder', { length: 255 }),
    metadata: json('metadata'),
});

export const multipleChoiceQuestionTable = pgTable('multiple_choice_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    choices: json('choices').$type<Array<{
        id: string,
        choice: string,
        isCorrect?: boolean
    }>>().notNull(),
});

export const checkboxesQuestionTable = pgTable('checkboxes_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    choices: json('choices').$type<Array<{
        id: string,
        choice: string,
        isCorrect?: boolean
    }>>().notNull(),
});

export const dropdownQuestionTable = pgTable('dropdown_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    choices: json('choices').$type<Array<{
        id: string,
        choice: string,
        isCorrect?: boolean
    }>>().notNull(),
});

export const linearScaleQuestionTable = pgTable('linear_scale_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    min: integer('min').notNull(),
    max: integer('max').notNull(),
    minLabel: varchar('min_label', { length: 255 }),
    maxLabel: varchar('max_label', { length: 255 }),
    metadata: json('metadata'),
});

export const fileUploadQuestionTable = pgTable('file_upload_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    allowedFileTypes: json('allowed_file_types'),
    maxFileSize: integer('max_file_size'),
});

export const rangeQuestionTable = pgTable('range_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    min: integer('min').notNull(),
    max: integer('max').notNull(),
    step: integer('step'),
});

export const ratingQuestionTable = pgTable('rating_questions', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    maxRating: integer('max_rating').notNull(),
    icon: varchar('icon', { length: 255 }),
});

export const codingQuestionTable = pgTable('coding_test_cases', {
    id: uuid('id').primaryKey().references(() => baseQuestions.id),
    language: varchar('language', { length: 50 }).notNull(),
    codeSnippet: text('code_snippet'),
    testCases: json('test_cases').$type<Array<{
        input: string,
        output: string,
    }>>().notNull(),
    metadata: json('metadata'),
});

export const answersSchema = pgTable('answers', {
    id: uuid('id').primaryKey(),
    questionId: uuid('question_id').references(() => baseQuestions.id).notNull(),
    isCorrect: boolean('is_correct').default(false),
    automatedResponse: text('automated_response'),
});


// Relations
export const textQuestionRelations = relations(textQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [textQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const paragraphQuestionRelations = relations(paragraphQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [paragraphQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const multipleChoiceQuestionRelations = relations(multipleChoiceQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [multipleChoiceQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const checkboxesQuestionRelations = relations(checkboxesQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [checkboxesQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const dropdownQuestionRelations = relations(dropdownQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [dropdownQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const linearScaleQuestionRelations = relations(linearScaleQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [linearScaleQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const fileUploadQuestionRelations = relations(fileUploadQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [fileUploadQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const rangeQuestionRelations = relations(rangeQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [rangeQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const ratingQuestionRelations = relations(ratingQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [ratingQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const codingQuestionRelations = relations(codingQuestionTable, ({ one }) => ({
    baseQuestion: one(baseQuestions, {
        fields: [codingQuestionTable.id],
        references: [baseQuestions.id],
    }),
}));

export const answersRelations = relations(answersSchema, ({ one }) => ({
    question: one(baseQuestions, {
        fields: [answersSchema.questionId],
        references: [baseQuestions.id],
    }),
}));
