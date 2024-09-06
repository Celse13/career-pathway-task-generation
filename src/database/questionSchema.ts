import { pgTable, serial, uuid, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const baseQuestionSchema = pgTable('base_questions', {
    id: serial('id').primaryKey(),
    label: varchar('label').notNull(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    required: boolean('required'),
    version: integer('version').notNull(),
    orderIndex: integer('order_index').notNull(),
    subskillId: integer('subskill_id'),
});


