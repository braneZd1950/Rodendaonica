function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="hr">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px">
  <div style="border-bottom:2px solid #7c3aed;padding-bottom:12px;margin-bottom:24px">
    <strong style="font-size:18px">Rođendaonica</strong>
  </div>
  ${body}
  <p style="margin-top:32px;font-size:12px;color:#666">Ova poruka je automatska. Ne odgovarajte na nju.</p>
</body>
</html>`
}

export function passwordResetEmail(resetUrl: string) {
  const subject = 'Reset lozinke — Rođendaonica'
  const text = `Zatražili ste reset lozinke.\n\nOtvorite link (vrijedi 1 sat):\n${resetUrl}\n\nAko niste zatražili reset, zanemarite ovu poruku.`
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Reset lozinke</h1>
     <p>Zatražili ste promjenu lozinke za svoj račun na Rođendaonici.</p>
     <p><a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Postavi novu lozinku</a></p>
     <p style="font-size:14px;color:#555">Link vrijedi 1 sat. Ako gumb ne radi, kopirajte URL:<br><span style="word-break:break-all">${resetUrl}</span></p>`,
  )
  return { subject, text, html }
}

export function bookingReceivedParentEmail(input: {
  parentName: string
  venueName: string
  childName: string
  date: string
  time: string
  packageName: string
  totalPriceEur: number
  depositEur: number
  reservationsUrl: string
}) {
  const subject = `Upit za rezervaciju — ${input.venueName}`
  const text = `Pozdrav ${input.parentName},

primili smo vaš upit za rođendan u ${input.venueName}.

Dijete: ${input.childName}
Datum: ${input.date} u ${input.time}
Paket: ${input.packageName}
Ukupno: ${input.totalPriceEur} € (akontacija ${input.depositEur} €)

Igraonica će vam uskoro potvrditi termin. Status pratite ovdje:
${input.reservationsUrl}`
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Upit je poslan</h1>
     <p>Pozdrav ${input.parentName}, primili smo vaš upit za <strong>${input.venueName}</strong>.</p>
     <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0">
       <tr><td style="padding:6px 0;color:#666">Dijete</td><td><strong>${input.childName}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#666">Termin</td><td>${input.date} u ${input.time}</td></tr>
       <tr><td style="padding:6px 0;color:#666">Paket</td><td>${input.packageName}</td></tr>
       <tr><td style="padding:6px 0;color:#666">Ukupno</td><td>${input.totalPriceEur} €</td></tr>
       <tr><td style="padding:6px 0;color:#666">Akontacija</td><td>${input.depositEur} €</td></tr>
     </table>
     <p><a href="${input.reservationsUrl}" style="color:#7c3aed">Pregledaj rezervacije</a></p>`,
  )
  return { subject, text, html }
}

export function bookingReceivedBusinessEmail(input: {
  companyName: string
  venueName: string
  childName: string
  date: string
  time: string
  packageName: string
  guestCount: number
  totalPriceEur: number
  notes?: string
  reservationsUrl: string
}) {
  const subject = `Nova rezervacija — ${input.venueName}`
  const notesLine = input.notes ? `\nNapomena: ${input.notes}` : ''
  const text = `Pozdrav ${input.companyName},

nova rezervacija čeka vašu potvrdu.

Lokacija: ${input.venueName}
Dijete: ${input.childName}
Datum: ${input.date} u ${input.time}
Gosti: ${input.guestCount}
Paket: ${input.packageName}
Ukupno: ${input.totalPriceEur} €${notesLine}

Otvorite rezervacije:
${input.reservationsUrl}`
  const html = layout(
    subject,
    `<h1 style="font-size:20px;margin:0 0 16px">Nova rezervacija</h1>
     <p>Pozdrav ${input.companyName}, roditelj je poslao upit za <strong>${input.venueName}</strong>.</p>
     <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0">
       <tr><td style="padding:6px 0;color:#666">Dijete</td><td><strong>${input.childName}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#666">Termin</td><td>${input.date} u ${input.time}</td></tr>
       <tr><td style="padding:6px 0;color:#666">Gosti</td><td>${input.guestCount}</td></tr>
       <tr><td style="padding:6px 0;color:#666">Paket</td><td>${input.packageName}</td></tr>
       <tr><td style="padding:6px 0;color:#666">Ukupno</td><td>${input.totalPriceEur} €</td></tr>
       ${input.notes ? `<tr><td style="padding:6px 0;color:#666">Napomena</td><td>${input.notes}</td></tr>` : ''}
     </table>
     <p><a href="${input.reservationsUrl}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Otvori rezervacije</a></p>`,
  )
  return { subject, text, html }
}
