'use client'

import React, { useLayoutEffect, useRef, useState, RefObject } from 'react'
import { cn } from '@/lib/utils'
import { useChat } from 'ai/react'
import { ArrowUpIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AutoResizeTextarea } from '@/components/autoresize-textarea'
import { ServiceProviderCard } from '@/components/ServiceProviderCard'
import { OrderSummaryCard } from '@/components/OrderSummaryCard'
import { PaymentStatusCard } from '@/components/PaymentStatusCard'
import { ServiceSelectionCard } from '@/components/ServiceSelectionCard'
import { BookingSchedule } from '@/components/BookingSchedule'
import { ReviewForm } from '@/components/ReviewForm'
import { UserDetailsForm } from '@/components/UserDetailsForm'
import { OrderStatusCard } from '@/components/OrderStatusCard'
import { CancellationDialog } from '@/components/CancellationDialog'
import { ReschedulingInterface } from '@/components/ReschedulingInterface'
import { ServiceVariantCard } from './ServiceVariantCard'

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const { messages, input, setInput, append, isLoading } = useChat({
    api: '/api/chat',
  })

  const [isCancellationDialogOpen, setIsCancellationDialogOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessagesLength = useRef<number>(0);

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

  useLayoutEffect(() => {
    // Ensure the ref is available and there are messages to scroll to
    // Scroll only if new messages have been added
    if (messagesEndRef.current && messages.length > prevMessagesLength.current) {
      // Use setTimeout to ensure the DOM has updated before scrolling
      // and requestAnimationFrame to ensure it's called after paint
      const timerId = setTimeout(() => {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Reverted to 'smooth' and added setTimeout
        });
      }, 0); // A small delay might be needed, but 0 with requestAnimationFrame is often enough

      return () => clearTimeout(timerId);
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  // Use MutationObserver to detect DOM changes for more reliable scrolling
  useLayoutEffect(() => {
    const observer = new MutationObserver(() => {
      if (messagesEndRef.current && messages.length > 0) {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });

    // Observe the message list for changes in child nodes
    const messageListElement = document.querySelector('.my-4.flex.h-fit.min-h-full.flex-col.gap-4');
    if (messageListElement) {
      observer.observe(messageListElement, { childList: true, subtree: true });
    }

    // Cleanup the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [messages]); // Re-run if messages change

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Handyman Assistant
      </h1>
      <p className="text-muted-foreground text-sm">
        Your personal assistant for ordering services in Kenya
      </p>
      <p className="text-muted-foreground text-sm">
        Simply describe what service you need, when you need it, and where. For example: "I need a plumber tomorrow in Nairobi" or "Looking for a cleaner this weekend"
      </p>
    </header>
  )

  interface Message {
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
    toolInvocations?: Array<{
      toolName: string;
      state: string;
      result?: any;
    }>;
  }


  const renderDynamicComponent = (message: Message) => {
    // Check for service selection
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'listServices' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'listServices'
      )?.result;

      if (toolResult?.services?.length > 0) {
        return (
          <div className="my-4 w-full">

            <div>{toolResult.message || ''}</div>
            <br />
            <ServiceSelectionCard
              services={toolResult.services}
              onSelect={(serviceId) => {
                append({
                  content: `I want to book the service with ID ${serviceId}. Please show me the available variants of this service.`,
                  role: 'user'
                });
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="my-4 w-full">
            <p>No services available at the moment for the selected category. Would you like to try a different category?</p>
          </div>
        );
      }
    }

    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'resolveVariant' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'resolveVariant'
      )?.result;

      if (toolResult?.variants?.length > 0) {
        return (
          <div className="my-4 w-full">
            <div>{toolResult.message || ''}</div>
            <br />
            <ServiceVariantCard
              variants={toolResult.variants}
              recommendedVariant={toolResult.recommendedVariant}
              onSelect={(variantId) => {
                append({
                  content: `I'd like to proceed with the ${variantId} variant. Please show me available service providers.`,
                  role: 'user'
                });
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="my-4 w-full">
            <p>No variants available for the selected service.</p>
          </div>
        );
      }
    }

    // Check for booking schedule
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'getAvailableSlots' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'getAvailableSlots'
      )?.result;

      if (toolResult?.slots) {
        return (
          <div className="my-4 w-full">

            <div>{toolResult.message || ''}</div>
            <br />
            <BookingSchedule
              availableSlots={toolResult.slots}
              onDateSelect={(date) => {
                console.log('Selected date:', date);
              }}
              onTimeSelect={(time) => {
                append({
                  content: `I'd like to book the service for ${time}`,
                  role: 'user'
                });
              }}
            />
          </div>
        );
      }
    }

    // Check for review request
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'requestReview' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'requestReview'
      )?.result;

      const orderId = toolResult?.orderDetails?.orderId;

      if (orderId) {
        return (
          <div className="my-4 w-full">
            <ReviewForm
              orderId={orderId}
              onSubmit={(rating, comment) => {
                append({
                  content: `I want to submit a review for order ${orderId} with rating ${rating} and comment: "${comment}".`,
                  role: 'user'
                });
              }}
            />
          </div>
        );
      }
    }

    // Check for submitReview result
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'submitReview' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'submitReview'
      )?.result;

      if (toolResult?.message) {
        return (
          <div className="my-4 w-full">
            <p>{toolResult.message}</p>
          </div>
        );
      }
    }

    // Check for rebookService result
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'rebookService' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'rebookService'
      )?.result;

      if (toolResult?.message) {
        return (
          <div className="my-4 w-full">
            <p>{toolResult.message}</p>
          </div>
        );
      }
    }

    // Check for service provider selection
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'selectProvider' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'selectProvider'
      )?.result;

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
                    console.log(`Selected provider: ${providerId}`);
                    append({
                      content: `I'd like to select ${provider.name} as my service provider. Please show me the available time slots.`,
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
      (t: { toolName: string; state: string; }) => t.toolName === 'createOrder' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'createOrder'
      )?.result;
      if (!toolResult) return null;

      const orderData = {
        orderId: toolResult.orderId,
        service: {
          name: toolResult.service?.name || 'Unknown Service',
          variant: toolResult.service?.variant?.name ? {
            name: toolResult.service?.variant?.name,
            price: toolResult.service?.variant?.price || toolResult.amount
          } : undefined
        },
        provider: {
          name: toolResult?.provider?.name || 'Unknown Provider'
        },
        location: {
          area: toolResult?.location?.area || 'Unknown Area',
          city: toolResult?.location?.city || 'Unknown City',
          details: toolResult?.location?.details
        },
        scheduledTime: toolResult.scheduledTime || 'Unknown Time',
        customer: {
          name: toolResult.customer?.name || 'Unknown Customer',
          phone: toolResult.customer?.phone || 'N/A'
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
      (t: { toolName: string; state: string; }) => t.toolName === 'processPayment' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'processPayment'
      )?.result;

      if (!toolResult) return null;

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

    // Check for user details collection
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'collectUserDetails' && t.state === 'result'
    )) {

      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'collectUserDetails'
      )?.result;

      return (
        <div className="my-4 w-full">
          <UserDetailsForm
            name={toolResult.details.name}
            phone={toolResult.details.phone}
            address={toolResult.details.address}
            area={toolResult.details.area}
            city={toolResult.details.city}
            onSubmit={(details) => {
              append({
                content: `I've confirmed my details - Name: ${details.name}, Phone: ${details.phone}, Address: ${details.address}, Area: ${details.area}, City: ${details.city}`,
                role: 'user'
              });
            }}
          />
        </div>
      );
    }

    // Check for order cancellation
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'cancelOrder' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'cancelOrder'
      )?.result;

      // Logic to manage dialog visibility
      if (toolResult?.orderId && !isCancellationDialogOpen) {
        setIsCancellationDialogOpen(true);
      }

      return (
        <div className="my-4 w-full">
          <CancellationDialog
            orderId={toolResult?.orderId}
            isOpen={isCancellationDialogOpen} // Use state variable
            onClose={() => {
              setIsCancellationDialogOpen(false); // Close dialog
              append({
                content: 'I changed my mind, I don\'t want to cancel the order.',
                role: 'user'
              });
            }}
            onConfirm={(reason, refundRequired) => {
              append({
                content: `I want to cancel the order. Reason: ${reason}. ${refundRequired ? 'I need a refund.' : 'No refund needed.'}`,
                role: 'user'
              });
              setIsCancellationDialogOpen(false); // Close dialog after confirm
            }}
          />
        </div>
      );
    }

    // Check for order rescheduling interface
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'rescheduleOrder' && t.state === 'result'
    )) {
      const toolInvocation = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'rescheduleOrder'
      );

      // Assuming orderId is passed in the initial tool invocation parameters
      const orderId = toolInvocation?.result?.orderId || 'UNKNOWN_ORDER_ID'; // Adjust based on actual tool invocation structure
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'rescheduleOrder'
      )?.result;

      if (toolResult?.status === 'rescheduled') {
        return (
          <div className="my-4 w-full">
            <p>Your order has been successfully rescheduled!</p>
            <p>New Date/Time: {toolResult.newSchedule.dateTime}</p>
          </div>
        );
      }

      return (
        <div className="my-4 w-full">
          <ReschedulingInterface
            orderId={orderId}
            availableSlots={[
              '09:00 AM',
              '10:00 AM',
              '11:00 AM',
              '02:00 PM',
              '03:00 PM',
              '04:00 PM'
            ]}
            onReschedule={(newDateTime, reason) => {
              append({
                content: `I want to reschedule order ${orderId} to ${newDateTime}${reason ? `. Reason: ${reason}` : ''}.`,
                role: 'user'
              });
            }}
            onCancel={() => {
              append({
                content: 'I changed my mind, I don\'t want to reschedule order.',
                role: 'user'
              });
            }}
          />
        </div>
      );
    }
    // Check for order status updates
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'trackOrderStatus' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'trackOrderStatus'
      )?.result;

      if (toolResult?.status) {
        return (
          <div className="my-4 w-full">
            <OrderStatusCard
              orderId={message.toolInvocations.find(t => t.toolName === 'trackOrderStatus')!.result.orderId || 'UNKNOWN_ORDER_ID'}
              status={toolResult.status}
              providerDetails={toolResult.providerDetails}
              estimatedArrival={toolResult.estimatedArrival}
              onTrack={() => {
                append({
                  content: 'Can you show me the current location of the service provider?',
                  role: 'user'
                });
              }}
              onUpdateStatus={(orderId, newStatus) => {
                append({
                  content: `Please update the status of order ${orderId} to ${newStatus}.`,
                  role: 'user'
                });
              }}

            />
          </div>
        );
      }
    }


    // Check for order status updates
    if (message.role === 'assistant' && message.toolInvocations?.some(
      (t: { toolName: string; state: string; }) => t.toolName === 'updateOrderStatus' && t.state === 'result'
    )) {
      const toolResult = message.toolInvocations.find(
        (t: { toolName: string; }) => t.toolName === 'updateOrderStatus'
      )?.result;

      if (toolResult?.status) {
        return (
          <div className="my-4 w-full">
            <OrderStatusCard
              orderId={message.toolInvocations.find(t => t.toolName === 'updateOrderStatus')!.result.orderId || 'UNKNOWN_ORDER_ID'}
              status={toolResult.status}
              providerDetails={toolResult.providerDetails}
              onTrack={() => {
                append({
                  content: 'Can you show me the current status of the order?',
                  role: 'user'
                });
              }}
              onUpdateStatus={(orderId, newStatus) => {
                append({
                  content: `Please update the status of order ${orderId} to ${newStatus}.`,
                  role: 'user'
                });
              }}
              onReview={() => {
                append({
                  content: `I'd like to leave a review for my completed order ${toolResult.orderId}.`,
                  role: 'user'
                });
              }}
            />
          </div>
        );
      }
    }

    // Add loading state


    return null;
  };

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        return (
          <div
            key={index}
            ref={isLastMessage ? messagesEndRef : null}
            className={cn("flex flex-col", message.role === 'user' ? "items-end" : "items-start")}
          >
            {message.content &&
              <div
                data-role={message.role}
                className="max-w-[80%] rounded-2xl px-4 py-2.5 text-base data-[role=assistant]:bg-gray-50 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
              >
                {message.content}
              </div>
            }
            {message.role === 'assistant' && renderDynamicComponent(message)}

            {isLoading && isLastMessage && (
              <div className="my-4 w-full flex items-center justify-start">
                <div className="mt-2 h-4 w-4 animate-bounce rounded-full bg-gray-300"> </div>
              </div>)}
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
