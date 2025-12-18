import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, AccountType } from '../context/AuthContext'
import {
  Mail,
  Lock,
  User,
  AtSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Building2,
  Globe,
  MapPin,
  Tag,
  Link as LinkIcon,
  Hash,
} from 'lucide-react'

export function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>('user')
  const [formData, setFormData] = useState({
    // User fields
    fullName: '',
    handle: '',
    bio: '',
    // Organization fields
    name: '',
    tagline: '',
    description: '',
    category: '',
    city: '',
    country: '',
    website: '',
    ein: '',
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const validateForm = (): boolean => {
    if (accountType === 'user') {
      if (!formData.fullName || !formData.handle || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return false
      }

      if (!formData.handle.startsWith('@')) {
        setError('Handle must start with @')
        return false
      }
    } else {
      if (
        !formData.name ||
        !formData.tagline ||
        !formData.description ||
        !formData.category ||
        !formData.city ||
        !formData.country ||
        !formData.email ||
        !formData.password
      ) {
        setError('Please fill in all required fields')
        return false
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const success = await register({
      accountType,
      fullName: formData.fullName,
      handle: formData.handle,
      bio: formData.bio,
      name: formData.name,
      tagline: formData.tagline,
      description: formData.description,
      category: formData.category,
      city: formData.city,
      country: formData.country,
      website: formData.website,
      ein: formData.ein || undefined,
      email: formData.email,
      password: formData.password,
    })

    setIsLoading(false)

    if (success) {
      navigate('/')
    } else {
      setError(
        accountType === 'user'
          ? 'Email or handle already exists. Please try a different one.'
          : 'Email already exists. Please try a different one.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              Create Account
            </h1>
            <p className="text-on-surface-variant">
              Join the community and start making a difference
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-on-surface mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('user')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accountType === 'user'
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User
                  size={24}
                  className={`mx-auto mb-2 ${
                    accountType === 'user' ? 'text-primary-dark' : 'text-on-surface-variant'
                  }`}
                />
                <div
                  className={`font-semibold ${
                    accountType === 'user' ? 'text-primary-dark' : 'text-on-surface'
                  }`}
                >
                  Individual
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('organization')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  accountType === 'organization'
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2
                  size={24}
                  className={`mx-auto mb-2 ${
                    accountType === 'organization'
                      ? 'text-primary-dark'
                      : 'text-on-surface-variant'
                  }`}
                />
                <div
                  className={`font-semibold ${
                    accountType === 'organization'
                      ? 'text-primary-dark'
                      : 'text-on-surface'
                  }`}
                >
                  Organization
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {accountType === 'user' ? (
              <>
                {/* User Registration Fields */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="John Doe"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="handle"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Handle *
                  </label>
                  <div className="relative">
                    <AtSign
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="handle"
                      name="handle"
                      type="text"
                      value={formData.handle}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="@username"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Must start with @
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Bio (Optional)
                  </label>
                  <div className="relative">
                    <FileText
                      size={20}
                      className="absolute left-3 top-3 text-on-surface-variant"
                    />
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white resize-none"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Organization Registration Fields */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Organization Name *
                  </label>
                  <div className="relative">
                    <Building2
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="Organization Name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tagline"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Tagline *
                  </label>
                  <input
                    id="tagline"
                    name="tagline"
                    type="text"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                    placeholder="Short description of your mission"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Description *
                  </label>
                  <div className="relative">
                    <FileText
                      size={20}
                      className="absolute left-3 top-3 text-on-surface-variant"
                    />
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white resize-none"
                      placeholder="Tell us about your organization..."
                      rows={4}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Category *
                  </label>
                  <div className="relative">
                    <Tag
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="e.g., Health, Education, Environment"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-on-surface mb-2"
                    >
                      City *
                    </label>
                    <div className="relative">
                      <MapPin
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                      />
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                        placeholder="City"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-on-surface mb-2"
                    >
                      Country *
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="Country"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <LinkIcon
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="https://example.org"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ein"
                    className="block text-sm font-medium text-on-surface mb-2"
                  >
                    EIN (Optional)
                  </label>
                  <div className="relative">
                    <Hash
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      id="ein"
                      name="ein"
                      type="text"
                      value={formData.ein}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                      placeholder="12-3456789"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Common Fields */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-on-surface mb-2"
              >
                Email *
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-on-surface mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-on-surface mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  required
                />
              </div>
              {formData.password && formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs text-green-600">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-red-600" />
                      <span className="text-xs text-red-600">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-primary-dark"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
