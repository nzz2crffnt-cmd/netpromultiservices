// Menu mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('open');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.classList.remove('open');
}));

// Ombre du header au scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

// Apparition au scroll + compteurs
const targets = document.querySelectorAll('.card, .step, .review, .pillar, .gallery figure, .section-head, .devis-form, .stats-grid > div');
targets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    const num = e.target.querySelector('.num');
    if (num && !num.dataset.done) {
      num.dataset.done = 1;
      const end = +num.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.ceil(end / 40));
      const t = setInterval(() => {
        cur = Math.min(end, cur + step);
        num.textContent = cur;
        if (cur >= end) clearInterval(t);
      }, 30);
    }
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
targets.forEach(el => io.observe(el));

// Formulaire de devis -> envoi direct depuis le site (sans ouvrir la messagerie)
const devisForm = document.getElementById('devisForm');
devisForm.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(devisForm);
  if (f.get('_honey')) return; // anti-spam
  const btn = devisForm.querySelector('button[type="submit"]');
  const status = document.getElementById('formStatus');
  btn.disabled = true; btn.textContent = 'Envoi en cours…';
  status.className = 'form-status'; status.textContent = '';
  const data = {
    _subject: `Nouvelle demande de devis – ${f.get('prestation')} – ${f.get('nom')}`,
    _template: 'table',
    _captcha: 'false',
    'Société / Syndic': f.get('nom'),
    'Téléphone': f.get('tel'),
    'E-mail': f.get('email') || '—',
    'Adresse du site': f.get('ville') || '—',
    'Prestation': f.get('prestation'),
    'Fréquence': f.get('frequence'),
    'Message': f.get('message') || '—'
  };
  if (f.get('email')) data._replyto = f.get('email');
  try {
    const r = await fetch('https://formsubmit.co/ajax/multiservices.netpro@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'Erreur');
    devisForm.innerHTML = '<div class="form-success"><div class="form-success-icon">✓</div><h3>Merci, votre demande est envoyée !</h3><p>Nous vous recontactons sous 24 h pour votre devis gratuit.</p><p>Besoin urgent ? Appelez-nous au <a href="tel:+33745121063">07 45 12 10 63</a>.</p></div>';
  } catch (err) {
    btn.disabled = false; btn.textContent = 'Envoyer ma demande';
    status.className = 'form-status error';
    status.innerHTML = 'L\'envoi n\'a pas fonctionné. Réessayez ou appelez-nous au <a href="tel:+33745121063">07 45 12 10 63</a>.';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
