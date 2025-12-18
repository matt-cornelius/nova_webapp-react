// Service for generating post recommendations based on user's donation history

import { OrganizationPost } from '../context/OrganizationPostsContext'
import {
  generateEmbedding,
  cosineSimilarity,
  getPostEmbeddingText,
} from './embeddingService'
import { getDonatedPostIds } from './userDonationsService'

export interface PostRecommendation {
  post: OrganizationPost
  similarity: number
}

// Cache for embeddings to avoid regenerating them
const embeddingCache = new Map<string, number[]>()

// Get embedding for a post (with caching)
async function getPostEmbedding(post: OrganizationPost): Promise<number[]> {
  const cacheKey = post.id
  
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!
  }

  const text = getPostEmbeddingText(post)
  const embedding = await generateEmbedding(text)
  embeddingCache.set(cacheKey, embedding)
  
  return embedding
}

// Get average embedding from user's donated posts
async function getUserDonationEmbedding(
  userId: string,
  allPosts: OrganizationPost[]
): Promise<number[] | null> {
  const donatedPostIds = getDonatedPostIds(userId)
  
  if (donatedPostIds.length === 0) {
    return null
  }

  const donatedPosts = allPosts.filter(p => donatedPostIds.includes(p.id))
  
  if (donatedPosts.length === 0) {
    return null
  }

  // Get embeddings for all donated posts
  const embeddings = await Promise.all(
    donatedPosts.map(post => getPostEmbedding(post))
  )

  // Calculate average embedding
  const dimension = embeddings[0].length
  const averageEmbedding = new Array(dimension).fill(0)

  embeddings.forEach(embedding => {
    for (let i = 0; i < dimension; i++) {
      averageEmbedding[i] += embedding[i]
    }
  })

  // Normalize
  for (let i = 0; i < dimension; i++) {
    averageEmbedding[i] /= embeddings.length
  }

  const magnitude = Math.sqrt(
    averageEmbedding.reduce((sum, val) => sum + val * val, 0)
  )

  if (magnitude > 0) {
    return averageEmbedding.map(val => val / magnitude)
  }

  return averageEmbedding
}

// Get recommended posts based on user's donation history
export async function getRecommendedPosts(
  userId: string,
  allPosts: OrganizationPost[],
  limit: number = 3
): Promise<PostRecommendation[]> {
  const userEmbedding = await getUserDonationEmbedding(userId, allPosts)
  
  if (!userEmbedding) {
    // No donation history, return empty recommendations
    return []
  }

  const donatedPostIds = new Set(getDonatedPostIds(userId))

  // Calculate similarity for all non-donated posts
  const recommendations: PostRecommendation[] = []

  for (const post of allPosts) {
    // Skip posts the user has already donated to
    if (donatedPostIds.has(post.id)) {
      continue
    }

    const postEmbedding = await getPostEmbedding(post)
    const similarity = cosineSimilarity(userEmbedding, postEmbedding)

    recommendations.push({
      post,
      similarity,
    })
  }

  // Sort by similarity (highest first), filter by threshold, then return top N
  const sorted = recommendations.sort((a, b) => b.similarity - a.similarity)
  
  // Lower threshold to ensure we get recommendations (0.1 is more lenient)
  const filtered = sorted.filter(rec => rec.similarity > 0.1)
  
  // Always return top 3, even if similarity is low (for initial recommendations)
  const top3 = filtered.length >= 3 
    ? filtered.slice(0, limit)
    : sorted.slice(0, limit) // If filtered has less than 3, use top 3 from all (even if below threshold)
  
  console.log('Recommendations:', {
    total: recommendations.length,
    filtered: filtered.length,
    top3: top3.length,
    similarities: top3.map(r => ({ title: r.post.title, similarity: r.similarity }))
  })
  
  return top3
}

