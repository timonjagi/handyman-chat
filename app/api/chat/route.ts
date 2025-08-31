import { CoreMessage, streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { tools } from '@/app/lib/tools'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: google('models/gemini-2.0-flash-exp'),
    system: `You are Bingwa, a helpful assistant for ordering services in Kenya. 
             Guide users through the process of identifying services, selecting providers, 
             creating orders, and processing payments. Use the appropriate tools based on 
             the user's request and the current stage of the ordering process.
             
             When listing services, always use the 'listServices' tool.
             The 'listServices' tool accepts an optional 'category' (string) and an optional 'location' object.
             The 'location' object should contain 'city' (string) and 'area' (string) properties.
             Example for listing cleaning services in Nairobi, Kileleshwa:
             listServices({ category: 'cleaning', location: { city: 'Nairobi', area: 'Kileleshwa' } })
             
             When a user specifies a relative date like "tomorrow", "today", or "next week", infer the exact date based on the current date (August 31, 2025). For example, "tomorrow" would be September 1, 2025. Always format dates as 'YYYY-MM-DD' when passing them to tools like 'getAvailableSlots' or 'createOrder'.`,
    messages,
    tools,
  })

  return result.toDataStreamResponse()
}
