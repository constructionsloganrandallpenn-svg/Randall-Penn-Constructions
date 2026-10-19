# 2026-10-19 Calendly + Resend Integration

- Corrected the Calendly consultation duration to 15 minutes.
- Kept the inline Calendly consultation embed on the Contact page.
- Added `/api/contact` as a Vercel serverless endpoint for Resend.
- Wired the existing contact form to the API with loading, success and error states.
- Added a honeypot field for basic bot filtering.
- Kept recipient, sender and Resend API key out of the repository via Vercel environment variables.
- If Resend is not configured yet, visitors are directed to the consultation booking option.

# 2026-10-15 Client Presentation Revision

- Reframed unfinished content as clear client-facing placeholders instead of internal production notes.
- Added highlighted review notes for project photography, project details, services, About content, Media assets and testimonials.
- Marked homepage and Services concept imagery clearly as placeholders.
- Removed wording that sounded like an internal conversation about approvals, attribution, or content gathering.
- Kept the existing site structure, navigation, animations and contact flow intact.

# 2026-10-12 Multipage Build

Added production pages:
- Projects
- Services
- About
- Media
- Contact

Homepage launch cleanup:
- Removed `noindex,nofollow`
- Replaced concept-only meta description
- Updated main navigation, footer navigation and mobile navigation to real routes
- Updated primary homepage CTAs to real pages
- Added `robots.txt`

Content notes:
- Projects and Media use the Baulkham Hills renovation and limestone-hearth details supplied from Randall-Penn's own social posts.
- No ABN is displayed until Logan confirms which active entity should be used publicly.
- Existing homepage illustrative project imagery remains identified as illustrative in its project preview behavior.
