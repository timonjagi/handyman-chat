'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, CreditCard, Smartphone } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface PaymentStatusCardProps {
  payment: {
    paymentId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    method: 'mpesa' | 'card' | 'cash'
    amount: number
    currency: string
    transactionDetails?: {
      reference: string
      timestamp: string
    }
  }
  onRetry?: () => void
  onDone: () => void
}

export function PaymentStatusCard({ payment, onRetry, onDone }: PaymentStatusCardProps) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (payment.status === 'processing') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer)
            return 100
          }
          return prev + 10
        })
      }, 500)
      
      return () => clearInterval(timer)
    } else if (payment.status === 'completed') {
      setProgress(100)
    } else if (payment.status === 'failed') {
      setProgress(0)
    }
  }, [payment.status])
  
  const renderStatusIcon = () => {
    switch (payment.status) {
      case 'completed':
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-500" />
      case 'pending':
      case 'processing':
      default:
        return <Clock className="h-12 w-12 text-blue-500 animate-pulse" />
    }
  }
  
  const renderStatusText = () => {
    switch (payment.status) {
      case 'completed':
        return 'Payment Successful'
      case 'failed':
        return 'Payment Failed'
      case 'processing':
        return 'Processing Payment'
      case 'pending':
      default:
        return 'Awaiting Payment'
    }
  }
  
  const renderPaymentMethodIcon = () => {
    switch (payment.method) {
      case 'mpesa':
        return <Smartphone className="h-5 w-5 text-green-600" />
      case 'card':
        return <CreditCard className="h-5 w-5 text-blue-600" />
      case 'cash':
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          {renderStatusIcon()}
          <h3 className="text-lg font-medium">{renderStatusText()}</h3>
          {payment.status === 'processing' && (
            <div className="w-full mt-2">
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderPaymentMethodIcon()}
              <span className="text-sm font-medium">
                {payment.method === 'mpesa' ? 'M-Pesa' : payment.method === 'card' ? 'Card' : 'Cash'}
              </span>
            </div>
            <span className="text-sm font-semibold">
              {payment.currency} {payment.amount.toLocaleString()}
            </span>
          </div>
          
          {payment.transactionDetails && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span>{payment.transactionDetails.reference}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span>{new Date(payment.transactionDetails.timestamp).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {payment.status === 'failed' && onRetry && (
          <Button onClick={onRetry} className="w-full">Retry Payment</Button>
        )}
        {payment.status === 'completed' && (
          <Button onClick={onDone} className="w-full">Continue</Button>
        )}
      </CardFooter>
    </Card>
  )
}
