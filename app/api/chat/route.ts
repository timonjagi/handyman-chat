import { CoreMessage, streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { tools } from '@/app/lib/tools'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are a helpful assistant. When asked about the world\'s shortest hackathon, use the getHackathonInfo tool to provide accurate information.',
    messages,
    tools,
  })

  return result.toDataStreamResponse()
}
