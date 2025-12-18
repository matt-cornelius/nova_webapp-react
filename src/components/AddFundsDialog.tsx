import { useState } from 'react'
import { X, DollarSign, AlertCircle } from 'lucide-react'

interface AddFundsDialogProps {
  onClose: () => void
  onConfirm: (amount: number) => Promise<boolean>
}

const quickAmounts = [10, 25, 50, 100, 250, 500]

export function AddFundsDialog({ onClose, onConfirm }: AddFundsDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCustomAmount = selectedAmount === null
  const amount = isCustomAmount
    ? parseFloat(customAmount) || null
    : selectedAmount

  const canConfirm = amount !== null && amount > 0

  const handleConfirm = async () => {
    if (!canConfirm) return

    setIsLoading(true)
    setError(null)

    try {
      const success = await onConfirm(amount)
      if (success) {
        onClose()
      } else {
        setError('Failed to add funds. Please try again.')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error adding funds'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                <DollarSign className="text-primary-dark" size={24} />
              </div>
              <h3 className="font-bold text-xl text-on-surface">
                Add Funds
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-on-surface-variant" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Quick Amount Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt)
                    setCustomAmount('')
                  }}
                  className={`py-3 px-4 rounded-xl font-semibold transition-colors ${
                    selectedAmount === amt
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-on-surface hover:bg-gray-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface mb-3">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-lg">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white text-lg font-semibold"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl font-semibold border-2 border-gray-300 text-on-surface hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isLoading}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Funds'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

