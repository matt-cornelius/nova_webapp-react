import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Donation, demoDonations } from '../demo-data/donations'

interface DonationsContextType {
  donations: Donation[]
  likedDonationIds: Set<string>
  isLiked: (donationId: string) => boolean
  toggleLike: (donationId: string) => void
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void
}

const DonationsContext = createContext<DonationsContextType | undefined>(
  undefined
)

const STORAGE_KEY = 'donations'
const LIKES_STORAGE_KEY = 'likedDonations'

export function DonationsProvider({ children }: { children: ReactNode }) {
  const [likedDonationIds, setLikedDonationIds] = useState<Set<string>>(
    new Set()
  )
  const [donations, setDonations] = useState<Donation[]>([])

  // Load donations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let storedDonations: Donation[] = []
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        storedDonations = parsed.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
        }))
      } catch (e) {
        console.error('Error loading donations:', e)
      }
    }
    
    // Merge demo donations with stored donations, avoiding duplicates
    const demoDonationIds = new Set(demoDonations.map(d => d.id))
    const userDonationsOnly = storedDonations.filter(d => !demoDonationIds.has(d.id))
    const allDonations = [...demoDonations, ...userDonationsOnly].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
    
    setDonations(allDonations)

    // Load liked donations
    const storedLikes = localStorage.getItem(LIKES_STORAGE_KEY)
    if (storedLikes) {
      try {
        setLikedDonationIds(new Set(JSON.parse(storedLikes)))
      } catch (e) {
        console.error('Error loading liked donations:', e)
      }
    }
  }, [])

  // Save donations to localStorage whenever they change
  useEffect(() => {
    // Filter out demo donations before saving
    const demoDonationIds = new Set(demoDonations.map(d => d.id))
    const userDonations = donations.filter(d => !demoDonationIds.has(d.id))
    
    if (userDonations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userDonations))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [donations])

  // Save liked donations to localStorage whenever they change
  useEffect(() => {
    if (likedDonationIds.size > 0) {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedDonationIds)))
    } else {
      localStorage.removeItem(LIKES_STORAGE_KEY)
    }
  }, [likedDonationIds])

  const isLiked = (donationId: string) => {
    return likedDonationIds.has(donationId)
  }

  const toggleLike = (donationId: string) => {
    setLikedDonationIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(donationId)) {
        newSet.delete(donationId)
      } else {
        newSet.add(donationId)
      }
      return newSet
    })
  }

  const addDonation = (donationData: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation: Donation = {
      ...donationData,
      id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    setDonations((prev) => [newDonation, ...prev])
  }

  return (
    <DonationsContext.Provider
      value={{ donations, likedDonationIds, isLiked, toggleLike, addDonation }}
    >
      {children}
    </DonationsContext.Provider>
  )
}

export function useDonations() {
  const context = useContext(DonationsContext)
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationsProvider')
  }
  return context
}

