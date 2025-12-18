import { useState } from 'react'
import { X } from 'lucide-react'
import { Organization } from '../demo-data/organizations'
import { submitDonation } from '../services/donationService'

interface DonationDialogProps {
  organization: Organization
  onClose: () => void
}

const quickAmounts = [5, 10, 25, 50, 100]

export function DonationDialog({ organization, onClose }: DonationDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCustomAmount = selectedAmount === null
  const donationAmount = isCustomAmount
    ? parseFloat(customAmount) || null
    : selectedAmount

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const canConfirm =
    donationAmount !== null &&
    donationAmount > 0 &&
    email.trim() !== '' &&
    isValidEmail(email.trim())

  const handleConfirm = async () => {
    if (!canConfirm) return

    setIsLoading(true)
    setError(null)

    try {
      await submitDonation({
        organization,
        amount: donationAmount!,
        email: email.trim(),
      })
      onClose()
      // Show success message (you could use a toast library here)
      alert('Donation received!')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error processing donation'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="w-16 h-16 rounded-xl object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-on-surface">
                  {organization.name}
                </h3>
                {organization.isVerified && (
                  <span className="text-primary">✓</span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                {organization.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <X size={24} />
            </button>
          </div>

          {/* Amount Selector */}
          <div className="mb-8">
            <h4 className="font-semibold text-on-surface mb-4">
              Select Amount
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  className={`w-24 h-14 rounded-xl font-bold transition-colors ${
                    selectedAmount === amount
                      ? 'bg-primary text-white'
                      : 'bg-surface-variant text-on-surface-variant border-2 border-gray-200'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedAmount(null)
                  setCustomAmount('')
                }}
                className={`w-24 h-14 rounded-xl font-bold transition-colors ${
                  isCustomAmount
                    ? 'bg-primary text-white'
                    : 'bg-surface-variant text-on-surface-variant border-2 border-gray-200'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomAmount && (
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-surface-variant rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            )}
          </div>

          {/* Email Input */}
          <div className="mb-8">
            <h4 className="font-semibold text-on-surface mb-3">
              Email for Receipt
            </h4>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-surface-variant rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {email && !isValidEmail(email) && (
              <p className="text-error text-sm mt-2">Enter a valid email</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-error text-sm">
              {error}
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            className={`w-full py-4 rounded-xl font-bold transition-colors ${
              canConfirm && !isLoading
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm Donation'}
          </button>
        </div>
      </div>
    </div>
  )
}

