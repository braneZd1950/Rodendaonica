import { env } from '../../config/env'

function DevModeBanner() {
  if (!env.isDev || !env.isMock) return null

  return (
    <div className="dev-banner" role="status">
      <strong>Development</strong>
      <span>API mod: mock · podaci iz localStorage</span>
    </div>
  )
}

export default DevModeBanner
