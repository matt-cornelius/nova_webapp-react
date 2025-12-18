import { Organization } from './organizations'

export interface IndividualAccount {
  id: string
  fullName: string
  handle: string
  avatarUrl: string
  email: string
  joinedAt: Date
  bio: string
  defaultFundingSource: string
  walletBalanceUsd: number
  totalDonatedUsd: number
}

export interface Donation {
  id: string
  fromIndividualId: string
  toOrganizationId: string
  amountUsd: number
  createdAt: Date
  message: string
  emoji?: string
  isPublic: boolean
  isRecurringMonthly: boolean
  status: string
  fundingSource: string
  campaignName?: string
}

export const demoIndividuals: IndividualAccount[] = [
  {
    id: 'user_sam',
    fullName: 'Sam Patel',
    handle: '@sam_donates',
    avatarUrl:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    email: 'sam.patel@example.com',
    joinedAt: new Date(2024, 2, 12),
    bio: 'Trying to give a little every month ✨',
    defaultFundingSource: 'card_visa_4242',
    walletBalanceUsd: 35.75,
    totalDonatedUsd: 420.00,
  },
  {
    id: 'user_amy',
    fullName: 'Amy Chen',
    handle: '@amy_helps',
    avatarUrl:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    email: 'amy.chen@example.com',
    joinedAt: new Date(2023, 10, 5),
    bio: 'Big fan of education + climate projects.',
    defaultFundingSource: 'bank_ach_ending_0011',
    walletBalanceUsd: 120.00,
    totalDonatedUsd: 980.50,
  },
  {
    id: 'user_luis',
    fullName: 'Luis García',
    handle: '@luis_gives',
    avatarUrl:
      'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
    email: 'luis.garcia@example.com',
    joinedAt: new Date(2024, 5, 21),
    bio: 'Monthly donor to water + disaster relief orgs.',
    defaultFundingSource: 'apple_pay',
    walletBalanceUsd: 0.0,
    totalDonatedUsd: 220.25,
  },
]

export const demoDonations: Donation[] = [
  {
    id: 'don_001',
    fromIndividualId: 'user_sam',
    toOrganizationId: 'org_clean_water',
    amountUsd: 25.00,
    createdAt: new Date(2024, 9, 5, 14, 30),
    message: 'For new wells in rural villages 💧',
    emoji: '💧',
    isPublic: true,
    isRecurringMonthly: true,
    status: 'completed',
    fundingSource: 'card_visa_4242',
    campaignName: 'October Clean Water Drive',
  },
  {
    id: 'don_002',
    fromIndividualId: 'user_amy',
    toOrganizationId: 'org_coding_kids',
    amountUsd: 50.00,
    createdAt: new Date(2024, 9, 6, 9, 15),
    message: 'For more laptops in Oakland schools 💻',
    emoji: '💻',
    isPublic: true,
    isRecurringMonthly: false,
    status: 'completed',
    fundingSource: 'bank_ach_ending_0011',
    campaignName: 'Back‑To‑School Kits',
  },
  {
    id: 'don_003',
    fromIndividualId: 'user_luis',
    toOrganizationId: 'org_emergency_relief',
    amountUsd: 75.50,
    createdAt: new Date(2024, 9, 7, 18, 45),
    message: 'Sending support after the recent floods.',
    emoji: '🤝',
    isPublic: true,
    isRecurringMonthly: false,
    status: 'completed',
    fundingSource: 'apple_pay',
    campaignName: 'Flood Relief 2024',
  },
  {
    id: 'don_004',
    fromIndividualId: 'user_amy',
    toOrganizationId: 'org_tree_alliance',
    amountUsd: 10.00,
    createdAt: new Date(2024, 9, 8, 8, 5),
    message: 'A little something for more trees in the city 🌳',
    emoji: '🌳',
    isPublic: false,
    isRecurringMonthly: true,
    status: 'pending',
    fundingSource: 'bank_ach_ending_0011',
    campaignName: undefined,
  },
  {
    id: 'don_005',
    fromIndividualId: 'user_sam',
    toOrganizationId: 'org_coding_kids',
    amountUsd: 5.00,
    createdAt: new Date(2024, 9, 8, 20, 10),
    message: 'Keep inspiring the next generation!',
    emoji: '🚀',
    isPublic: true,
    isRecurringMonthly: false,
    status: 'completed',
    fundingSource: 'card_visa_4242',
    campaignName: undefined,
  },
]

// Helper functions to look up related data
export function getDonor(donation: Donation): IndividualAccount | undefined {
  return demoIndividuals.find((user) => user.id === donation.fromIndividualId)
}

export function getOrganization(
  donation: Donation,
  organizations: Organization[]
): Organization | undefined {
  return organizations.find((org) => org.id === donation.toOrganizationId)
}

