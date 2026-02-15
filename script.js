/* ============================================
   Portfolio — Interactions & Animations
   ============================================ */

// ---- Custom Cursor ----
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

if (cursorDot && cursorRing && hasFinePointer && !prefersReducedMotion) {
  let cursorRAF = null;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    cursorRAF = requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && cursorRAF) {
      cancelAnimationFrame(cursorRAF);
      cursorRAF = null;
      return;
    }

    if (!document.hidden && !cursorRAF) {
      animateRing();
    }
  });

  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project__image-wrap');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });
}

// ---- Local Time ----
function updateTime() {
  const localTimeEl = document.getElementById('localTime');
  if (!localTimeEl) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  localTimeEl.textContent = timeStr;
}
const localTimeEl = document.getElementById('localTime');
if (localTimeEl) {
  updateTime();
  setInterval(updateTime, 1000);
}

// ---- Scroll Reveal ----
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe projects
document.querySelectorAll('.project').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
  observer.observe(el);
});

// Observe other revealable elements
document.querySelectorAll('.about__lead, .about__body, .about__skill-group, .about__statement, .contact__heading, .contact__link').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.08}s`;
  observer.observe(el);
});

// ---- Parallax on hero background text ----
const heroBgText = document.querySelector('.hero__bg-text');
if (heroBgText && !prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
      heroBgText.style.opacity = Math.max(0, 0.4 - scrollY / (window.innerHeight * 1.5));
    }
  }, { passive: true });
}

// ---- Nav background on scroll ----
const nav = document.querySelector('.nav');
if (nav && hasFinePointer && !prefersReducedMotion) {
  let navIsBlurred = false;
  window.addEventListener('scroll', () => {
    const shouldBlur = window.scrollY > 100;
    if (shouldBlur === navIsBlurred) {
      return;
    }

    navIsBlurred = shouldBlur;
    nav.classList.toggle('nav--blurred', navIsBlurred);
  }, { passive: true });
}

// ---- Lighthouse Scores (PageSpeed Insights API) ----
(function fetchLighthouseScores() {
  const SITE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? null
    : window.location.href;

  const metrics = document.querySelectorAll('.lighthouse__metric');
  const circumference = 2 * Math.PI * 52; // r=52

  function setScore(el, score) {
    const ring = el.querySelector('.lighthouse__ring-fill');
    const label = el.querySelector('.lighthouse__score');
    const value = Math.round(score * 100);
    const offset = circumference - (score * circumference);

    // Color coding
    let color = 'red';
    if (value >= 90) color = 'green';
    else if (value >= 50) color = 'orange';
    el.setAttribute('data-color', color);

    label.textContent = value;
    label.setAttribute('data-score', value);
    ring.style.strokeDashoffset = offset;
  }

  const categories = ['performance', 'accessibility', 'seo'];
  const categoryParams = categories.map(c => `category=${c.toUpperCase()}`).join('&');
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE_URL)}&${categoryParams}`;

  function loadScores() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (!data.lighthouseResult) return;
        const cats = data.lighthouseResult.categories;
        metrics.forEach(el => {
          const cat = el.getAttribute('data-category');
          if (cats[cat]) {
            setScore(el, cats[cat].score);
          }
        });
        document.querySelector('.lighthouse__note').textContent =
          'Scores fetched live via Google PageSpeed Insights API';
      })
      .catch(() => {
        document.querySelector('.lighthouse__note').textContent =
          'Could not fetch Lighthouse scores — try refreshing';
      });
  }

  // Defer non-critical fetch so it does not compete with first render.
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadScores, { timeout: 3000 });
    return;
  }

  window.setTimeout(loadScores, 1200);
})();

