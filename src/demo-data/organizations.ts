export interface Organization {
  id: string
  name: string
  tagline: string
  description: string
  category: string
  city: string
  country: string
  logoUrl: string
  website: string
  ein?: string
  totalReceivedUsd: number
  supportersCount: number
  isVerified: boolean
  tags: string[]
}

export const demoOrganizations: Organization[] = [
  {
    id: 'org_clean_water',
    name: 'Clean Water Now',
    tagline: 'Bringing safe drinking water to every village.',
    description:
      'Clean Water Now builds and maintains community‑owned wells in ' +
      'rural areas with limited access to safe drinking water. They also ' +
      'train local teams to maintain the infrastructure long term.',
    category: 'Health',
    city: 'Kampala',
    country: 'Uganda',
    logoUrl:
      'https://images.pexels.com/photos/4618245/pexels-photo-4618245.jpeg',
    website: 'https://example.org/clean-water',
    ein: '12-3456789',
    totalReceivedUsd: 128_500.00,
    supportersCount: 2143,
    isVerified: true,
    tags: ['water', 'sanitation', 'africa', 'health'],
  },
  {
    id: 'org_coding_kids',
    name: 'Code For Kids',
    tagline: 'Teaching the next generation to code.',
    description:
      'Code For Kids runs after‑school coding clubs in under‑resourced ' +
      'schools, providing laptops, mentors, and project‑based curricula.',
    category: 'Education',
    city: 'Oakland',
    country: 'United States',
    logoUrl:
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    website: 'https://example.org/code-for-kids',
    ein: '98-7654321',
    totalReceivedUsd: 245_230.50,
    supportersCount: 3891,
    isVerified: true,
    tags: ['education', 'youth', 'technology', 'coding'],
  },
  {
    id: 'org_tree_alliance',
    name: 'Urban Tree Alliance',
    tagline: 'Greening cities one tree at a time.',
    description:
      'Urban Tree Alliance plants and cares for trees in low‑canopy ' +
      'neighborhoods, helping reduce heat islands and improve air quality.',
    category: 'Environment',
    city: 'São Paulo',
    country: 'Brazil',
    logoUrl:
      'https://images.pexels.com/photos/1131407/pexels-photo-1131407.jpeg',
    website: 'https://example.org/urban-tree-alliance',
    ein: undefined,
    totalReceivedUsd: 76_910.75,
    supportersCount: 1540,
    isVerified: false,
    tags: ['trees', 'climate', 'urban', 'latam'],
  },
  {
    id: 'org_emergency_relief',
    name: 'Rapid Relief Fund',
    tagline: 'Fast support when disasters strike.',
    description:
      'Rapid Relief Fund coordinates emergency food, shelter, and cash ' +
      'assistance for families affected by natural disasters around the world.',
    category: 'Emergency Relief',
    city: 'Geneva',
    country: 'Switzerland',
    logoUrl:
      'https://images.pexels.com/photos/6646912/pexels-photo-6646912.jpeg',
    website: 'https://example.org/rapid-relief',
    ein: '55-0011223',
    totalReceivedUsd: 512_340.10,
    supportersCount: 8023,
    isVerified: true,
    tags: ['disaster response', 'food', 'cash assistance', 'global'],
  },
]

