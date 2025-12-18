import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { PostRecommendation, getRecommendedPosts } from '../services/recommendationService'
import { OrganizationPostCard } from './OrganizationPostCard'
import { useOrganizationPosts } from '../context/OrganizationPostsContext'

interface PostRecommendationsProps {
  userId: string
}

export function PostRecommendations({ userId }: PostRecommendationsProps) {
  const { posts, isLiked, toggleLike, donationRefreshTrigger } = useOrganizationPosts()
  const [recommendations, setRecommendations] = useState<PostRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRecommendations() {
      setIsLoading(true)
      try {
        const recs = await getRecommendedPosts(userId, posts, 3)
        // Ensure we only show exactly 3 (or fewer if not enough meet threshold)
        setRecommendations(recs.slice(0, 3))
      } catch (error) {
        console.error('Error loading recommendations:', error)
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    if (posts.length > 0) {
      loadRecommendations()
    } else {
      setIsLoading(false)
    }
  }, [userId, posts, donationRefreshTrigger])

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-primary" size={20} />
          <h2 className="text-xl font-bold text-on-surface">
            Recommended for You
          </h2>
        </div>
        <div className="text-center py-8 text-on-surface-variant">
          Loading recommendations...
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary" size={20} />
        <h2 className="text-xl font-bold text-on-surface">
          Recommended for You
        </h2>
        <span className="text-sm text-on-surface-variant">
          Based on your donation history
        </span>
      </div>
      {recommendations.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 border border-gray-200 text-center">
          <p className="text-on-surface-variant">
            Calculating your personalized recommendations...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(({ post, similarity }) => (
            <div key={post.id} className="relative">
              <OrganizationPostCard
                post={post}
                isLiked={isLiked(post.id)}
                onToggleLike={() => toggleLike(post.id)}
              />
              <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(similarity * 100)}% match
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

