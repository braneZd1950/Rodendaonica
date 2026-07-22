import type {
  DepositPaymentResult,
  PaymentConfig,
  RecordPaymentInterestInput,
  RecordPaymentInterestResult,
} from '../../types'

export interface PaymentsApi {
  getConfig(): Promise<PaymentConfig>
  createDeposit(bookingId: string): Promise<DepositPaymentResult>
  recordInterest(input: RecordPaymentInterestInput): Promise<RecordPaymentInterestResult>
}
