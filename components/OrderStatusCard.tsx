'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react'

interface OrderStatusCardProps {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
  providerDetails: {
    name: string
    phone: string
    estimatedArrival: string
  }
  onTrack: () => void
}

export function OrderStatusCard({ status, providerDetails, onTrack }: OrderStatusCardProps) {
  return (
    <Card>
      <CardHeader className="text-lg font-medium">
        Order Status: {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {status === 'completed' ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <Clock className="text-blue-500" />
          )}
          <div>
            <p className="font-medium">{providerDetails.name}</p>
            <p className="text-sm text-muted-foreground">
              Estimated arrival: {providerDetails.estimatedArrival}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <p>{providerDetails.phone}</p>
        </div>
      </CardContent>
    </Card>
  )
}