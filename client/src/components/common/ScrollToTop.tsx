import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToHashElement(hash: string) {
  const id = hash.replace(/^#/, '')
  if (!id) return false

  const el = document.getElementById(id)
  if (!el) return false

  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    let attempts = 0
    const maxAttempts = 12

    const tryScroll = () => {
      if (scrollToHashElement(hash)) return
      if (attempts++ < maxAttempts) {
        requestAnimationFrame(tryScroll)
      }
    }

    tryScroll()
  }, [pathname, hash])

  return null
}

export default ScrollToTop
