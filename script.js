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

// Formulaire de devis -> ouvre la messagerie avec la demande pré-remplie
document.getElementById('devisForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body =
`Bonjour NETPRO MULTISERVICES,

Je souhaite recevoir un devis gratuit.

Nom / Société : ${f.get('nom')}
Téléphone : ${f.get('tel')}
E-mail : ${f.get('email')}
Ville : ${f.get('ville')}
Prestation : ${f.get('prestation')}
Fréquence : ${f.get('frequence')}

Message :
${f.get('message')}`;
  const subject = `Demande de devis gratuit – ${f.get('prestation')}`;
  window.location.href = `mailto:multiservices.netpro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();
