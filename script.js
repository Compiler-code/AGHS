/**
 * Abundant Grace Montessori School — script.js
 * Features:
 *  - Smooth scrolling for nav links
 *  - Mobile hamburger menu toggle
 *  - Navbar scroll-state class
 *  - IntersectionObserver fade-in animations
 *  - Testimonial slider
 *  - Contact form validation
 *  - Back-to-top button
 */

(function () {
  'use strict';

  /* ============================================================
     1. DOM REFERENCES
     ============================================================ */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const backToTop   = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  /* ============================================================
     2. NAVBAR — SCROLL STATE
     ============================================================ */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show / hide back-to-top
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ============================================================
     3. SMOOTH SCROLLING
     ============================================================ */
  function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      e.preventDefault();
      smoothScrollTo(href);

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  /* ============================================================
     4. HAMBURGER / MOBILE MENU
     ============================================================ */
  function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ============================================================
     5. ACTIVE NAV LINK HIGHLIGHTING (scroll spy)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollMid >= top && scrollMid < bottom) {
        const id = section.getAttribute('id');
        allNavLinks.forEach(function (link) {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* Active link styling injected via JS to keep CSS clean */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .nav-link.active-link:not(.nav-cta) {
      color: var(--terracotta);
    }
    .nav-link.active-link:not(.nav-cta)::after {
      width: 60%;
    }
  `;
  document.head.appendChild(styleEl);

  /* ============================================================
     6. INTERSECTION OBSERVER — FADE-IN SECTIONS
     ============================================================ */
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if they have data-stagger attribute
          const children = entry.target.querySelectorAll('[data-stagger]');
          children.forEach(function (child, index) {
            setTimeout(function () {
              child.classList.add('visible');
            }, index * 100);
          });
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  document.querySelectorAll('.fade-in-section').forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ============================================================
     7. GALLERY ITEMS — STAGGER REVEAL
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');

  const galleryObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.gallery-item');
          items.forEach(function (item, i) {
            setTimeout(function () {
              item.style.opacity    = '1';
              item.style.transform  = 'translateY(0)';
            }, i * 80);
          });
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryItems.forEach(function (item) {
      item.style.opacity   = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    galleryObserver.observe(galleryGrid);
  }

  /* ============================================================
     8. PROGRAM CARDS — STAGGER REVEAL
     ============================================================ */
  const programCards = document.querySelectorAll('.program-card');

  const programObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          programCards.forEach(function (card, i) {
            setTimeout(function () {
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0)';
            }, i * 120);
          });
          programObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const programsGrid = document.querySelector('.programs-grid');
  if (programsGrid) {
    programCards.forEach(function (card) {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.55s ease, transform 0.55s ease, box-shadow 0.3s ease';
    });
    programObserver.observe(programsGrid);
  }

  /* ============================================================
     9. TESTIMONIAL SLIDER
     ============================================================ */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots             = document.querySelectorAll('.dot');
  let currentTestimonial = 0;
  let testimonialTimer;

  function showTestimonial(index) {
    testimonialCards.forEach(function (card) { card.classList.remove('active'); });
    dots.forEach(function (dot) { dot.classList.remove('active'); });

    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function startAutoPlay() {
    testimonialTimer = setInterval(nextTestimonial, 5000);
  }

  function stopAutoPlay() {
    clearInterval(testimonialTimer);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      stopAutoPlay();
      showTestimonial(index);
      startAutoPlay();
    });
  });

  if (testimonialCards.length > 0) {
    startAutoPlay();
  }

  // Pause on hover
  const testimonialContainer = document.querySelector('.testimonials');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', stopAutoPlay);
    testimonialContainer.addEventListener('mouseleave', startAutoPlay);
  }

  /* ============================================================
     10. CONTACT FORM VALIDATION
     ============================================================ */
  const fields = {
    firstName : { el: document.getElementById('firstName'), errEl: document.getElementById('firstNameError'), rules: { required: true, minLength: 2 } },
    lastName  : { el: document.getElementById('lastName'),  errEl: document.getElementById('lastNameError'),  rules: { required: true, minLength: 2 } },
    email     : { el: document.getElementById('email'),     errEl: document.getElementById('emailError'),     rules: { required: true, isEmail: true } },
    message   : { el: document.getElementById('message'),   errEl: document.getElementById('messageError'),   rules: { required: true, minLength: 10 } },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(name) {
    const { el, errEl, rules } = fields[name];
    const value = el.value.trim();
    let error = '';

    if (rules.required && value === '') {
      error = 'This field is required.';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = 'Please enter at least ' + rules.minLength + ' characters.';
    } else if (rules.isEmail && !emailRegex.test(value)) {
      error = 'Please enter a valid email address.';
    }

    if (error) {
      el.classList.add('error');
      errEl.textContent = error;
      return false;
    } else {
      el.classList.remove('error');
      errEl.textContent = '';
      return true;
    }
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(function (name) {
    const el = fields[name].el;
    if (!el) return;

    el.addEventListener('blur', function () { validateField(name); });
    el.addEventListener('input', function () {
      if (el.classList.contains('error')) validateField(name);
    });
  });

  function validateAll() {
    let allValid = true;
    Object.keys(fields).forEach(function (name) {
      if (!validateField(name)) allValid = false;
    });
    return allValid;
  }

  /* ============================================================
     11. FORM SUBMISSION (simulated)
     ============================================================ */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateAll()) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(function () {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show success message
        formSuccess.classList.add('visible');
        contactForm.reset();

        // Scroll to success message
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success after 8 seconds
        setTimeout(function () {
          formSuccess.classList.remove('visible');
        }, 8000);
      }, 1800);
    });
  }

  /* ============================================================
     12. BACK TO TOP BUTTON
     ============================================================ */
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     13. HERO STAT COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start    = performance.now();
    const startVal = 0;

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);

      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const heroObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const statNumbers = document.querySelectorAll('.stat-number');
          const targets     = [15, 200, 98];
          const suffixes    = ['+', '+', '%'];

          statNumbers.forEach(function (el, i) {
            animateCounter(el, targets[i], suffixes[i]);
          });

          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  /* ============================================================
     14. SCROLL PROGRESS INDICATOR (subtle nav underline)
     ============================================================ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--sage), var(--terracotta), var(--honey));
    z-index: 200;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ============================================================
     15. PARALLAX EFFECT ON HERO SHAPES (subtle)
     ============================================================ */
  const shapes = document.querySelectorAll('.shape');

  function handleParallax() {
    const scrollY = window.scrollY;
    shapes.forEach(function (shape, i) {
      const speed = 0.08 + i * 0.04;
      shape.style.transform = 'translateY(' + scrollY * speed + 'px)';
    });
  }

  // Only enable on non-reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ============================================================
     16. INITIALISE
     ============================================================ */
  handleNavbarScroll();
  updateActiveLink();
  updateProgress();

  // Animate hero content in on load
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity   = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    requestAnimationFrame(function () {
      heroContent.style.opacity   = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.opacity   = '0';
    heroVisual.style.transform = 'translateY(30px)';
    heroVisual.style.transition = 'opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s';

    requestAnimationFrame(function () {
      heroVisual.style.opacity   = '1';
      heroVisual.style.transform = 'translateY(0)';
    });
  }

})();

/* ============================================================
   17. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();