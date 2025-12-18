import axios from 'axios'
import { Organization } from '../demo-data/organizations'

export interface DonationRequest {
  organization: Organization
  amount: number
  email: string
}

export interface DonationResponse {
  success: boolean
  message?: string
  donationId?: string
  error?: string
}

const N8N_BASE_URL = 'https://matt-cornelius.app.n8n.cloud'
const N8N_WEBHOOK_PATH = '/webhook-test/01f63d59-ebc8-4886-9770-6924e17002be'

export async function submitDonation(
  request: DonationRequest
): Promise<DonationResponse> {
  try {
    const payload = {
      organization_id: request.organization.id,
      organization_name: request.organization.name,
      amount_usd: request.amount,
      email: request.email,
      organization_category: request.organization.category,
    }

    const response = await axios.post(
      `${N8N_BASE_URL}${N8N_WEBHOOK_PATH}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    if (response.status >= 200 && response.status < 300) {
      return {
        success: response.data.success ?? true,
        message: response.data.message,
        donationId: response.data.donation_id ?? response.data.donationId,
      }
    } else {
      throw new Error(
        response.data.error ||
          response.data.message ||
          `Server returned status ${response.status}`
      )
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data?.error ||
            error.response.data?.message ||
            `Server error: ${error.response.status}`
        )
      } else if (error.request) {
        throw new Error('Network error: Could not reach server')
      }
    }
    throw error
  }
}

