'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { useState } from 'react'

interface ReviewFormProps {
  orderId: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewForm({ orderId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  return (
    <Card>
      <CardHeader className="text-lg font-medium">Rate Your Experience</CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`hover:text-yellow-400 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={() => onSubmit(rating, comment)}
          disabled={!rating || !comment.trim()}
        >
          Submit Review
        </Button>
      </CardContent>
    </Card>
  )
}
