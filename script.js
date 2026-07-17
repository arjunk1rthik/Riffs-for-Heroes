// ===== Riffs for Heroes — shared interactivity =====

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', false);
    }));
  }

  // Mark current page in nav
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // String-line pluck when it scrolls into view (signature element)
  const strings = document.querySelectorAll('.string-line');
  if ('IntersectionObserver' in window) {
    const stringIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pluck');
          stringIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    strings.forEach(el => stringIO.observe(el));
  }

  // Card cursor-glow tracking
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // Animated stat counters
  const stats = document.querySelectorAll('.stat .num[data-count]');
  if (stats.length && 'IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(target * eased);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(el => statIO.observe(el));
  }

  // Sticky header shrink on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.style.boxShadow = y > 12 ? '0 8px 24px -16px rgba(0,0,0,.6)' : 'none';
      lastY = y;
    }, { passive: true });
  }
  // Hero video sound toggle
  const heroVideo = document.getElementById('heroVideo');
  const volumeToggle = document.getElementById('volumeToggle');

  if (heroVideo && volumeToggle) {

    volumeToggle.addEventListener('click', () => {

      heroVideo.muted = !heroVideo.muted;

      if (heroVideo.muted) {
        volumeToggle.textContent = '🔇';
      } else {
        heroVideo.volume = 1;
        heroVideo.play(); // keeps playback going
        volumeToggle.textContent = '🔊';
      }

    });

  }
});
