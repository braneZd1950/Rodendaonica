import type { ReservationStatus } from '../types'

const reservationStatusLabels: Record<ReservationStatus, string> = {
  draft: 'Nacrt',
  pending_payment: 'Čeka uplatu',
  confirmed: 'Potvrđeno',
  completed: 'Završeno',
  cancelled: 'Otkazano',
}

export function formatReservationStatus(
  status: ReservationStatus,
  options?: { onlinePaymentsEnabled?: boolean },
) {
  if (status === 'pending_payment' && options?.onlinePaymentsEnabled === false) {
    return 'Čeka potvrdu'
  }
  return reservationStatusLabels[status] ?? status
}

export function formatDateHr(value: string) {
  return new Date(value).toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTimeHr(value: string) {
  return new Date(value).toLocaleString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTimeHr(value: string) {
  return new Date(value).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
}

export function formatCurrencyEur(amount: number) {
  return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatPlanTier(plan: string) {
  const labels: Record<string, string> = {
    osnovna: 'Osnovna',
    prosirena: 'Proširena',
    premium: 'Premium',
  }
  return labels[plan] ?? plan
}
