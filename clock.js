function updateClock() {
  const clockContainer = document.getElementById('digital-clock');
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  clockContainer.textContent = `${h}:${m}:${s}`;
}

function startClock() {
  let clockContainer = document.getElementById('digital-clock');
  if (!clockContainer) {
    clockContainer = document.createElement('div');
    clockContainer.id = 'digital-clock';
    clockContainer.className = 'clock-digital';
    document.body.appendChild(clockContainer);
  }
  updateClock();
  setInterval(updateClock, 1000);
}

window.addEventListener('DOMContentLoaded', startClock);
