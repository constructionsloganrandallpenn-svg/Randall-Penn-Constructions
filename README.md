# Randall-Penn Constructions Website

Standalone website for Randall-Penn Constructions, Sydney.

## Pages
- `/` — Home
- `/projects` — Projects
- `/services` — Services
- `/about` — About
- `/media` — Media
- `/contact` — Contact

The site is static HTML/CSS/JavaScript and is configured for Vercel clean URLs. Project and content placeholders are intentionally highlighted for client review and will be replaced with Randall-Penn photography and confirmed project information as supplied. The ABN is intentionally omitted until Logan confirms whether the website should display the sole-trader or Pty Ltd entity.

## Booking
The Contact page embeds the Randall-Penn 15-minute Calendly consultation event:
`https://calendly.com/constructionsloganrandallpenn/consultation`

## Contact form / Resend
The contact form posts to `/api/contact`, which sends through Resend.

Configure these Vercel Environment Variables before enabling production enquiries:
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` — the mailbox that receives enquiries
- `CONTACT_FROM_EMAIL` — a sender on a domain verified in Resend, e.g. `Randall-Penn Website <website@yourdomain.com>`

No API key or mailbox is hard-coded in the repository. Until all three variables exist, the API returns a friendly message directing visitors to book a consultation.
