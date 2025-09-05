'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UserDetailsFormProps {
  name: string
  phone: string
  address: string
  area: string
  city: string
  onSubmit: (details: {
    name: string
    phone: string
    address: string
    area: string
    city: string
  }) => void
}

export function UserDetailsForm({ name, phone, address, area, city, onSubmit }: UserDetailsFormProps) {
  const [details, setDetails] = useState({
    name: name || '',
    phone: phone || '',
    address: address || '',
    area: area || '',
    city: city || ''
  })

  return (
    <Card>
      <CardHeader className="text-lg font-medium">Your Details</CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Full Name"
          value={details.name}
          onChange={(e) => setDetails({ ...details, name: e.target.value })}
        />
        <Input
          placeholder="Phone Number"
          value={details.phone}
          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
        />
        <Input
          placeholder="Address"
          value={details.address}
          onChange={(e) => setDetails({ ...details, address: e.target.value })}
        />
        <Input
          placeholder="Area/Neighborhood"
          value={details.area}
          onChange={(e) => setDetails({ ...details, area: e.target.value })}
        />
        <Input
          placeholder="City"
          value={details.city}
          onChange={(e) => setDetails({ ...details, city: e.target.value })}
        />
        <Button
          className="w-full"
          onClick={() => onSubmit(details)}
          disabled={!details.name || !details.phone || !details.city}
        >
          Confirm Details
        </Button>
      </CardContent>
    </Card>
  )
}