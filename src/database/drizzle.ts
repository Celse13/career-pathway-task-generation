import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import * as schema from './questionsSchema';

config({ path: '.env.local' });

const DATABASE_URL=process.env.DATABASE_URL || "";

const sql = neon(DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
