require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DESTINATION = process.env.BUSINESS_EMAIL || 'rdxhamza04@gmail.com';
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: false, limit: '30kb' }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many submissions. Please wait and try again.' } });
const clean = (v, max = 4000) => String(v || '').trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, max);
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
}
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'MK Certiva Solutions Website' }));
async function sendMail({ name, email, subject, text }) {
  const transporter = getTransporter();
  if (!transporter) throw new Error('Email is not configured yet. Add SMTP settings to the hosting environment.');
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: DESTINATION, replyTo: email || undefined, subject, text: `Name: ${name || 'Not provided'}\nSender email: ${email || 'Not provided'}\n\n${text}` });
}
app.post('/api/contact', limiter, async (req, res) => {
  const name = clean(req.body.name, 120), company = clean(req.body.company, 160), email = clean(req.body.email, 254), phone = clean(req.body.phone, 60), message = clean(req.body.message, 5000);
  if (!name || !validEmail(email) || !message) return res.status(400).json({ error: 'Please enter your name, a valid email address, and a message.' });
  try { await sendMail({ name, email, subject: `Website Contact Form: ${name}`, text: `Company: ${company || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nMessage:\n${message}` }); res.json({ ok: true, message: 'Thank you! Your message has been sent.' }); }
  catch (err) { console.error('Contact email error:', err.message); res.status(503).json({ error: 'Your form could not be emailed yet. Please try again later or email rdxhamza04@gmail.com directly.' }); }
});
app.post('/api/feedback', limiter, async (req, res) => {
  const name = clean(req.body.name, 120), email = clean(req.body.email, 254), type = clean(req.body.feedbackType, 100), rating = clean(req.body.rating, 80), message = clean(req.body.message, 5000);
  if (!name || !validEmail(email) || !message) return res.status(400).json({ error: 'Please enter your name, a valid email address, and your feedback.' });
  try { await sendMail({ name, email, subject: `Website Feedback: ${type || 'General Feedback'}`, text: `Feedback type: ${type || 'Not provided'}\nRating: ${rating || 'Not provided'}\nFeedback:\n${message}` }); res.json({ ok: true, message: 'Thank you! Your feedback has been sent.' }); }
  catch (err) { console.error('Feedback email error:', err.message); res.status(503).json({ error: 'Feedback could not be emailed yet. Please try again later or email rdxhamza04@gmail.com directly.' }); }
});
app.use(express.static(ROOT));
app.get('*', (req, res, next) => { if (req.path.startsWith('/api/')) return next(); res.sendFile(path.join(ROOT, 'index.html')); });
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Unexpected server error.' }); });
app.listen(PORT, () => console.log(`MK Certiva Solutions website running on port ${PORT}`));
