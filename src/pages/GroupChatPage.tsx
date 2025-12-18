import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Send, Plus, DollarSign } from 'lucide-react'
import { GroupDonationDialog } from '../components/GroupDonationDialog'
import { demoOrganizations } from '../demo-data/organizations'
import { useAuth } from '../context/AuthContext'
import { useDonations } from '../context/DonationsContext'

interface ChatMessage {
  sender: string
  text: string
  isMe: boolean
}

const initialMessages: ChatMessage[] = [
  {
    sender: 'Alex',
    text: 'Hey team, how much should we donate this month?',
    isMe: false,
  },
  { sender: 'Jordan', text: 'Maybe $20 each?', isMe: false },
  { sender: 'You', text: "I'm in for $25 🙌", isMe: true },
  {
    sender: 'Taylor',
    text: "Love it. Let's send to Clean Water Now again.",
    isMe: false,
  },
]

export function GroupChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, deductFunds } = useAuth()
  const { addDonation } = useDonations()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [showDonationDialog, setShowDonationDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const locationState = location.state as { groupName?: string; organizationId?: string } || {}
  const groupName = locationState.groupName || 'Group'
  const organizationId = locationState.organizationId || ''
  const organization = demoOrganizations.find(org => org.id === organizationId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = inputText.trim()
    if (!trimmed) return

    setMessages([...messages, { sender: 'You', text: trimmed, isMe: true }])
    setInputText('')
  }

  const handleDonate = async (amount: number): Promise<boolean> => {
    if (!user || user.accountType !== 'user' || !organization) {
      return false
    }

    // Deduct from user's wallet
    const success = await deductFunds(amount)
    if (success) {
      // Create a donation record for the Home feed
      addDonation({
        fromIndividualId: user.id,
        toOrganizationId: organization.id,
        amountUsd: amount,
        message: `Donated from ${groupName}`,
        emoji: '❤️',
        isPublic: true,
        isRecurringMonthly: false,
        status: 'completed',
        fundingSource: user.defaultFundingSource || 'wallet',
        campaignName: `${groupName} Group Donation`,
      })

      // Add a message to the chat about the donation
      setMessages([
        ...messages,
        {
          sender: 'You',
          text: `Just donated $${amount.toFixed(2)} to ${organization.name}! 🎉`,
          isMe: true,
        },
      ])

      return true
    }
    return false
  }

  return (
    <div className="min-h-screen bg-surface-variant/50 flex flex-col">
      {/* Header */}
      <header className="bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-on-surface">
              ←
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-primary-dark font-bold">
                {groupName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-on-surface">{groupName}</div>
              <div className="text-xs text-on-surface-variant">
                Group chat • Giving circle
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 max-w-2xl mx-auto w-full">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isMe && (
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs font-bold text-on-surface-variant">
                    {message.sender.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="max-w-[70%]">
                {!message.isMe && (
                  <div className="text-xs font-semibold text-on-surface-variant mb-1 px-2">
                    {message.sender}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 ${
                    message.isMe
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-surface text-on-surface rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-surface border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-3 py-3">
          <div className="flex items-center gap-2">
            <button className="text-on-surface-variant hover:text-primary p-2">
              <Plus size={24} />
            </button>
            {organization && user?.accountType === 'user' && (
              <button
                onClick={() => setShowDonationDialog(true)}
                className="text-primary hover:text-primary-dark p-2"
                title={`Donate to ${organization.name}`}
              >
                <DollarSign size={24} />
              </button>
            )}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message"
              className="flex-1 bg-surface-variant rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="text-primary hover:text-primary-dark p-2"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Donation Dialog */}
      {showDonationDialog && organization && (
        <GroupDonationDialog
          organization={organization}
          groupName={groupName}
          onClose={() => setShowDonationDialog(false)}
          onConfirm={handleDonate}
        />
      )}
    </div>
  )
}

