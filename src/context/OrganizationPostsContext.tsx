import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface OrganizationPost {
  id: string
  organizationId: string
  organizationName: string
  organizationLogoUrl?: string
  title: string
  description: string
  goalAmount?: number
  currentAmount: number
  imageUrl?: string
  createdAt: Date
  category?: string
  tags: string[]
}

// Default demo posts that appear for everyone
const defaultDemoPosts: OrganizationPost[] = [
  {
    id: 'demo_post_1',
    organizationId: 'org_clean_water',
    organizationName: 'Clean Water Now',
    organizationLogoUrl: 'https://images.pexels.com/photos/4618245/pexels-photo-4618245.jpeg',
    title: 'Help Us Build 10 New Wells in Rural Uganda',
    description: 'We need your support to bring clean, safe drinking water to 5,000 people in rural Uganda. Each well costs $2,500 and serves an entire village. Your donation will help us reach our goal of building 10 new wells this quarter.',
    goalAmount: 25000,
    currentAmount: 8750,
    category: 'Health',
    tags: ['water', 'africa', 'health', 'community'],
    createdAt: new Date(2024, 9, 1),
  },
  {
    id: 'demo_post_2',
    organizationId: 'org_coding_kids',
    organizationName: 'Code For Kids',
    organizationLogoUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    title: 'Laptops for Oakland Students',
    description: 'Help us provide 50 laptops to students in Oakland who don\'t have access to computers at home. These laptops will enable students to participate in our coding programs and complete their schoolwork.',
    goalAmount: 15000,
    currentAmount: 6200,
    category: 'Education',
    tags: ['education', 'technology', 'youth', 'oakland'],
    createdAt: new Date(2024, 9, 3),
  },
  {
    id: 'demo_post_3',
    organizationId: 'org_tree_alliance',
    organizationName: 'Urban Tree Alliance',
    organizationLogoUrl: 'https://images.pexels.com/photos/1131407/pexels-photo-1131407.jpeg',
    title: 'Plant 1,000 Trees in São Paulo',
    description: 'Join us in greening São Paulo! We\'re planting 1,000 trees in low-canopy neighborhoods to reduce heat islands and improve air quality. Each tree costs $25 to plant and maintain.',
    goalAmount: 25000,
    currentAmount: 18250,
    category: 'Environment',
    tags: ['trees', 'climate', 'urban', 'brazil'],
    createdAt: new Date(2024, 9, 5),
  },
  {
    id: 'demo_post_4',
    organizationId: 'org_emergency_relief',
    organizationName: 'Rapid Relief Fund',
    organizationLogoUrl: 'https://images.pexels.com/photos/6646912/pexels-photo-6646912.jpeg',
    title: 'Emergency Relief for Flood Victims',
    description: 'Recent floods have displaced thousands of families. We need immediate funds to provide food, shelter, and emergency supplies. Every dollar helps us reach more families in need.',
    goalAmount: 50000,
    currentAmount: 34200,
    category: 'Emergency Relief',
    tags: ['disaster', 'emergency', 'floods', 'relief'],
    createdAt: new Date(2024, 9, 7),
  },
  {
    id: 'demo_post_5',
    organizationId: 'org_clean_water',
    organizationName: 'Clean Water Now',
    organizationLogoUrl: 'https://images.pexels.com/photos/4618245/pexels-photo-4618245.jpeg',
    title: 'Water Filtration Systems for Schools',
    description: 'We\'re installing water filtration systems in 20 schools across rural areas. This will ensure children have access to clean water during school hours and reduce waterborne illnesses.',
    goalAmount: 12000,
    currentAmount: 4800,
    category: 'Health',
    tags: ['water', 'schools', 'children', 'health'],
    createdAt: new Date(2024, 9, 10),
  },
  {
    id: 'demo_post_6',
    organizationId: 'org_coding_kids',
    organizationName: 'Code For Kids',
    organizationLogoUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    title: 'Summer Coding Camp Scholarships',
    description: 'Help us provide 30 full scholarships for our summer coding camp. This intensive program teaches kids programming fundamentals and helps them build their first apps.',
    goalAmount: 9000,
    currentAmount: 3150,
    category: 'Education',
    tags: ['education', 'coding', 'summer', 'scholarships'],
    createdAt: new Date(2024, 9, 12),
  },
  {
    id: 'demo_post_7',
    organizationId: 'org_tree_alliance',
    organizationName: 'Urban Tree Alliance',
    organizationLogoUrl: 'https://images.pexels.com/photos/1131407/pexels-photo-1131407.jpeg',
    title: 'Community Garden Initiative',
    description: 'We\'re creating 5 new community gardens in underserved neighborhoods. These gardens will provide fresh produce and green spaces for communities while teaching sustainable gardening practices.',
    goalAmount: 18000,
    currentAmount: 11250,
    category: 'Environment',
    tags: ['gardening', 'community', 'sustainability', 'food'],
    createdAt: new Date(2024, 9, 14),
  },
  {
    id: 'demo_post_8',
    organizationId: 'org_emergency_relief',
    organizationName: 'Rapid Relief Fund',
    organizationLogoUrl: 'https://images.pexels.com/photos/6646912/pexels-photo-6646912.jpeg',
    title: 'Winter Shelter Program',
    description: 'As winter approaches, we need funds to provide warm shelter and supplies for families experiencing homelessness. Your donation will help us keep people safe and warm during the cold months.',
    goalAmount: 30000,
    currentAmount: 18900,
    category: 'Emergency Relief',
    tags: ['homelessness', 'winter', 'shelter', 'warmth'],
    createdAt: new Date(2024, 9, 16),
  },
]

interface OrganizationPostsContextType {
  posts: OrganizationPost[]
  likedPostIds: Set<string>
  isLiked: (postId: string) => boolean
  toggleLike: (postId: string) => void
  createPost: (post: Omit<OrganizationPost, 'id' | 'createdAt' | 'currentAmount'>) => void
  donateToPost: (postId: string, amount: number) => void
  donationRefreshTrigger: number
}

const OrganizationPostsContext = createContext<OrganizationPostsContextType | undefined>(
  undefined
)

export function OrganizationPostsProvider({ children }: { children: ReactNode }) {
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())
  const [posts, setPosts] = useState<OrganizationPost[]>([])
  const [donationRefreshTrigger, setDonationRefreshTrigger] = useState(0)

  // Load posts from localStorage on mount, merge with default demo posts
  useEffect(() => {
    const storedPosts = localStorage.getItem('organizationPosts')
    let userPosts: OrganizationPost[] = []
    
    if (storedPosts) {
      try {
        const parsed = JSON.parse(storedPosts)
        // Convert date strings back to Date objects
        userPosts = parsed.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }))
      } catch (e) {
        console.error('Error loading posts:', e)
      }
    }
    
    // Merge demo posts with user posts, avoiding duplicates
    const demoPostIds = new Set(defaultDemoPosts.map(p => p.id))
    const userPostsOnly = userPosts.filter(p => !demoPostIds.has(p.id))
    const allPosts = [...userPostsOnly, ...defaultDemoPosts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    
    setPosts(allPosts)

    // Load liked posts
    const storedLikes = localStorage.getItem('likedOrganizationPosts')
    if (storedLikes) {
      try {
        setLikedPostIds(new Set(JSON.parse(storedLikes)))
      } catch (e) {
        console.error('Error loading liked posts:', e)
      }
    }
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('organizationPosts', JSON.stringify(posts))
    }
  }, [posts])

  // Save liked posts to localStorage whenever they change
  useEffect(() => {
    if (likedPostIds.size > 0) {
      localStorage.setItem('likedOrganizationPosts', JSON.stringify(Array.from(likedPostIds)))
    }
  }, [likedPostIds])

  const isLiked = (postId: string) => {
    return likedPostIds.has(postId)
  }

  const toggleLike = (postId: string) => {
    setLikedPostIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const createPost = (postData: Omit<OrganizationPost, 'id' | 'createdAt' | 'currentAmount'>) => {
    const newPost: OrganizationPost = {
      ...postData,
      id: `post_${Date.now()}`,
      createdAt: new Date(),
      currentAmount: 0,
    }
    setPosts((prev) => [newPost, ...prev])
  }

  const donateToPost = (postId: string, amount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, currentAmount: post.currentAmount + amount }
          : post
      )
    )
    // Trigger refresh for recommendations
    setDonationRefreshTrigger((prev) => prev + 1)
  }

  return (
    <OrganizationPostsContext.Provider
      value={{ posts, likedPostIds, isLiked, toggleLike, createPost, donateToPost, donationRefreshTrigger }}
    >
      {children}
    </OrganizationPostsContext.Provider>
  )
}

export function useOrganizationPosts() {
  const context = useContext(OrganizationPostsContext)
  if (context === undefined) {
    throw new Error('useOrganizationPosts must be used within an OrganizationPostsProvider')
  }
  return context
}

