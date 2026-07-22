import type {
  DepositPaymentResult,
  OnlinePaymentInterestLevel,
  PaymentConfig,
  RecordPaymentInterestInput,
  RecordPaymentInterestResult,
} from '../../types'

const INTEREST_KEY = 'rodendaonica_mock_payment_interest_v1'

const DEFAULT_CONFIG: PaymentConfig = {
  onlinePaymentsEnabled: false,
  provider: null,
  publishableKey: null,
}

function loadInterest(): Record<string, OnlinePaymentInterestLevel> {
  const raw = localStorage.getItem(INTEREST_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, OnlinePaymentInterestLevel>
  } catch {
    return {}
  }
}

function saveInterest(map: Record<string, OnlinePaymentInterestLevel>) {
  localStorage.setItem(INTEREST_KEY, JSON.stringify(map))
}

function interestKey(parentId: string, reservationId?: string) {
  return reservationId ? `${parentId}:${reservationId}` : `${parentId}:general`
}

export const mockPaymentsStore = {
  getConfig(): PaymentConfig {
    return { ...DEFAULT_CONFIG }
  },

  async createDeposit(_bookingId: string): Promise<DepositPaymentResult> {
    return {
      enabled: false,
      message:
        'Online plaćanje trenutno nije aktivirano. Igraonica će potvrditi termin i dogovoriti uplatu akontacije izravno s vama.',
    }
  },

  async recordInterest(
    parentId: string,
    input: RecordPaymentInterestInput,
  ): Promise<RecordPaymentInterestResult> {
    const map = loadInterest()
    map[interestKey(parentId, input.reservationId)] = input.interest
    saveInterest(map)
    console.log('[mock] payment interest recorded:', input)
    return { ok: true, interest: input.interest }
  },

  getRecordedInterest(parentId: string, reservationId?: string): OnlinePaymentInterestLevel | null {
    const map = loadInterest()
    return map[interestKey(parentId, reservationId)] ?? null
  },
}
