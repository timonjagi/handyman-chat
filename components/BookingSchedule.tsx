'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { Button } from './ui/button'

interface BookingScheduleProps {
  onDateSelect: (date: Date) => void
  availableSlots: string[]
  onTimeSelect: (time: string) => void
}

export function BookingSchedule({ onDateSelect, availableSlots, onTimeSelect }: BookingScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <Card>
      <CardHeader className="text-lg font-medium">Schedule Service</CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)
            date && onDateSelect(date)
          }}
        />
        <div className="grid grid-cols-3 gap-2 mt-4">
          {availableSlots.map((slot) => (
            <Button
              key={slot}
              variant="outline"
              onClick={() => onTimeSelect(slot)}
            >
              {slot}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}