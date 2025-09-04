'use client'

import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react'

interface OrderStatusCardProps {
  orderId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
  providerDetails: {
    name: string
    phone: string
    estimatedArrival: string
  }
  onTrack: () => void;
  onUpdateStatus: (orderId: string, newStatus: 'confirmed' | 'in_progress' | 'completed') => void;
}

export function OrderStatusCard({ orderId, status, providerDetails, onTrack, onUpdateStatus }: OrderStatusCardProps) {
  const getNextStatus = () => {
    switch (status) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

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
      {nextStatus && (
        <CardFooter>
          <Button onClick={() => onUpdateStatus(orderId, nextStatus as 'confirmed' | 'in_progress' | 'completed')}>
            Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1).replace('_', ' ')}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
