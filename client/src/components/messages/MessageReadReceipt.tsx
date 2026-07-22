import { getReadReceiptLabel } from '../../lib/messageReadReceipt'
import type { MessageDeliveryStatus } from '../../types'

interface MessageReadReceiptProps {
  status?: MessageDeliveryStatus
  variant?: 'default' | 'on-primary'
}

function MessageReadReceipt({ status, variant = 'default' }: MessageReadReceiptProps) {
  const resolved = status ?? 'primljena'
  const label = getReadReceiptLabel(resolved)
  const isDouble = resolved === 'isporucena' || resolved === 'pogledana'

  return (
    <span
      className={`msg-receipt msg-receipt--${resolved} msg-receipt--${variant}`}
      title={label}
      aria-label={label}
    >
      <svg className="msg-receipt__icon" viewBox="0 0 16 11" aria-hidden="true">
        <path d="M1 5.5L4.5 9L8.5 2" />
        {isDouble && <path d="M5 5.5L8.5 9L14.5 2" />}
      </svg>
    </span>
  )
}

export default MessageReadReceipt
