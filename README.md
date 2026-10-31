# MK Certiva Solutions — Website + Backend

This package includes the website and a Node.js/Express backend. The contact form and client feedback form send submissions to `rdxhamza04@gmail.com` by email after SMTP is configured.

## Run on your computer
1. Install Node.js 20 or newer from https://nodejs.org/.
2. Extract this ZIP to a folder.
3. Open Command Prompt/Terminal in that folder.
4. Run `npm install`.
5. Copy `.env.example` to a new file named `.env`.
6. Add valid SMTP credentials to `.env` (details below).
7. Run `npm start`.
8. Open http://localhost:3000 in your browser.

## Email configuration
The destination inbox is `rdxhamza04@gmail.com`. SMTP credentials are NOT included in this ZIP. For Gmail SMTP, set `SMTP_USER` to the Gmail account used to send email and `SMTP_PASS` to that account's Google App Password. The sender account can be different from the destination inbox. Never use your normal Gmail password, and never commit `.env` to GitHub.

If you do not want to use Gmail SMTP, configure another SMTP provider using its host, port, username and password. `BUSINESS_EMAIL` controls the destination inbox.

## Deploy online
GitHub Pages cannot run a Node.js backend. Deploy this project as a Node web service on a Node.js host. Build command: `npm install`; start command: `npm start`. Add the variables from `.env.example` in the hosting provider's environment settings. Do not upload `.env` to GitHub.

## Health check
After running, open `/api/health`; it should return `{ "ok": true, ... }`.

## Forms
- Contact form: `POST /api/contact`
- Feedback form: `POST /api/feedback`

Submissions are emailed; this package does not include a database for storing submissions. Configure SMTP before expecting email delivery.
