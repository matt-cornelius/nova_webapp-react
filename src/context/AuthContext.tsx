import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IndividualAccount } from '../demo-data/donations'
import { Organization } from '../demo-data/organizations'

export type AccountType = 'user' | 'organization'

export interface UserAccount extends IndividualAccount {
  accountType: 'user'
}

export interface OrganizationAccount extends Omit<Organization, 'id'> {
  id: string
  accountType: 'organization'
  email: string
  password?: string
  joinedAt: Date
  walletBalanceUsd: number
}

export type Account = UserAccount | OrganizationAccount

interface AuthContextType {
  user: Account | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  addFunds: (amount: number) => Promise<boolean>
  deductFunds: (amount: number) => Promise<boolean>
}

interface RegisterData {
  accountType: 'user' | 'organization'
  // User fields
  fullName?: string
  handle?: string
  bio?: string
  // Organization fields
  name?: string
  tagline?: string
  description?: string
  category?: string
  city?: string
  country?: string
  website?: string
  ein?: string
  // Common fields
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    )

    // Find user by email
    const foundUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    )

    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Get existing users
    const registeredUsers = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    )

    // Check if email already exists
    const emailExists = registeredUsers.some(
      (u: any) => u.email === userData.email
    )

    if (emailExists) {
      return false
    }

    // Check handle for users
    if (userData.accountType === 'user' && userData.handle) {
      const handleExists = registeredUsers.some(
        (u: any) => u.handle === userData.handle
      )
      if (handleExists) {
        return false
      }
    }

    let newAccount: Account

    if (userData.accountType === 'user') {
      // Create new user account
      const newUser: UserAccount = {
        id: `user_${Date.now()}`,
        accountType: 'user',
        fullName: userData.fullName || '',
        handle: userData.handle || '',
        avatarUrl: '',
        email: userData.email,
        joinedAt: new Date(),
        bio: userData.bio || '',
        defaultFundingSource: '',
        walletBalanceUsd: 0,
        totalDonatedUsd: 0,
      }
      newAccount = newUser
    } else {
      // Create new organization account
      const newOrg: OrganizationAccount = {
        id: `org_${Date.now()}`,
        accountType: 'organization',
        name: userData.name || '',
        tagline: userData.tagline || '',
        description: userData.description || '',
        category: userData.category || '',
        city: userData.city || '',
        country: userData.country || '',
        logoUrl: '',
        website: userData.website || '',
        ein: userData.ein,
        totalReceivedUsd: 0,
        supportersCount: 0,
        isVerified: false,
        tags: [],
        email: userData.email,
        joinedAt: new Date(),
        walletBalanceUsd: 0,
      }
      newAccount = newOrg
    }

    // Store account with password
    const accountWithPassword = {
      ...newAccount,
      password: userData.password,
    }

    registeredUsers.push(accountWithPassword)
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))

    // Auto-login after registration
    const { password: _, ...accountWithoutPassword } = accountWithPassword
    setUser(accountWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(accountWithoutPassword))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const addFunds = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0) {
      return false
    }

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    )

    // Find and update the user
    const userIndex = registeredUsers.findIndex(
      (u: any) => u.id === user.id
    )

    if (userIndex === -1) {
      return false
    }

    // Get current balance
    const currentBalance = registeredUsers[userIndex].walletBalanceUsd || 0
    const newBalance = currentBalance + amount

    // Update balance in registered users
    registeredUsers[userIndex].walletBalanceUsd = newBalance

    // Update current user
    const updatedUser: Account = {
      ...user,
      walletBalanceUsd: newBalance,
    }

    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    return true
  }

  const deductFunds = async (amount: number): Promise<boolean> => {
    if (!user || amount <= 0) {
      return false
    }

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    )

    // Find and update the user
    const userIndex = registeredUsers.findIndex(
      (u: any) => u.id === user.id
    )

    if (userIndex === -1) {
      return false
    }

    // Get current balance
    const currentBalance = registeredUsers[userIndex].walletBalanceUsd || 0

    // Check if user has enough balance
    if (currentBalance < amount) {
      return false
    }

    const newBalance = currentBalance - amount

    // Update balance in registered users
    registeredUsers[userIndex].walletBalanceUsd = newBalance

    // Update current user
    const updatedUser: Account = {
      ...user,
      walletBalanceUsd: newBalance,
    }

    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        addFunds,
        deductFunds,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

