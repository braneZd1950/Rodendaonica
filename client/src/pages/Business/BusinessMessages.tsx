import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../api'
import { EmptyState, PageLoader } from '../../components/common/AsyncState'
import MessageReadReceipt from '../../components/messages/MessageReadReceipt'
import { ROUTES } from '../../constants/routes'
import { unreadMessagesFromSender } from '../../lib/messageReadReceipt'
import type { Conversation, ParentUser } from '../../types'
function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
}

function formatDayLabel(value: string) {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Danas'
  if (date.toDateString() === yesterday.toDateString()) return 'Jučer'

  return date.toLocaleDateString('hr-HR', { day: 'numeric', month: 'short' })
}

function parentName(parent: ParentUser | null | undefined) {
  if (!parent) return 'Roditelj'
  return `${parent.firstName} ${parent.lastName}`.trim()
}

function parentInitials(parent: ParentUser | null | undefined) {
  if (!parent) return '?'
  return `${parent.firstName[0] ?? ''}${parent.lastName[0] ?? ''}`.toUpperCase()
}

function previewText(text: string, max = 80) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max).trim()}…`
}

function unreadFromParent(conversation: Conversation) {
  return unreadMessagesFromSender(conversation.messages, 'parent')
}
function BusinessMessages() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [parentById, setParentById] = useState<Record<string, ParentUser | null>>({})
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const business = await api.businesses.getCurrent()
      if (!business) {
        setLoading(false)
        return
      }

      const data = await api.messages.listByBusiness(business.id)
      setConversations(data)
      setActiveConversationId(data[0]?.id ?? null)

      const parentIds = [...new Set(data.map(conversation => conversation.parentId))]
      const entries = await Promise.all(
        parentIds.map(async parentId => {
          const parent = await api.parents.getById(parentId)
          return [parentId, parent] as const
        }),
      )
      setParentById(Object.fromEntries(entries))
      setLoading(false)
    })()
  }, [])

  const activeConversation = useMemo(
    () => conversations.find(conversation => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId],
  )

  const activeParent = activeConversation ? parentById[activeConversation.parentId] : null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages.length, activeConversationId])

  useEffect(() => {
    if (!activeConversationId) return

    let cancelled = false

    ;(async () => {
      try {
        const updated = await api.messages.markConversationRead(activeConversationId)
        if (!cancelled) {
          setConversations(prev => prev.map(conv => (conv.id === updated.id ? updated : conv)))
        }
      } catch {
        // Razgovor možda još nije učitan — ignoriramo
      }
    })()

    return () => {
      cancelled = true
    }
  }, [activeConversationId])

  async function handleSend() {    if (!activeConversation || !draft.trim() || sending) return

    const text = draft.trim()
    setDraft('')
    setSending(true)

    try {
      const message = await api.messages.sendMessage(activeConversation.id, {
        sender: 'business',
        text,
        status: 'isporucena',
      })
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { ...conv, updatedAt: message.sentAt, messages: [...conv.messages, message], unreadByParent: 1 }
            : conv,
        ),
      )
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="landing-page biz-msg-page">
        <section className="biz-msg">
          <div className="landing-container">
            <PageLoader message="Učitavanje poruka..." />
          </div>
        </section>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="landing-page biz-msg-page">
        <section className="biz-msg">
          <div className="landing-container">
            <header className="biz-msg__hero">
              <div>
                <p className="biz-msg__eyebrow">Komunikacija</p>
                <h1>Poruke s roditeljima</h1>
                <p>Brza komunikacija oko termina, dodataka i posebnih zahtjeva. Kvačice ✓✓ pokazuju je li poruka pročitana.</p>
              </div>
            </header>
            <EmptyState
              icon="💬"
              title="Još nema poruka"
              description="Kad roditelji pošalju upit ili poruku, razgovori će se pojaviti ovdje."
              action={{ label: 'Pregled rezervacija', to: ROUTES.business.reservations }}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page biz-msg-page">
      <section className="biz-msg">
        <div className="landing-container">
          <header className="biz-msg__hero">
            <div>
              <p className="biz-msg__eyebrow">Komunikacija</p>
              <h1>Poruke s roditeljima</h1>
              <p>Brza komunikacija oko termina, dodataka i posebnih zahtjeva. Kvačice ✓✓ pokazuju je li poruka pročitana.</p>
            </div>
            <div className="biz-msg__hero-stat">
              <strong>{conversations.length}</strong>
              <span>{conversations.length === 1 ? 'aktivan razgovor' : 'aktivna razgovora'}</span>
            </div>
          </header>

          <div className="biz-msg__layout">
            <aside className="biz-msg__sidebar">
              <p className="biz-msg__sidebar-label">Razgovori</p>
              <div className="biz-msg__threads">
                {conversations.map(conversation => {
                  const lastMessage = conversation.messages[conversation.messages.length - 1]
                  const parent = parentById[conversation.parentId]
                  const unread = unreadFromParent(conversation)
                  const isActive = activeConversationId === conversation.id

                  return (
                    <button
                      type="button"
                      key={conversation.id}
                      className={`biz-msg__thread ${isActive ? 'biz-msg__thread--active' : ''}`}
                      onClick={() => setActiveConversationId(conversation.id)}
                    >
                      <span className="biz-msg__avatar" aria-hidden>
                        {parentInitials(parent)}
                      </span>
                      <span className="biz-msg__thread-body">
                        <span className="biz-msg__thread-top">
                          <strong>{parentName(parent)}</strong>
                          <time dateTime={conversation.updatedAt}>
                            {formatDayLabel(conversation.updatedAt)}
                          </time>
                        </span>
                        <span className="biz-msg__thread-venue">{conversation.venueName}</span>
                        <span className="biz-msg__thread-preview">
                          {lastMessage
                            ? `${lastMessage.sender === 'business' ? 'Vi: ' : ''}${previewText(lastMessage.text)}`
                            : 'Nema poruka'}
                        </span>
                      </span>
                      {unread > 0 && <span className="biz-msg__badge">{unread}</span>}
                    </button>
                  )
                })}
              </div>
            </aside>

            <article className="biz-msg__chat">
              {activeConversation ? (
                <>
                  <header className="biz-msg__chat-head">
                    <span className="biz-msg__avatar biz-msg__avatar--lg" aria-hidden>
                      {parentInitials(activeParent)}
                    </span>
                    <div className="biz-msg__chat-intro">
                      <h2>{parentName(activeParent)}</h2>
                      <p>
                        {activeConversation.venueName}
                        {activeParent?.phone && (
                          <>
                            {' · '}
                            <a href={`tel:${activeParent.phone.replace(/\s/g, '')}`}>{activeParent.phone}</a>
                          </>
                        )}
                        {activeParent?.email && (
                          <>
                            {' · '}
                            <a href={`mailto:${activeParent.email}`}>{activeParent.email}</a>
                          </>
                        )}
                      </p>
                    </div>
                  </header>

                  <div className="biz-msg__messages" role="log" aria-live="polite" aria-relevant="additions">
                    {activeConversation.messages.map(message => (
                      <div
                        key={message.id}
                        className={`biz-msg__bubble biz-msg__bubble--${message.sender}`}
                      >
                        <p>{message.text}</p>
                        <footer className="biz-msg__bubble-meta">
                          <time dateTime={message.sentAt}>{formatTime(message.sentAt)}</time>
                          {message.sender === 'business' && (
                            <MessageReadReceipt
                              status={message.status}
                              variant="on-primary"
                            />
                          )}
                        </footer>                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="biz-msg__composer">
                    <label className="visually-hidden" htmlFor="biz-msg-input">
                      Odgovor roditelju
                    </label>
                    <textarea
                      id="biz-msg-input"
                      rows={1}
                      value={draft}
                      onChange={event => setDraft(event.target.value)}
                      placeholder="Napišite odgovor roditelju…"
                      onKeyDown={event => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="biz-msg__send"
                      onClick={handleSend}
                      disabled={!draft.trim() || sending}
                    >
                      {sending ? 'Slanje…' : 'Pošalji'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="biz-msg__chat-empty">
                  <span className="biz-msg__chat-empty-icon" aria-hidden>
                    💬
                  </span>
                  <p>Odaberite razgovor s lijeve strane.</p>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BusinessMessages
