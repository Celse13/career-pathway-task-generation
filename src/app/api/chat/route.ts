import {anthropic} from '@ai-sdk/anthropic';
import {streamText, convertToCoreMessages, generateText} from 'ai';

export const POST = async (req: Request) => {
    const {messages} = await req.json();

}





