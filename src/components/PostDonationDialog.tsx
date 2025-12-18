import { useState } from 'react'
import { X, DollarSign, AlertCircle, Wallet } from 'lucide-react'
import { OrganizationPost } from '../context/OrganizationPostsContext'
import { useAuth } from '../context/AuthContext'

interface PostDonationDialogProps {
  post: OrganizationPost
  onClose: () => void
  onConfirm: (amount: number) => Promise<boolean>
}

const quickAmounts = [5, 10, 25, 50, 100]

export function PostDonationDialog({
  post,
  onClose,
  onConfirm,
}: PostDonationDialogProps) {
  const { user } = useAuth()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCustomAmount = selectedAmount === null
  const donationAmount = isCustomAmount
    ? parseFloat(customAmount) || null
    : selectedAmount

  const userBalance = user?.walletBalanceUsd || 0
  const canAfford = donationAmount !== null && donationAmount <= userBalance
  const canConfirm =
    donationAmount !== null &&
    donationAmount > 0 &&
    canAfford &&
    user?.accountType === 'user'

  const handleConfirm = async () => {
    if (!canConfirm) return

    setIsLoading(true)
    setError(null)

    try {
      const success = await onConfirm(donationAmount!)
      if (success) {
        onClose()
      } else {
        setError('Failed to process donation. Please try again.')
      }
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
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-16 h-16 rounded-xl object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center justify-center">
                <DollarSign className="text-primary-dark" size={32} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-on-surface mb-1">
                {post.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                {post.organizationName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <X size={24} />
            </button>
          </div>

          {/* Wallet Balance */}
          <div className="mb-6 p-4 bg-primary-light rounded-xl border border-primary">
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={18} className="text-primary-dark" />
              <span className="text-sm text-on-surface-variant">Your Balance</span>
            </div>
            <div className="text-2xl font-bold text-primary-dark">
              ${userBalance.toFixed(2)}
            </div>
          </div>

          {/* Amount Selector */}
          <div className="mb-6">
            <h4 className="font-semibold text-on-surface mb-4">
              Select Amount
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  disabled={amount > userBalance}
                  className={`w-24 h-14 rounded-xl font-bold transition-colors ${
                    selectedAmount === amount
                      ? 'bg-primary text-white'
                      : amount > userBalance
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-surface-variant text-on-surface-variant border-2 border-gray-200 hover:border-primary'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <button
                type="button"
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
              <div className="relative">
                <DollarSign
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={userBalance}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-surface-variant rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}
            {donationAmount !== null && donationAmount > userBalance && (
              <p className="text-error text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={16} />
                Insufficient balance. Add funds to continue.
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-error text-sm flex items-center gap-2">
              <AlertCircle size={18} />
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

          {user?.accountType !== 'user' && (
            <p className="text-center text-sm text-on-surface-variant mt-4">
              Only individual users can make donations
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

