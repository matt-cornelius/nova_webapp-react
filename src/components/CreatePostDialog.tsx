import { useState } from 'react'
import { X, Image, Tag, DollarSign, FileText, AlertCircle } from 'lucide-react'
import { OrganizationAccount } from '../context/AuthContext'

interface CreatePostDialogProps {
  organization: OrganizationAccount
  onClose: () => void
  onConfirm: (postData: {
    organizationId: string
    organizationName: string
    organizationLogoUrl?: string
    title: string
    description: string
    goalAmount?: number
    imageUrl?: string
    category?: string
    tags: string[]
  }) => void
}

export function CreatePostDialog({
  organization,
  onClose,
  onConfirm,
}: CreatePostDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !description.trim()) {
      setError('Please fill in title and description')
      return
    }

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    onConfirm({
      organizationId: organization.id,
      organizationName: organization.name,
      organizationLogoUrl: organization.logoUrl || undefined,
      title: title.trim(),
      description: description.trim(),
      goalAmount: goalAmount ? parseFloat(goalAmount) : undefined,
      imageUrl: imageUrl.trim() || undefined,
      category: category.trim() || undefined,
      tags: tagsArray,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl text-on-surface">Create Donation Post</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} className="text-on-surface-variant" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Help us build a new community center"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Description *
              </label>
              <div className="relative">
                <FileText
                  size={20}
                  className="absolute left-3 top-3 text-on-surface-variant"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people about your cause and how their donation will help..."
                  rows={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white resize-none"
                  required
                />
              </div>
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Fundraising Goal (Optional)
              </label>
              <div className="relative">
                <DollarSign
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Category (Optional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Education, Health, Environment"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Tags (Optional)
              </label>
              <div className="relative">
                <Tag
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                />
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                Separate tags with commas
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Image URL (Optional)
              </label>
              <div className="relative">
                <Image
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-semibold border-2 border-gray-300 text-on-surface hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

