'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface ServiceProviderCardProps {
  provider: {
    id: string
    name: string
    rating: number
    completedJobs: number
    photo: string
    services: string[]
  }
  onSelect: (providerId: string) => void
  selected?: boolean
}

export function ServiceProviderCard({ provider, onSelect, selected = false }: ServiceProviderCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={`w-full transition-all duration-200 ${selected ? 'border-blue-500 shadow-md' : ''} ${isHovered ? 'shadow-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <Image
            src={provider.photo}
            alt={provider.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{provider.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{provider.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>{provider.completedJobs} jobs completed</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Available today</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          variant={selected ? "default" : "outline"}
          onClick={() => onSelect(provider.id)}
        >
          {selected ? 'Selected' : 'Select Provider'}
        </Button>
      </CardFooter>
    </Card>
  )
}
