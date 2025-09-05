import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface CancellationDialogProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, refundRequired: boolean) => void
}

export function CancellationDialog({ orderId, isOpen, onClose, onConfirm }: CancellationDialogProps) {
  const [reason, setReason] = useState('')
  const [refundRequired, setRefundRequired] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for Cancellation</Label>
            <Textarea
              placeholder="Please provide a reason for cancellation"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <RadioGroup
            value={refundRequired ? 'yes' : 'no'}
            onValueChange={(value) => setRefundRequired(value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="refund-yes" />
              <Label htmlFor="refund-yes">Request Refund</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="refund-no" />
              <Label htmlFor="refund-no">No Refund Required</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onConfirm(reason, refundRequired)
              onClose()
            }}
            disabled={!reason.trim()}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
