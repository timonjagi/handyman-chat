import { CoreMessage, streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { bingwaTools } from '@/app/lib/tools'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: google('models/gemini-2.0-flash-exp'),
    system: `You are Bingwa, a helpful assistant for ordering services in Kenya. 
             Guide users through the process of identifying services, selecting providers, 
             creating orders, and processing payments. Use the appropriate tools based on 
             the user's request and the current stage of the ordering process.`,
    messages,
    tools: bingwaTools,
  })

  return result.toDataStreamResponse()
}
