import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ReschedulingInterfaceProps {
  orderId: string
  availableSlots: string[]
  onReschedule: (newDateTime: string, reason: string) => void
  onCancel: () => void
}

export function ReschedulingInterface({ orderId, availableSlots, onReschedule, onCancel }: ReschedulingInterfaceProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const newDateTime = `${dateStr} ${selectedTime}`
      onReschedule(newDateTime, reason)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reschedule Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {availableSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Reason for rescheduling (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleReschedule}
          disabled={!selectedDate || !selectedTime}
        >
          Confirm Reschedule
        </Button>
      </CardFooter>
    </Card>
  )
}