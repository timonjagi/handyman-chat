'use client'

import { Calendar, MapPin, User, Phone, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface OrderSummaryCardProps {
  order: {
    orderId: string
    service: {
      name: string
      variant?: {
        name: string
        price: number
      }
    }
    provider: {
      name: string
    }
    location: {
      area: string
      city: string
      details?: string
    }
    scheduledTime: string
    customer: {
      name: string
      phone: string
    }
    amount: number
    currency: string
  }
  onConfirm: () => void
  onEdit: () => void
}

export function OrderSummaryCard({ order, onConfirm, onEdit }: OrderSummaryCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Service</h3>
          <p>{order.service.name} {order.service.variant ? `- ${order.service.variant.name}` : ''}</p>
        </div>
        
        <div>
          <h3 className="font-medium">Provider</h3>
          <p>{order.provider.name}</p>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
          <div>
            <h3 className="font-medium">Scheduled Time</h3>
            <p className="text-sm text-gray-600">{order.scheduledTime}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="text-sm text-gray-600">{order.location.area}, {order.location.city}</p>
            {order.location.details && (
              <p className="text-sm text-gray-600">{order.location.details}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <User className="mt-0.5 h-4 w-4 text-gray-500" />
          <div>
            <h3 className="font-medium">Customer</h3>
            <p className="text-sm text-gray-600">{order.customer.name}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">Total Amount</h3>
          </div>
          <p className="text-lg font-semibold">{order.currency} {order.amount.toLocaleString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          Edit
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          Confirm & Pay
        </Button>
      </CardFooter>
    </Card>
  )
}
