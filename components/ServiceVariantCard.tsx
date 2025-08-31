import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ServiceVariantCardProps {
  variants: {
    id: string
    name: string
    description: string
    price: number
  }[]
  recommendedVariant?: {
    id: string
    name: string
    description: string
    price: number
  } | null
  onSelect: (variantId: string) => void
}

export function ServiceVariantCard({ variants, recommendedVariant, onSelect }: ServiceVariantCardProps) {
  return (
    <Card>
      <CardHeader className="text-lg font-medium">Available Service Options</CardHeader>
      <CardContent className="grid gap-4">
        {variants.map((variant) => (
          <div 
            key={variant.id} 
            className={`flex items-center justify-between p-4 border rounded-lg ${
              recommendedVariant?.id === variant.id ? 'border-primary' : ''
            }`}
          >
            <div>
              <h4 className="font-medium">{variant.name}</h4>
              <p className="text-sm text-muted-foreground">{variant.description}</p>
              <p className="text-sm font-medium mt-1">KSH {variant.price}</p>
              {recommendedVariant?.id === variant.id && (
                <span className="text-xs text-primary mt-1">Recommended</span>
              )}
            </div>
            <Button onClick={() => onSelect(variant.id)}>Select</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}