import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

interface LandingButtonProps {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

export function LandingButton({ to, children, variant = 'primary', className = '' }: LandingButtonProps) {
  return (
    <Link to={to} className={`landing-btn landing-btn--${variant} ${className}`.trim()}>
      {children}
    </Link>
  )
}

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle: string
  primaryAction?: { label: string; to: string }
  secondaryAction?: { label: string; to: string }
  tone?: 'default' | 'parent' | 'business'
  compact?: boolean
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  tone = 'default',
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`landing-hero landing-hero--${tone} ${compact ? 'landing-hero--compact' : ''}`}>
      <div className="landing-container landing-hero__inner">
        {eyebrow && <span className="landing-hero__eyebrow">{eyebrow}</span>}
        <h1 className="landing-hero__title">{title}</h1>
        <p className="landing-hero__subtitle">{subtitle}</p>
        {(primaryAction || secondaryAction) && (
          <div className="landing-hero__actions">
            {primaryAction && <LandingButton to={primaryAction.to}>{primaryAction.label}</LandingButton>}
            {secondaryAction && (
              <LandingButton to={secondaryAction.to} variant="outline">
                {secondaryAction.label}
              </LandingButton>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

interface HomeHeroProps {
  stats: { value: string; label: string }[]
}

export function HomeHero({ stats }: HomeHeroProps) {
  return (
    <section className="landing-hero landing-hero--home">
      <div className="landing-container landing-hero__grid">
        <div className="landing-hero__content">
          <span className="landing-hero__eyebrow">Platforma za rezervacije</span>
          <h1 className="landing-hero__title">
            Rođendani organizirani <span className="landing-hero__accent">profesionalno</span>
          </h1>
          <p className="landing-hero__subtitle">
            Pronađite igraonicu, usporedite pakete i rezervirajte termin online. Transparentne cijene,
            verificirane recenzije i sigurna akontacija — bez nepotrebnih poziva i nejasnih ponuda.
          </p>
          <div className="landing-hero__actions">
            <LandingButton to="/igraonice">Pregledaj igraonice</LandingButton>
            <LandingButton to="/kako-funkcionira" variant="outline">
              Kako funkcionira
            </LandingButton>
          </div>
          <TrustBar />
        </div>

        <aside className="landing-hero__panel" aria-label="Ključne brojke">
          <StatsBar items={stats} variant="panel" />
        </aside>
      </div>
    </section>
  )
}

export function TrustBar() {
  const items = [
    'Sigurno online plaćanje',
    'Provjereni partneri',
    'Podrška na hrvatskom',
    'Bez skrivenih troškova',
  ]

  return (
    <ul className="landing-trust">
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  variant?: 'default' | 'muted' | 'bordered'
  align?: 'left' | 'center'
}

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  variant = 'default',
  align = 'left',
}: SectionProps) {
  return (
    <section id={id} className={`landing-section landing-section--${variant} landing-section--${align}`}>
      <div className="landing-container">
        <header className="landing-section__header">
          {eyebrow && <span className="landing-section__eyebrow">{eyebrow}</span>}
          <h2 className="landing-section__title">{title}</h2>
          {subtitle && <p className="landing-section__subtitle">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}

interface StatItem {
  value: string
  label: string
}

export function StatsBar({
  items,
  variant = 'inline',
}: {
  items: StatItem[]
  variant?: 'inline' | 'panel'
}) {
  return (
    <div className={`landing-stats landing-stats--${variant}`}>
      {items.map(item => (
        <div key={item.label} className="landing-stats__item">
          <span className="landing-stats__value">{item.value}</span>
          <span className="landing-stats__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

interface StepItem {
  title: string
  text: string
}

export function StepsGrid({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="landing-steps">
      {steps.map((step, index) => (
        <li key={step.title} className="landing-steps__item">
          <span className="landing-steps__num">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="landing-steps__title">{step.title}</h3>
            <p className="landing-steps__text">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

interface FeatureItem {
  title: string
  text: string
  tone?: 'parent' | 'business' | 'neutral'
}

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="landing-features">
      {items.map(item => (
        <article key={item.title} className={`landing-features__card landing-features__card--${item.tone ?? 'neutral'}`}>
          <span className="landing-features__mark" aria-hidden />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  )
}

interface PricingPlanProps {
  name: string
  price: string
  period: string
  tagline?: string
  features: string[]
  cta: { label: string; to: string }
  featured?: boolean
  variant?: 'default' | 'business'
}

export function PricingPlan({
  name,
  price,
  period,
  tagline,
  features,
  cta,
  featured = false,
  variant = 'default',
}: PricingPlanProps) {
  return (
    <article
      className={`landing-pricing__card ${featured ? 'landing-pricing__card--featured' : ''} ${variant === 'business' ? 'landing-pricing__card--business' : ''}`}
    >
      {featured && <span className="landing-pricing__label">Preporučeno</span>}
      <h3>{name}</h3>
      {tagline && <p className="landing-pricing__tagline">{tagline}</p>}
      <p className="landing-pricing__price">{price}</p>
      <p className="landing-pricing__period">{period}</p>
      <ul>
        {features.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <LandingButton to={cta.to} variant={variant === 'business' && featured ? 'primary' : featured ? 'primary' : 'outline'}>
        {cta.label}
      </LandingButton>
    </article>
  )
}

interface FaqItem {
  question: string
  answer: string
}

export function FaqList({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="landing-faq">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className={`landing-faq__item ${isOpen ? 'landing-faq__item--open' : ''}`}>
            <button
              type="button"
              className="landing-faq__question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span className="landing-faq__icon" aria-hidden />
            </button>
            <div className="landing-faq__answer">
              <div className="landing-faq__answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="landing-prose">{children}</div>
}

interface CtaBandProps {
  title: string
  text: string
  primary: { label: string; to: string }
  secondary?: { label: string; to: string }
}

export function CtaBand({ title, text, primary, secondary }: CtaBandProps) {
  return (
    <section className="landing-cta-band">
      <div className="landing-container landing-cta-band__inner">
        <div className="landing-cta-band__copy">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="landing-cta-band__actions">
          <LandingButton to={primary.to}>{primary.label}</LandingButton>
          {secondary && (
            <LandingButton to={secondary.to} variant="outline">
              {secondary.label}
            </LandingButton>
          )}
        </div>
      </div>
    </section>
  )
}
