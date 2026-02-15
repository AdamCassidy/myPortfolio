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

// ---- Lighthouse Section ----
// Uses static markup in index.html with a link to Google verification.

