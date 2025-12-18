import {
  User,
  Edit,
  Lock,
  Link,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  Mail,
  FileText,
  Heart,
  Building2,
  TrendingUp,
  LogOut,
  DollarSign,
  Users,
  MapPin,
  Tag,
  Link as LinkIcon,
  Wallet,
  Plus,
} from 'lucide-react'
import { MainNavBar } from '../components/MainNavBar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDonations } from '../context/DonationsContext'
import { AddFundsDialog } from '../components/AddFundsDialog'
import { useState } from 'react'

interface ProfileTileProps {
  icon: React.ElementType
  title: string
  subtitle: string
  onClick: () => void
}

function ProfileTile({ icon: Icon, title, subtitle, onClick }: ProfileTileProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
        <Icon className="text-primary-dark" size={20} />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium text-on-surface">{title}</div>
        <div className="text-sm text-on-surface-variant">{subtitle}</div>
      </div>
    </button>
  )
}

interface ProfileStatCardProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

function ProfileStatCard({ icon: Icon, label, value, color }: ProfileStatCardProps) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 border"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <div className="font-bold text-lg" style={{ color }}>
            {value}
          </div>
          <div className="text-xs text-on-surface-variant">{label}</div>
        </div>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout, addFunds } = useAuth()
  const { donations } = useDonations()
  const navigate = useNavigate()
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddFunds = async (amount: number) => {
    return await addFunds(amount)
  }

  if (!user) {
    return null
  }

  const balance = user.walletBalanceUsd || 0

  // Organization profile
  if (user.accountType === 'organization') {
    const orgDonations = donations.filter(
      (d) => d.toOrganizationId === user.id && d.status === 'completed'
    )
    const totalReceived = orgDonations.reduce(
      (sum, d) => sum + d.amountUsd,
      0
    )

    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-primary-dark text-center">
              Profile
            </h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-5 py-6">
          {/* Header Section */}
          <div className="text-center mb-7">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
              {user.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <Building2 className="text-primary-dark" size={36} />
              )}
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              {user.name}
            </h2>
            <p className="text-on-surface-variant mb-2">{user.tagline}</p>
            <p className="text-sm text-on-surface-variant mb-3">{user.email}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-on-surface-variant mb-3">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>
                  {user.city}, {user.country}
                </span>
              </div>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary-dark"
                >
                  <LinkIcon size={16} />
                  <span>Website</span>
                </a>
              )}
            </div>
            <button className="text-on-surface-variant hover:text-primary">
              <Edit size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="bg-surface rounded-xl p-4 border border-gray-200 mb-5">
            <p className="text-on-surface text-sm leading-relaxed">
              {user.description}
            </p>
            {user.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-light text-primary-dark text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Account Balance Card */}
          <div className="bg-gradient-to-br from-primary-light to-primary rounded-xl p-6 mb-5 border border-primary">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/80">Account Balance</div>
                  <div className="text-3xl font-bold text-white">
                    ${balance.toFixed(2)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddFundsDialog(true)}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add Funds
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3 mb-7">
            <ProfileStatCard
              icon={DollarSign}
              label="Total Received"
              value={`$${totalReceived.toFixed(0)}`}
              color="#8B5CF6"
            />
            <ProfileStatCard
              icon={Heart}
              label="Donations"
              value={orgDonations.length.toString()}
              color="#8B5CF6"
            />
            <ProfileStatCard
              icon={Users}
              label="Supporters"
              value={user.supportersCount.toString()}
              color="#8B5CF6"
            />
          </div>

        {/* Primary Actions */}
        <div className="space-y-3 mb-7">
          <button className="w-full bg-primary text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            <Edit size={20} />
            Edit profile
          </button>
          <button className="w-full border-2 border-primary text-primary rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary-light transition-colors">
            <Lock size={20} />
            Change password
          </button>
          <button
            onClick={handleLogout}
            className="w-full border-2 border-error text-error rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>

        {/* Account Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">Account</h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            Manage personal information, security and connected accounts.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={User}
              title="Personal information"
              subtitle="Name, email, phone"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Lock}
              title="Security"
              subtitle="Password, 2‑factor authentication"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Link}
              title="Connected accounts"
              subtitle="Google, Apple, social logins"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">
            Preferences
          </h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            Control how the app behaves and how we talk to you.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={Bell}
              title="Notifications"
              subtitle="Email, push & SMS alerts"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Palette}
              title="Appearance"
              subtitle="Theme, density"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Globe}
              title="Language & region"
              subtitle="Localization settings"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">Support</h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            We are here to help whenever you need us.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={HelpCircle}
              title="Help center"
              subtitle="FAQ and how‑to guides"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Mail}
              title="Contact support"
              subtitle="Email our friendly team"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={FileText}
              title="Terms & privacy"
              subtitle="Legal information"
              onClick={() => {}}
            />
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant mb-6">
          Organization profile
        </p>
      </main>

      <MainNavBar />
      {showAddFundsDialog && (
        <AddFundsDialog
          onClose={() => setShowAddFundsDialog(false)}
          onConfirm={handleAddFunds}
        />
      )}
    </div>
  )
  }

  // User profile (default)
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-primary-dark text-center">
            Profile
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Header Section */}
        <div className="text-center mb-7">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-dark font-bold text-2xl">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">
            {user.fullName}
          </h2>
          <p className="text-on-surface-variant mb-3">{user.handle}</p>
          <p className="text-sm text-on-surface-variant mb-3">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-on-surface-variant mb-3">{user.bio}</p>
          )}
          <button className="text-on-surface-variant hover:text-primary">
            <Edit size={20} />
          </button>
        </div>

        {/* Account Balance Card */}
        <div className="bg-gradient-to-br from-primary-light to-primary rounded-xl p-6 mb-5 border border-primary">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <div className="text-sm text-white/80">Account Balance</div>
                <div className="text-3xl font-bold text-white">
                  ${balance.toFixed(2)}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddFundsDialog(true)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Funds
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mb-7">
          <ProfileStatCard
            icon={Heart}
            label="Donations"
            value="24"
            color="#8B5CF6"
          />
          <ProfileStatCard
            icon={Building2}
            label="Organizations"
            value="6"
            color="#8B5CF6"
          />
          <ProfileStatCard
            icon={TrendingUp}
            label="Impact score"
            value="82"
            color="#8B5CF6"
          />
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 mb-7">
          <button className="w-full bg-primary text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
            <Edit size={20} />
            Edit profile
          </button>
          <button className="w-full border-2 border-primary text-primary rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary-light transition-colors">
            <Lock size={20} />
            Change password
          </button>
          <button
            onClick={handleLogout}
            className="w-full border-2 border-error text-error rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>

        {/* Account Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">Account</h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            Manage personal information, security and connected accounts.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={User}
              title="Personal information"
              subtitle="Name, email, phone"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Lock}
              title="Security"
              subtitle="Password, 2‑factor authentication"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Link}
              title="Connected accounts"
              subtitle="Google, Apple, social logins"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">
            Preferences
          </h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            Control how the app behaves and how we talk to you.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={Bell}
              title="Notifications"
              subtitle="Email, push & SMS alerts"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Palette}
              title="Appearance"
              subtitle="Theme, density"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Globe}
              title="Language & region"
              subtitle="Localization settings"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-surface rounded-xl border border-gray-200 p-5 mb-5">
          <h3 className="font-semibold text-lg text-center mb-2">Support</h3>
          <p className="text-sm text-on-surface-variant text-center mb-4">
            We are here to help whenever you need us.
          </p>
          <div className="space-y-1">
            <ProfileTile
              icon={HelpCircle}
              title="Help center"
              subtitle="FAQ and how‑to guides"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={Mail}
              title="Contact support"
              subtitle="Email our friendly team"
              onClick={() => {}}
            />
            <div className="h-px bg-gray-200 ml-14" />
            <ProfileTile
              icon={FileText}
              title="Terms & privacy"
              subtitle="Legal information"
              onClick={() => {}}
            />
          </div>
        </div>

        <p className="text-center text-sm text-on-surface-variant mb-6">
          User profile
        </p>
      </main>

      <MainNavBar />
      {showAddFundsDialog && (
        <AddFundsDialog
          onClose={() => setShowAddFundsDialog(false)}
          onConfirm={handleAddFunds}
        />
      )}
    </div>
  )
}

