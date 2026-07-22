import { PricingPlan } from './LandingUi'
import { businessPricingFaq, businessSubscriptionPlans } from '../../content/businessPlans'

export function BusinessSubscriptionPricing() {
  return (
    <div className="pricing-business">
      <div className="pricing-business__intro">
        <p className="pricing-business__model">
          Model: <strong>mjesečna pretplata</strong> — bez provizije po rezervaciji
        </p>
        <p className="pricing-business__lead">
          Roditelji i dalje ne plaćaju platformu. Vi birate paket prema veličini i ambicijama poslovanja;
          trošak je fiksan svaki mjesec, bez iznenađenja nakon uspješnog vikenda.
        </p>
      </div>

      <div className="landing-pricing">
        {businessSubscriptionPlans.map(plan => (
          <PricingPlan
            key={plan.id}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            tagline={plan.tagline}
            features={plan.features}
            cta={plan.cta}
            featured={plan.featured}
            variant="business"
          />
        ))}
      </div>

      <p className="pricing-business__footnote">
        Cijene su u eurima, bez PDV-a (PDV se obračunava prema vašem statusu). Prvih 30 dana besplatno
        za partnere koji se registriraju u ranoj fazi platforme.
      </p>
    </div>
  )
}

export function BusinessPricingFaq() {
  return (
    <div className="pricing-parent-faq pricing-parent-faq--business">
      {businessPricingFaq.map(item => (
        <details key={item.question} className="pricing-parent-faq__item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
