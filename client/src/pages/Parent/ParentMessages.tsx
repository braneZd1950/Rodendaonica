import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import MessageReadReceipt from '../../components/messages/MessageReadReceipt'
import type { Conversation } from '../../types'

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })
}

function ParentMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    ;(async () => {
      const currentParent = await api.parents.getCurrent()
      if (!currentParent) {
        setLoading(false)
        return
      }

      const data = await api.messages.listByParent(currentParent.id)
      setConversations(data)
      setActiveConversationId(data[0]?.id ?? null)
      setLoading(false)
    })()
  }, [])

  const activeConversation = useMemo(
    () => conversations.find(item => item.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

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
        // ignore
      }
    })()

    return () => {
      cancelled = true
    }
  }, [activeConversationId])

  async function handleSend() {
    if (!activeConversation || !draft.trim() || sending) return

    const text = draft.trim()
    setDraft('')
    setSending(true)

    try {
      const message = await api.messages.sendMessage(activeConversation.id, {
        sender: 'parent',
        text,
        status: 'isporucena',
      })

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                updatedAt: message.sentAt,
                messages: [...conv.messages, message],
              }
            : conv,
        ),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="landing-page">
      <section className="parent-panel">
        <div className="landing-container">
          <div className="parent-panel__header">
            <h1>Poruke</h1>
            <Link to="/rezervacije" className="landing-btn landing-btn--outline">
              Otvori rezervacije
            </Link>
          </div>

          {loading ? (
            <p className="parent-panel__loading">Učitavanje poruka...</p>
          ) : conversations.length === 0 ? (
            <div className="parent-empty">
              <p>Trenutno nemate razgovora s igraonicama.</p>
              <Link to="/igraonice" className="landing-btn landing-btn--primary">
                Pronađi igraonicu
              </Link>
            </div>
          ) : (
            <div className="parent-messenger">
              <aside className="parent-messenger__threads">
                {conversations.map(conv => {
                  const lastMessage = conv.messages[conv.messages.length - 1]
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      className={`parent-messenger__thread ${activeConversationId === conv.id ? 'parent-messenger__thread--active' : ''}`}
                      onClick={() => setActiveConversationId(conv.id)}
                    >
                      <div className="parent-messenger__thread-top">
                        <strong>{conv.venueName}</strong>
                        <span>{formatTime(conv.updatedAt)}</span>
                      </div>
                      <p>{lastMessage?.text ?? 'Nema poruka'}</p>
                      {conv.unreadByParent > 0 && (
                        <span className="parent-messenger__badge">{conv.unreadByParent}</span>
                      )}
                    </button>
                  )
                })}
              </aside>

              <article className="parent-messenger__chat">
                {activeConversation ? (
                  <>
                    <header className="parent-messenger__chat-head">
                      <h2>{activeConversation.venueName}</h2>
                      <Link to={`/igraonice/${activeConversation.venueSlug}`}>Profil igraonice</Link>
                    </header>

                    <div className="parent-messenger__messages">
                      {activeConversation.messages.map(message => (
                        <div
                          key={message.id}
                          className={`parent-messenger__bubble parent-messenger__bubble--${message.sender}`}
                        >
                          <p>{message.text}</p>
                          <div className="parent-messenger__meta">
                            <small>{formatTime(message.sentAt)}</small>
                            {message.sender === 'parent' && (
                              <MessageReadReceipt status={message.status} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="parent-messenger__composer">
                      <input
                        type="text"
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                        placeholder="Napišite poruku igraonici..."
                        onKeyDown={event => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            handleSend()
                          }
                        }}
                      />
                      <button type="button" onClick={handleSend} disabled={!draft.trim() || sending}>
                        {sending ? 'Slanje…' : 'Pošalji'}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="parent-panel__loading">Odaberite razgovor.</p>
                )}
              </article>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ParentMessages
