import {anthropic} from '@ai-sdk/anthropic';
import {streamText, convertToCoreMessages, generateText} from 'ai';

export const POST = async (req: Request) => {
    const {messages} = await req.json();
    const result = await streamText({
        model: anthropic('claude-3-5-sonnet-20240620'),
        messages: convertToCoreMessages(messages)
    })
    return result.toDataStreamResponse();
}



