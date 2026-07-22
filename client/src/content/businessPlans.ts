export interface BusinessPlan {
  id: string
  name: string
  price: string
  period: string
  tagline: string
  features: string[]
  cta: { label: string; to: string }
  featured?: boolean
}

export const businessSubscriptionPlans: BusinessPlan[] = [
  {
    id: 'basic',
    name: 'Osnovna',
    price: '25 €',
    period: 'mjesečno · otkazivo',
    tagline: 'Za manje igraonice koje žele digitalne rezervacije bez kompleksnosti.',
    features: [
      'Javni profil (opis, lokacija, radno vrijeme)',
      'Do 5 fotografija i 3 rođendanska paketa',
      'Kalendar termina i upravljanje rezervacijama',
      'Request booking — vi potvrđujete svaki upit',
      'Email obavijesti o novim rezervacijama',
      'Online akontacije putem platforme',
      'Osnovna statistika (rezervacije, popunjenost)',
    ],
    cta: { label: 'Odaberi Osnovnu', to: '/registracija' },
  },
  {
    id: 'extended',
    name: 'Proširena',
    price: '35 €',
    period: 'mjesečno · otkazivo',
    tagline: 'Najpopularniji izbor — više alata i veća vidljivost u pretrazi.',
    featured: true,
    features: [
      'Sve iz paketa Osnovna',
      'Do 12 fotografija i 6 rođendanskih paketa',
      'Instant booking — automatska potvrda termina',
      'Istaknuti profil u rezultatima pretrage',
      'Pregled prihoda i mjesečni izvještaj',
      'Email podsjetnici gostima prije rođendana',
      'Odgovaranje na recenzije roditelja',
      'Podrška u roku 48 sati',
    ],
    cta: { label: 'Odaberi Proširenu', to: '/registracija' },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '50 €',
    period: 'mjesečno · otkazivo',
    tagline: 'Za veće kapacitete, više prostora ili više termina tjedno.',
    features: [
      'Sve iz paketa Proširena',
      'Neograničene fotografije i paketi',
      'Prioritetno prikazivanje u vašem gradu',
      'Napredna analitika (sezonalnost, konverzija)',
      'Do 2 prostora / lokacije na jednom računu',
      'Export rezervacija i prihoda (CSV)',
      'Dedicirana podrška — odgovor u 24 sata',
      'Jedna promotivna istaknutost mjesečno',
    ],
    cta: { label: 'Odaberi Premium', to: '/registracija' },
  },
]

export const businessPricingFaq = [
  {
    question: 'Zašto pretplata umjesto provizije po rezervaciji?',
    answer:
      'Fiksna mjesečna naknada daje predvidljive troškove — ne gubite postotak od svakog rođendana. Što više rezervacija imate, to vam se pretplata više isplati u odnosu na model provizije.',
  },
  {
    question: 'Mogu li promijeniti paket kasnije?',
    answer:
      'Da. Nadogradnju ili smanjenje paketa možete zatražiti u bilo kojem trenutku; promjena vrijedi od sljedećeg obračunskog razdoblja.',
  },
  {
    question: 'Postoji li ugovorna obveza?',
    answer:
      'Ne. Pretplata je mjesečna i otkaziva — bez godišnje obveze. U ranoj fazi platforme nudimo i probni period za nove partnere.',
  },
  {
    question: 'Što ako imam više od dvije lokacije?',
    answer:
      'Za franšize i više prostora kontaktirajte nas za prilagođeni Enterprise plan — više lokacija, centralni dashboard i posebni uvjeti.',
  },
]
