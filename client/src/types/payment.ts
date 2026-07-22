export type OnlinePaymentInterestLevel = 'yes' | 'maybe' | 'no'

export interface PaymentConfig {
  onlinePaymentsEnabled: boolean
  provider: 'stripe' | null
  publishableKey: string | null
}

export interface DepositPaymentResult {
  enabled: boolean
  message?: string
  paymentId?: string
  clientSecret?: string
  amountEur?: number
}

export interface RecordPaymentInterestInput {
  reservationId?: string
  interest: OnlinePaymentInterestLevel
  comment?: string
}

export interface RecordPaymentInterestResult {
  ok: boolean
  interest: OnlinePaymentInterestLevel
}
