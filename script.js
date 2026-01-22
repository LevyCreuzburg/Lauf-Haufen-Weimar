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
      // Beispiel: POST an einen Formular-Endpoint
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        message.textContent = 'Danke! Deine E‑Mail wurde gespeichert.';
        localStorage.setItem('laufhaufen_email', email);
        showDashboard(email);
        form.reset();
      } else {
        // Falls dein Dienst anderes Format zurückgibt, passe das Parsing an
        const data = await res.json().catch(()=>({}));
        const err = data.error || 'Beim Absenden ist ein Fehler aufgetreten.';
        message.textContent = err;
      }
    } catch (err) {
      // Für lokale Tests kannst du hier die Anmeldung simulieren:
      // localStorage.setItem('laufhaufen_email', email); showDashboard(email);
      message.textContent = 'Netzwerkfehler — bitte später versuchen.';
      console.error(err);
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
