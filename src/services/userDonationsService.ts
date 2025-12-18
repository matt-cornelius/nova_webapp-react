// Service to track which posts a user has donated to

export interface UserPostDonation {
  userId: string
  postId: string
  amount: number
  donatedAt: Date
}

const STORAGE_KEY = 'userPostDonations'

// Get all donations for a user
export function getUserDonations(userId: string): UserPostDonation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const allDonations: UserPostDonation[] = JSON.parse(stored)
    const userDonations = allDonations
      .filter(d => d.userId === userId)
      .map(d => ({
        ...d,
        donatedAt: new Date(d.donatedAt),
      }))
    
    return userDonations
  } catch (e) {
    console.error('Error loading user donations:', e)
    return []
  }
}

// Record a donation
export function recordDonation(
  userId: string,
  postId: string,
  amount: number
): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const allDonations: UserPostDonation[] = stored ? JSON.parse(stored) : []
    
    const newDonation: UserPostDonation = {
      userId,
      postId,
      amount,
      donatedAt: new Date(),
    }
    
    allDonations.push(newDonation)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allDonations))
  } catch (e) {
    console.error('Error recording donation:', e)
  }
}

// Get unique post IDs that a user has donated to
export function getDonatedPostIds(userId: string): string[] {
  const donations = getUserDonations(userId)
  return [...new Set(donations.map(d => d.postId))]
}

