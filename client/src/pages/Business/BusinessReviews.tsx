import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { EmptyState, PageLoader } from '../../components/common/AsyncState'
import { formatDateHr } from '../../lib/format'
import type { Review } from '../../types'

type ReviewFilter = 'all' | 'pending' | 'answered'

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="biz-reviews__stars" aria-label={`Ocjena ${rating} od ${max}`}>
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          className={`biz-reviews__star ${index < rating ? 'biz-reviews__star--filled' : ''}`}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  )
}

function parentInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function BusinessReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const business = await api.businesses.getCurrent()
      if (!business) {
        setLoading(false)
        return
      }
      const data = await api.reviews.listByBusiness(business.id)
      setReviews(data.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      setLoading(false)
    })()
  }, [])

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0, unanswered: 0 }
    const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const unanswered = reviews.filter(review => !review.ownerReply).length
    return { avg, total: reviews.length, unanswered }
  }, [reviews])

  const filtered = useMemo(() => {
    if (filter === 'pending') return reviews.filter(review => !review.ownerReply)
    if (filter === 'answered') return reviews.filter(review => Boolean(review.ownerReply))
    return reviews
  }, [reviews, filter])

  async function replyToReview(reviewId: string) {
    const text = drafts[reviewId]?.trim()
    if (!text) return

    setSubmittingId(reviewId)
    try {
      const updated = await api.reviews.replyToReview(reviewId, text)
      setReviews(prev => prev.map(review => (review.id === reviewId ? updated : review)))
      setDrafts(prev => ({ ...prev, [reviewId]: '' }))
    } finally {
      setSubmittingId(null)
    }
  }

  if (loading) {
    return (
      <div className="landing-page biz-reviews-page">
        <section className="biz-reviews">
          <div className="landing-container">
            <PageLoader message="Učitavanje recenzija..." />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page biz-reviews-page">
      <section className="biz-reviews">
        <div className="landing-container">
          <header className="biz-reviews__hero">
            <div>
              <p className="biz-reviews__eyebrow">Povratne informacije</p>
              <h1>Recenzije roditelja</h1>
              <p>Pratite ocjene i odgovarajte roditeljima direktno iz upravljačke ploče.</p>
            </div>
            <div className="biz-reviews__score" aria-label={`Prosječna ocjena ${stats.avg.toFixed(1)}`}>
              <strong>{stats.avg.toFixed(1)}</strong>
              <StarRating rating={Math.round(stats.avg)} />
              <span>{stats.total} recenzija</span>
            </div>
          </header>

          <aside className="biz-reviews__policy">
            <span className="biz-reviews__policy-icon" aria-hidden>
              🛡️
            </span>
            <div>
              <strong>Transparentan sustav recenzija</strong>
              <p>
                Recenziju može ostaviti samo roditelj nakon odrađenog i plaćenog termina (pozivnica
                e-mailom/SMS-om). Igraonica može odgovoriti, ali ne može ukloniti recenziju — uklanjanje
                isključivo admin platforme u slučaju kršenja pravila.
              </p>
            </div>
          </aside>

          <div className="biz-reviews__kpis">
            <article className="biz-reviews__kpi">
              <span aria-hidden>⭐</span>
              <div>
                <p>Prosječna ocjena</p>
                <strong>{stats.avg.toFixed(1)}</strong>
              </div>
            </article>
            <article className="biz-reviews__kpi">
              <span aria-hidden>📋</span>
              <div>
                <p>Ukupno recenzija</p>
                <strong>{stats.total}</strong>
              </div>
            </article>
            <article className="biz-reviews__kpi">
              <span aria-hidden>💬</span>
              <div>
                <p>Neodgovorene</p>
                <strong>{stats.unanswered}</strong>
              </div>
            </article>
            <article className="biz-reviews__kpi">
              <span aria-hidden>✓</span>
              <div>
                <p>Stopa odgovora</p>
                <strong>
                  {stats.total ? Math.round(((stats.total - stats.unanswered) / stats.total) * 100) : 0}%
                </strong>
              </div>
            </article>
          </div>

          <div className="biz-reviews__toolbar">
            <div className="biz-reviews__filters" role="tablist" aria-label="Filtri recenzija">
              {(
                [
                  ['all', 'Sve'],
                  ['pending', 'Neodgovorene'],
                  ['answered', 'Odgovoreno'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`biz-reviews__filter ${filter === value ? 'biz-reviews__filter--active' : ''}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  {value === 'pending' && stats.unanswered > 0 && (
                    <span className="biz-reviews__filter-badge">{stats.unanswered}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="⭐"
              title={filter === 'all' ? 'Još nema recenzija' : 'Nema recenzija za odabrani filter'}
              description={
                filter === 'all'
                  ? 'Recenzije se automatski traže od roditelja nakon završenog termina.'
                  : 'Promijenite filter ili odgovorite na postojeće recenzije.'
              }
            />
          ) : (
            <div className="biz-reviews__list">
              {filtered.map(review => (
                <article key={review.id} className="biz-reviews__card">
                  <header className="biz-reviews__card-head">
                    <span className="biz-reviews__avatar" aria-hidden>
                      {parentInitials(review.parentName)}
                    </span>
                    <div className="biz-reviews__card-intro">
                      <div className="biz-reviews__card-top">
                        <strong>{review.parentName}</strong>
                        <time dateTime={review.createdAt}>{formatDateHr(review.createdAt)}</time>
                      </div>
                      <StarRating rating={review.rating} />
                      <span className="biz-reviews__verified">✓ Potvrđen posjet</span>
                    </div>
                    {!review.ownerReply && (
                      <span className="biz-reviews__pending">Čeka odgovor</span>
                    )}
                  </header>

                  <blockquote className="biz-reviews__comment">{review.comment}</blockquote>

                  {review.ownerReply ? (
                    <div className="biz-reviews__reply biz-reviews__reply--done">
                      <p className="biz-reviews__reply-label">Vaš odgovor</p>
                      <p>{review.ownerReply.text}</p>
                      <time dateTime={review.ownerReply.repliedAt}>
                        {formatDateHr(review.ownerReply.repliedAt)}
                      </time>
                    </div>
                  ) : (
                    <div className="biz-reviews__reply">
                      <label htmlFor={`reply-${review.id}`}>Odgovor roditelju</label>
                      <textarea
                        id={`reply-${review.id}`}
                        value={drafts[review.id] ?? ''}
                        onChange={event => setDrafts(prev => ({ ...prev, [review.id]: event.target.value }))}
                        rows={3}
                        placeholder="Zahvalite na povratnoj informaciji i po potrebi objasnite sljedeće korake…"
                      />
                      <button
                        type="button"
                        className="biz-reviews__submit"
                        onClick={() => replyToReview(review.id)}
                        disabled={!drafts[review.id]?.trim() || submittingId === review.id}
                      >
                        {submittingId === review.id ? 'Objavljivanje…' : 'Objavi odgovor'}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BusinessReviews
