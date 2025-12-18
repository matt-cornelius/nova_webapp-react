import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Donation, IndividualAccount } from '../demo-data/donations'
import { Organization } from '../demo-data/organizations'
import { formatRelativeTime } from '../utils/formatTime'

interface DonationCardProps {
  donation: Donation
  donor?: IndividualAccount
  organization?: Organization
  isLiked: boolean
  onToggleLike: () => void
}

export function DonationCard({
  donation,
  donor,
  organization,
  isLiked,
  onToggleLike,
}: DonationCardProps) {
  const navigate = useNavigate()
  const donorName = donor?.fullName ?? 'Unknown donor'
  const donorHandle = donor?.handle ?? '@unknown'

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-primary-dark font-bold text-lg">
              {donorName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-on-surface">{donorName}</div>
              <div className="text-sm text-on-surface-variant">
                {donorHandle}
              </div>
            </div>
            <div className="text-sm text-on-surface-variant ml-4">
              {formatRelativeTime(donation.createdAt)}
            </div>
          </div>

          {/* Message */}
          {donation.message && (
            <p className="text-on-surface mb-2 leading-relaxed">
              {donation.message}
            </p>
          )}

          {/* Emoji */}
          {donation.emoji && (
            <div className="text-2xl mb-2">{donation.emoji}</div>
          )}

          {/* Footer */}
          <div className="text-sm text-on-surface-variant">
            Paid{' '}
            <span className="font-semibold text-primary">
              ${donation.amountUsd.toFixed(2)}
            </span>{' '}
            to{' '}
            {organization ? (
              <button
                onClick={() => navigate(`/organization/${organization.id}`)}
                className="font-semibold text-primary underline hover:text-primary-dark"
              >
                {organization.name}
              </button>
            ) : (
              <span className="font-semibold text-primary">
                Unknown organization
              </span>
            )}
          </div>
        </div>

        {/* Like Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onToggleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={24}
              fill={isLiked ? 'currentColor' : 'none'}
              className={isLiked ? 'text-primary' : ''}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

