'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ServiceSelectionCardProps {
  services: {
    id: string
    name: string
    description: string
    price: number
  }[]
  onSelect: (serviceId: string) => void
}

export function ServiceSelectionCard({ services, onSelect }: ServiceSelectionCardProps) {
  return (
    <Card>
      <CardHeader className="text-lg font-medium">Available Services</CardHeader>
      <CardContent className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <p className="text-sm font-medium mt-1">KSH {service.price}</p>
            </div>
            <Button onClick={() => onSelect(service.id)}>Select</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}