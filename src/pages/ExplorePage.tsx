import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { MainNavBar } from '../components/MainNavBar'
import { useOrganizationPosts } from '../context/OrganizationPostsContext'
import { OrganizationPostCard } from '../components/OrganizationPostCard'
import { useAuth } from '../context/AuthContext'
import { CreatePostDialog } from '../components/CreatePostDialog'
import { PostRecommendations } from '../components/PostRecommendations'
import { getDonatedPostIds } from '../services/userDonationsService'

export function ExplorePage() {
  const { posts, isLiked, toggleLike, createPost, donationRefreshTrigger } = useOrganizationPosts()
  const { user } = useAuth()
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false)
  const [donatedPostIds, setDonatedPostIds] = useState<string[]>([])

  // Update donated post IDs when donations happen
  useEffect(() => {
    if (user?.accountType === 'user') {
      setDonatedPostIds(getDonatedPostIds(user.id))
    }
  }, [user, donationRefreshTrigger])

  const handleCreatePost = (postData: any) => {
    createPost(postData)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-primary-dark text-center">
            Explore
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6">
        {/* Recommendations for users who have donated */}
        {user?.accountType === 'user' && donatedPostIds.length > 0 && (
          <PostRecommendations userId={user.id} />
        )}

        {/* Organization Posts Feed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface">
              {user?.accountType === 'user' && donatedPostIds.length > 0
                ? 'All Posts'
                : 'Donation Posts'}
            </h2>
            {user?.accountType === 'organization' && (
              <button
                onClick={() => setShowCreatePostDialog(true)}
                className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Post
              </button>
            )}
          </div>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <OrganizationPostCard
                  key={post.id}
                  post={post}
                  isLiked={isLiked(post.id)}
                  onToggleLike={() => toggleLike(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-8 border border-gray-200 text-center">
              <p className="text-on-surface-variant">
                No donation posts yet. {user?.accountType === 'organization' ? 'Create one to get started!' : 'Check back soon!'}
              </p>
            </div>
          )}
        </div>
      </main>

      <MainNavBar />
      {showCreatePostDialog && user?.accountType === 'organization' && (
        <CreatePostDialog
          organization={user}
          onClose={() => setShowCreatePostDialog(false)}
          onConfirm={handleCreatePost}
        />
      )}
    </div>
  )
}

