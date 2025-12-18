import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Heart, AlertCircle } from 'lucide-react'
import { demoOrganizations } from '../demo-data/organizations'
import { demoDonations, getDonor } from '../demo-data/donations'
import { formatRelativeTime } from '../utils/formatTime'
import { DonationDialog } from '../components/DonationDialog'
import { useState } from 'react'

export function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showDonationDialog, setShowDonationDialog] = useState(false)

  const organization = demoOrganizations.find((org) => org.id === id)

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-error mb-4" size={64} />
          <h2 className="text-xl font-semibold text-on-surface mb-2">
            Organization not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-dark"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const organizationDonations = demoDonations
    .filter(
      (donation) =>
        donation.toOrganizationId === organization.id &&
        donation.isPublic &&
        donation.status === 'completed'
    )
    .sort((a, b) => b.amountUsd - a.amountUsd)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-primary-dark text-center">
            {organization.name}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Organization Header */}
        <div className="text-center mb-8">
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="w-32 h-32 rounded-2xl mx-auto mb-5 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          <div className="flex items-center justify-center gap-2 mb-3">
            <h2 className="text-2xl font-bold text-on-surface">
              {organization.name}
            </h2>
            {organization.isVerified && (
              <span className="text-primary">✓</span>
            )}
          </div>
          <p className="text-on-surface-variant mb-4">{organization.tagline}</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 mb-8 text-on-surface">
          <MapPin className="text-primary" size={20} />
          <span>
            {organization.city}, {organization.country}
          </span>
        </div>

        {/* About */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center mb-4">About</h3>
          <p className="text-on-surface leading-relaxed text-center">
            {organization.description}
          </p>
        </div>

        {/* Statistics */}
        <div className="bg-surface-variant rounded-2xl p-5 mb-8">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                ${organization.totalReceivedUsd.toFixed(0)}
              </div>
              <div className="text-xs text-on-surface-variant">
                Total Raised
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {organization.supportersCount}
              </div>
              <div className="text-xs text-on-surface-variant">Supporters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {organization.category}
              </div>
              <div className="text-xs text-on-surface-variant">Category</div>
            </div>
          </div>
        </div>

        {/* Donate Button */}
        <button
          onClick={() => setShowDonationDialog(true)}
          className="w-full bg-primary text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors mb-8"
        >
          <Heart size={20} />
          Donate Now
        </button>

        {/* Top Donations */}
        {organizationDonations.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold text-center mb-5">
              Recent Top Donations
            </h3>
            <div className="space-y-3">
              {organizationDonations.map((donation, index) => {
                const donor = getDonor(donation)
                return (
                  <div
                    key={donation.id}
                    className="bg-surface rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                          index < 3
                            ? 'bg-primary-light text-primary-dark'
                            : 'bg-surface-variant text-on-surface-variant'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                        <span className="text-primary-dark font-bold">
                          {donor?.fullName.charAt(0).toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-on-surface">
                          {donor?.fullName ?? 'Anonymous'}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {formatRelativeTime(donation.createdAt)}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        ${donation.amountUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="bg-surface-variant rounded-2xl p-8 text-center">
            <Heart className="mx-auto text-on-surface-variant mb-5" size={56} />
            <p className="text-lg font-medium text-on-surface">
              Be the first to donate!
            </p>
          </div>
        )}
      </main>

      {showDonationDialog && (
        <DonationDialog
          organization={organization}
          onClose={() => setShowDonationDialog(false)}
        />
      )}
    </div>
  )
}

