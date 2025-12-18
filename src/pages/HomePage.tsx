import { useDonations } from '../context/DonationsContext'
import { demoOrganizations } from '../demo-data/organizations'
import { getDonor, getOrganization } from '../demo-data/donations'
import { DonationCard } from '../components/DonationCard'
import { MainNavBar } from '../components/MainNavBar'
import { useAuth } from '../context/AuthContext'
import { Heart, Users, TrendingUp, DollarSign, Plus } from 'lucide-react'
import { useOrganizationPosts } from '../context/OrganizationPostsContext'
import { CreatePostDialog } from '../components/CreatePostDialog'
import { useState } from 'react'

export function HomePage() {
  const { donations, isLiked, toggleLike } = useDonations()
  const { user } = useAuth()
  const { createPost } = useOrganizationPosts()
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false)

  // Organization view
  if (user && user.accountType === 'organization') {
    const orgDonations = donations.filter(
      (d) => d.toOrganizationId === user.id && d.status === 'completed'
    )
    const totalReceived = orgDonations.reduce(
      (sum, d) => sum + d.amountUsd,
      0
    )

    const handleCreatePost = (postData: any) => {
      createPost(postData)
    }

    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-primary-dark text-center">
              Dashboard
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-5 py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              Welcome, {user.name} 🎉
            </h2>
            <p className="text-on-surface-variant mb-4">{user.tagline}</p>
            <button
              onClick={() => setShowCreatePostDialog(true)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Donation Post
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface rounded-xl p-4 border border-gray-200 text-center">
              <DollarSign
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <div className="font-bold text-lg text-on-surface">
                ${totalReceived.toFixed(2)}
              </div>
              <div className="text-xs text-on-surface-variant">
                Total Received
              </div>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-gray-200 text-center">
              <Heart
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <div className="font-bold text-lg text-on-surface">
                {orgDonations.length}
              </div>
              <div className="text-xs text-on-surface-variant">Donations</div>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-gray-200 text-center">
              <Users
                size={24}
                className="text-primary mx-auto mb-2"
              />
              <div className="font-bold text-lg text-on-surface">
                {user.supportersCount}
              </div>
              <div className="text-xs text-on-surface-variant">Supporters</div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-on-surface mb-3">
              Recent Donations
            </h3>
          </div>

          <div className="space-y-4">
            {orgDonations.length > 0 ? (
              orgDonations
                .slice(0, 10)
                .map((donation) => {
                  const donor = getDonor(donation)
                  return (
                    <DonationCard
                      key={donation.id}
                      donation={donation}
                      donor={donor}
                      organization={user}
                      isLiked={isLiked(donation.id)}
                      onToggleLike={() => toggleLike(donation.id)}
                    />
                  )
                })
            ) : (
              <div className="bg-surface rounded-xl p-8 border border-gray-200 text-center">
                <p className="text-on-surface-variant">
                  No donations received yet. Share your organization to start
                  receiving support!
                </p>
              </div>
            )}
          </div>
        </main>

        <MainNavBar />
        {showCreatePostDialog && (
          <CreatePostDialog
            organization={user}
            onClose={() => setShowCreatePostDialog(false)}
            onConfirm={handleCreatePost}
          />
        )}
      </div>
    )
  }

  // User view (default)
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-primary-dark text-center">
            Home
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Welcome back 👋
          </h2>
          <p className="text-on-surface-variant">
            Here are the latest donations happening on the platform.
          </p>
        </div>

        <div className="space-y-4">
          {donations
            .filter((d) => d.isPublic && d.status === 'completed')
            .map((donation) => {
              const donor = getDonor(donation)
              const organization = getOrganization(donation, demoOrganizations)
              return (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  donor={donor}
                  organization={organization}
                  isLiked={isLiked(donation.id)}
                  onToggleLike={() => toggleLike(donation.id)}
                />
              )
            })}
        </div>
      </main>

      <MainNavBar />
    </div>
  )
}

