# Job Promotion Campaign Manager (Consent-Based)

A small phone-friendly web dashboard to import candidate contacts, prepare personalized job messages,
review campaigns, and export message drafts. It does **not** automate unsolicited bulk DMs or bypass
WhatsApp/Instagram platform restrictions.

## Features
- Import a CSV of candidates with `name,phone,instagram,consent_whatsapp,consent_instagram`
- Add a job campaign and personalize messages with `{name}`, `{role}`, `{location}`, `{salary}`, `{apply_link}`
- Preview each candidate's message
- Export approved message drafts as CSV for use with official messaging tools
- Tracks opt-in fields and STOP/unsubscribe status locally in the browser

## Run
1. Unzip the folder.
2. Open `index.html` in Chrome/Edge/Firefox. No server or installation required.
3. Open **Sample CSV** to see the expected format, or import your own CSV.
4. Add job details and a message template.
5. Review previews and export drafts.
6. For actual messaging, use official APIs and message only candidates who opted in. WhatsApp Business Platform:
   https://business.whatsapp.com/platform
   Instagram Messaging API:
   https://developers.facebook.com/docs/messenger-platform/instagram/

## CSV format
Required headers:
`name,phone,instagram,consent_whatsapp,consent_instagram`

Consent values accepted: `yes`, `true`, `1`. Anything else is treated as no consent.
Example:
`Asha,+919876543210,asha.example,yes,no`

## Notes
- Data stays in this browser's local storage; it is not uploaded to a server.
- Do not import scraped or purchased lists, and do not message people who have not opted in.
- Instagram's API has recipient and messaging-window restrictions. This dashboard deliberately does not include browser automation, password collection, scraping, or bulk-DM bypasses.
- Back up your data with the Export button. Clearing browser data may erase it.
