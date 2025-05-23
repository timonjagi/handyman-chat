'use client'

import { cn } from '@/lib/utils'
import { useChat } from 'ai/react'
import { ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AutoResizeTextarea } from '@/components/autoresize-textarea'
import { HackathonInfo } from '@/components/HackathonInfo'
import { ServiceProviderCard } from '@/components/ServiceProviderCard'
import { OrderSummaryCard } from '@/components/OrderSummaryCard'
import { PaymentStatusCard } from '@/components/PaymentStatusCard'

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { messages, input, setInput, append } = useChat({
    api: '/api/chat',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void append({ content: input, role: 'user' })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Bingwa Ordering System
      </h1>
      <p className="text-muted-foreground text-sm">
        Your personal assistant for ordering services in Kenya
      </p>
      <p className="text-muted-foreground text-sm">
        Simply describe what service you need, when you need it, and where. For example: "I need a plumber tomorrow in Nairobi" or "Looking for a cleaner this weekend"
      </p>
    </header>
  )

  const renderDynamicComponent = (message: any) => {
    // Check for service provider selection
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: any) => t.toolName === 'selectProvider' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: any) => t.toolName === 'selectProvider'
      ).result;
      
      if (toolResult?.providers?.length > 0) {
        return (
          <div className="my-4 w-full space-y-4">
            <h3 className="text-lg font-medium">Available Service Providers</h3>
            <div className="grid grid-cols-1 gap-4">
              {toolResult.providers.map((provider: any) => (
                <ServiceProviderCard 
                  key={provider.id}
                  provider={provider}
                  onSelect={(providerId) => {
                    // In a real app, we would store this selection in state
                    console.log(`Selected provider: ${providerId}`);
                    append({
                      content: `I'd like to select ${provider.name} as my service provider.`,
                      role: 'user'
                    });
                  }}
                  selected={provider.id === toolResult.autoAssigned?.id}
                />
              ))}
            </div>
          </div>
        );
      }
    }
    
    // Check for order creation
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: any) => t.toolName === 'createOrder' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: any) => t.toolName === 'createOrder'
      ).result;
      
      // Mock order data for demo purposes
      const orderData = {
        orderId: toolResult.orderId,
        service: {
          name: 'Plumbing',
          variant: {
            name: 'Basic Plumbing',
            price: toolResult.amount
          }
        },
        provider: {
          name: 'John Kamau'
        },
        location: {
          area: 'Westlands',
          city: 'Nairobi'
        },
        scheduledTime: 'Tomorrow at 10:00 AM',
        customer: {
          name: 'Customer Name',
          phone: '+254712345678'
        },
        amount: toolResult.amount,
        currency: toolResult.currency
      };
      
      return (
        <div className="my-4 w-full">
          <OrderSummaryCard 
            order={orderData}
            onConfirm={() => {
              append({
                content: 'I confirm this order and would like to proceed with payment.',
                role: 'user'
              });
            }}
            onEdit={() => {
              append({
                content: 'I need to make changes to this order.',
                role: 'user'
              });
            }}
          />
        </div>
      );
    }
    
    // Check for payment processing
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: any) => t.toolName === 'processPayment' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: any) => t.toolName === 'processPayment'
      ).result;
      
      // Mock payment data for demo purposes
      const paymentData = {
        paymentId: toolResult.paymentId,
        status: toolResult.status as 'pending' | 'processing' | 'completed' | 'failed',
        method: 'mpesa' as 'mpesa' | 'card' | 'cash',
        amount: 2000,
        currency: 'KES',
        transactionDetails: toolResult.transactionDetails
      };
      
      return (
        <div className="my-4 w-full">
          <PaymentStatusCard 
            payment={paymentData}
            onRetry={() => {
              append({
                content: 'I want to retry the payment.',
                role: 'user'
              });
            }}
            onDone={() => {
              append({
                content: 'Great! What happens next with my order?',
                role: 'user'
              });
            }}
          />
        </div>
      );
    }
    
    // Check for hackathon info (legacy support)
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: any) => t.toolName === 'getHackathonInfo' && t.state === 'result'
    )) {
      return (
        <div className="my-4 w-full">
          <HackathonInfo attendees={1000} />
        </div>
      );
    }
    
    return null;
  };

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => {
        return (
          <div key={index} className={cn("flex flex-col", message.role === 'user' ? "items-end" : "items-start")}>
            {message.content && 
              <div
                data-role={message.role}
                className="max-w-[80%] rounded-2xl px-4 py-2.5 text-base data-[role=assistant]:bg-gray-50 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
              >
                {message.content}
              </div>
            }
            {message.role === 'assistant' && renderDynamicComponent(message)}
          </div>
        );
      })}
    </div>
  )

  return (
    <main
      className={cn(
        'ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none',
        className
      )}
      {...props}
    >
      <div className="flex-1 content-center overflow-y-auto px-6">
        {messages.length ? messageList : header}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={v => setInput(v)}
          value={input}
          placeholder="Enter a message"
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 size-6 rounded-full"
            >
              <ArrowUpIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
    </main>
  )
}
