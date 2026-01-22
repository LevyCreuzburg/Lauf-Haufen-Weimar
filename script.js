// Demo: Landing -> "angemeldet" Ansicht wechseln
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const message = document.getElementById('message');

  const hero = document.getElementById('hero');
  const dashboard = document.getElementById('dashboard');

  const userActions = document.getElementById('user-actions');
  const userWelcome = document.getElementById('user-welcome');
  const logoutButton = document.getElementById('logout-button');

  // Ersetze diesen Endpoint durch deinen echten Formular-Endpoint (Formspree, Netlify Forms, eigenes API)
  const endpoint = 'https://formspree.io/f/xlgjrwwn';

  // Wenn in localStorage schon eine Anmeldung steht, zeig Dashboard
  const subscribedEmail = localStorage.getItem('laufhaufen_email');
  if (subscribedEmail) showDashboard(subscribedEmail);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    message.textContent = 'Sende Anmeldung…';

    try {
      // POST an den Formular-Endpoint
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // Lese die rohe Antwort als Text (damit wir Fehlermeldungen sehen, auch wenn es kein JSON ist)
      const raw = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch (err) { /* not JSON */ }

      console.log('Form response status:', res.status);
      console.log('Form response raw:', raw);
      console.log('Form response parsed:', parsed);

      if (res.ok) {
        message.textContent = 'Danke! Deine E‑Mail wurde gespeichert.';
        localStorage.setItem('laufhaufen_email', email);
        showDashboard(email);
        form.reset();
      } else {
        // Formspree gibt manchmal JSON { error: "..." } oder nur Text "Form not found"
        const errText = (parsed && parsed.error) ? parsed.error : raw || 'Beim Absenden ist ein Fehler aufgetreten.';
        message.textContent = errText;
      }
    } catch (err) {
      message.textContent = 'Netzwerkfehler — bitte später versuchen.';
      console.error('Fetch error:', err);
    }
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('laufhaufen_email');
    userActions.hidden = true;
    dashboard.hidden = true;
    hero.hidden = false;
    message.textContent = 'Du wurdest abgemeldet.';
  });

  function showDashboard(email) {
    hero.hidden = true;
    dashboard.hidden = false;
    userActions.hidden = false;
    userWelcome.textContent = `Angemeldet als ${email}`;
    message.textContent = '';
  }
});
