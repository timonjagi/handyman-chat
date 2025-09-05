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

  },
  estimatedArrival?: string
  onTrack: () => void;
  onReview?: () => void;
  onUpdateStatus: (orderId: string, newStatus: 'confirmed' | 'in_progress' | 'completed') => void;
}

export function OrderStatusCard({ orderId, status, providerDetails, onUpdateStatus, estimatedArrival, onReview }: OrderStatusCardProps) {
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
            {status === 'completed' && <p className="text-sm text-muted-foreground">
              Service completed.
            </p>}
            {status === 'confirmed' && <p className="text-sm text-muted-foreground">
              Order confirmed. Estimated arrival: {estimatedArrival}
            </p>}
            {status === 'in_progress' && <p className="text-sm text-muted-foreground">
              Service in progress. Pending completion.
            </p>}
            {status === 'pending' && <p className="text-sm text-muted-foreground">
              Order pending confirmation.
            </p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <p>{providerDetails.phone}</p>
        </div>
      </CardContent>
      {nextStatus && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onUpdateStatus(orderId, nextStatus as 'confirmed' | 'in_progress')}>
            Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1).replace('_', ' ')}
          </Button>
          {/* {status !== 'pending' && (
            <Button
              variant="outline"
              className="w-full "
              onClick={onTrack}>
              Track Service Provider
            </Button>
          )} */}
        </CardFooter>
      )}
      {status === 'completed' && onReview && (
        <CardFooter>
          <Button className="w-full" onClick={onReview}>
            Leave a Review
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
