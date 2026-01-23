// Netlify Function: functions/login.js
// ENV required:
// AUTH_SECRET - secret used for hashing + HMAC
// ALLOWED_USERS - JSON string: { "user@example.com": "<sha256(password+AUTH_SECRET)>" }
// Optional:
// FORMSPREE_ENDPOINT - e.g. "https://formspree.io/f/xxxxx"

const crypto = require('crypto');
const fetch = require('node-fetch'); // Netlify Node environment hat fetch in newer runtimes; node-fetch is safe fallback

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ungültiger Request' }) };
  }

  const { email, password, forwardToFormspree } = body;
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email und Passwort sind erforderlich' }) };
  }

  const AUTH_SECRET = process.env.AUTH_SECRET || '';
  const allowedJson = process.env.ALLOWED_USERS || '{}';
  let allowed;
  try { allowed = JSON.parse(allowedJson); } catch (e) { allowed = {}; }

  // Erzeuge Hash wie beim Erstellen: sha256(password + AUTH_SECRET)
  const hash = crypto.createHash('sha256').update(password + AUTH_SECRET, 'utf8').digest('hex');

  const expected = allowed[email];
  if (!expected || expected !== hash) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Ungültige Zugangsdaten' })
    };
  }

  // Erstelle ein kurzes Token (HMAC über email + timestamp)
  const token = crypto.createHmac('sha256', AUTH_SECRET).update(email + ':' + Date.now()).digest('hex');

  // Optional: serverseitig an Formspree weiterleiten (sicher, keine CORS-Probleme)
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
  if (forwardToFormspree && formspreeEndpoint) {
    try {
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // wir ignorieren die Antwort hier; du kannst sie bei Bedarf prüfen
    } catch (err) {
      console.error('Formspree forward failed', err);
      // Nicht fatal für die Auth — wir melden trotzdem Erfolg
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, token })
  };
};
