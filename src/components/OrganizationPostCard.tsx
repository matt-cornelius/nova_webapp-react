import { Heart, Building2, DollarSign, Target } from 'lucide-react'
import { OrganizationPost, useOrganizationPosts } from '../context/OrganizationPostsContext'
import { formatRelativeTime } from '../utils/formatTime'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { PostDonationDialog } from './PostDonationDialog'
import { recordDonation } from '../services/userDonationsService'
import { useDonations } from '../context/DonationsContext'

interface OrganizationPostCardProps {
  post: OrganizationPost
  isLiked: boolean
  onToggleLike: () => void
}

export function OrganizationPostCard({
  post,
  isLiked,
  onToggleLike,
}: OrganizationPostCardProps) {
  const navigate = useNavigate()
  const { user, deductFunds } = useAuth()
  const { donateToPost } = useOrganizationPosts()
  const { addDonation } = useDonations()
  const [showDonateDialog, setShowDonateDialog] = useState(false)

  const progressPercentage = post.goalAmount
    ? Math.min((post.currentAmount / post.goalAmount) * 100, 100)
    : 0

  const handleDonate = async (amount: number): Promise<boolean> => {
    if (!user || user.accountType !== 'user') {
      return false
    }

    // Deduct from user's wallet
    const success = await deductFunds(amount)
    if (success) {
      // Update post's current amount
      donateToPost(post.id, amount)
      // Record the donation for recommendations
      recordDonation(user.id, post.id, amount)
      
      // Create a donation record for the Home feed
      addDonation({
        fromIndividualId: user.id,
        toOrganizationId: post.organizationId,
        amountUsd: amount,
        message: `Donated to ${post.title}`,
        emoji: '❤️',
        isPublic: true,
        isRecurringMonthly: false,
        status: 'completed',
        fundingSource: user.defaultFundingSource || 'wallet',
        campaignName: post.title,
      })
      
      return true
    }
    return false
  }

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Image */}
      {post.imageUrl && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            {post.organizationLogoUrl ? (
              <img
                src={post.organizationLogoUrl}
                alt={post.organizationName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) {
                    fallback.style.display = 'flex'
                  }
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-primary-light flex items-center justify-center ${
                post.organizationLogoUrl ? 'hidden' : ''
              }`}
            >
              <Building2 className="text-primary-dark" size={24} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate(`/organization/${post.organizationId}`)}
              className="font-semibold text-on-surface hover:text-primary transition-colors text-left"
            >
              {post.organizationName}
            </button>
            <div className="text-sm text-on-surface-variant">
              {formatRelativeTime(post.createdAt)}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-on-surface mb-2">{post.title}</h3>

        {/* Description */}
        <p className="text-on-surface mb-4 leading-relaxed line-clamp-3">
          {post.description}
        </p>

        {/* Category and Tags */}
        {(post.category || post.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <span className="px-3 py-1 bg-primary-light text-primary-dark text-xs rounded-full font-medium">
                {post.category}
              </span>
            )}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-on-surface-variant text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {post.goalAmount && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-on-surface-variant" />
                <span className="text-sm font-semibold text-on-surface">
                  ${post.currentAmount.toFixed(2)} raised
                </span>
              </div>
              <span className="text-sm text-on-surface-variant">
                of ${post.goalAmount.toFixed(2)} goal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <span className="text-sm text-on-surface-variant">
                {post.goalAmount
                  ? `${((post.currentAmount / post.goalAmount) * 100).toFixed(0)}% funded`
                  : `$${post.currentAmount.toFixed(2)} raised`}
              </span>
            </div>
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
          {user?.accountType === 'user' && (
            <button
              onClick={() => setShowDonateDialog(true)}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Donate
            </button>
          )}
        </div>
      </div>
      {showDonateDialog && (
        <PostDonationDialog
          post={post}
          onClose={() => setShowDonateDialog(false)}
          onConfirm={handleDonate}
        />
      )}
    </div>
  )
}

