import {
  BusinessPricingFaq,
  BusinessSubscriptionPricing,
} from '../../components/landing/BusinessPricing'
import {
  BusinessPricingTeaser,
  ParentPricingFaq,
  ParentPricingOverview,
} from '../../components/landing/ParentPricing'
import { CtaBand, PageHero, Section } from '../../components/landing/LandingUi'

function Pricing() {
  return (
    <div className="landing-page landing-page--pricing">
      <PageHero
        tone="parent"
        eyebrow="Cijene za roditelje"
        title="Jasne cijene, bez iznenađenja"
        subtitle="Korištenje Rođendaonice je besplatno. Plaćate isključivo paket rođendana u odabranoj igraonici — s transparentnom akontacijom prije potvrde termina."
        primaryAction={{ label: 'Kreiraj besplatni račun', to: '/registracija' }}
        secondaryAction={{ label: 'Pregledaj igraonice', to: '/igraonice' }}
      />

      <Section
        variant="muted"
        align="center"
        eyebrow="Transparentnost"
        title="Kako funkcionira model za roditelje"
        subtitle="Sve što trebate znati prije prve rezervacije — jednostavno i bez skrivenih naknada platforme."
      >
        <ParentPricingOverview />
      </Section>

      <Section
        eyebrow="Pitanja"
        title="Česta pitanja o cijenama i plaćanju"
        subtitle="Odgovori na najčešće nedoumice roditelja prije rezervacije."
      >
        <ParentPricingFaq />
      </Section>

      <Section
        id="partneri"
        variant="bordered"
        eyebrow="Partneri"
        title="Pretplata za igraonice"
        subtitle="Fiksna mjesečna naknada — bez postotka od svake rezervacije. Odaberite paket prema veličini i potrebama vašeg prostora."
      >
        <BusinessSubscriptionPricing />
        <BusinessPricingFaq />
        <BusinessPricingTeaser />
      </Section>

      <CtaBand
        title="Spremni organizirati rođendan?"
        text="Besplatna registracija. Pronađite igraonicu, usporedite pakete i rezervirajte termin u nekoliko koraka."
        primary={{ label: 'Rezerviraj termin', to: '/rezerviraj' }}
        secondary={{ label: 'Pregled igraonica', to: '/igraonice' }}
      />
    </div>
  )
}

export default Pricing
