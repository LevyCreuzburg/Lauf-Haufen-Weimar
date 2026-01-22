document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;
    // Ersetze die URL durch deinen Form-Endpoint (Formspree, Netlify, eigenen Server, Mailchimp-proxy)
    const endpoint = 'https://formspree.io/f/YOUR_FORM_ID';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        message.textContent = 'Danke! Wir haben deine E‑Mail erhalten. Du bekommst bald mehr Infos.';
        form.reset();
      } else {
        const data = await res.json().catch(()=>({}));
        const err = data.error || 'Beim Absenden ist ein Fehler aufgetreten.';
        message.textContent = err;
      }
    } catch (err) {
      message.textContent = 'Netzwerkfehler — bitte später versuchen.';
      console.error(err);
    }
  });
});
