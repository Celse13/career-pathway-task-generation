import dotenv from 'dotenv';
dotenv.config();

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const apiKey = process.env.ANTHROPIC_API_KEY || '';
console.log("my api",apiKey)
// if (!apiKey) {
//     throw new Error('AI_LoadAPIKeyError: Anthropic API key is missing. Pass it using the \'apiKey\' parameter or the ANTHROPIC_API_KEY environment variable.');
// }


