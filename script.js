/* ========================================
   AJAYKUMAR D — Portfolio JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // LOADING SCREEN
  // ============================
  const loadingScreen = document.getElementById('loading-screen');
  const loadingText = document.getElementById('loading-text');
  const lines = [
    'Initializing...',
    'Loading modules...',
    'Compiling portfolio...',
    'Ready.'
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
      return;
    }

    const currentLine = lines[lineIndex];

    if (charIndex <= currentLine.length) {
      loadingText.textContent = currentLine.substring(0, charIndex);
      charIndex++;
      setTimeout(typeLine, 35);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLine, 300);
    }
  }

  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
  setTimeout(typeLine, 500);

  // ============================
  // NAVBAR SCROLL STATE
  // ============================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');
  const sections = document.querySelectorAll('.section, .hero-section');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ============================
  // HAMBURGER MENU
  // ============================
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    overlay.classList.toggle('active');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    overlay.classList.remove('active');
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ============================
  // SCROLL-TRIGGERED REVEAL
  // ============================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================
  // ANIMATED COUNTERS
  // ============================
  const metricNumbers = document.querySelectorAll('.metric-number');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) {
    counterObserver.observe(metricsGrid);
  }

  function animateCounters() {
    metricNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOut * target);

        counter.textContent = currentValue + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ============================
  // CONTACT FORM HANDLER
  // ============================
  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (response.ok) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'var(--accent)';
        submitBtn.style.color = 'var(--bg-primary)';
        contactForm.reset();
      } else {
        submitBtn.textContent = '✗ Failed. Try again.';
        submitBtn.style.background = '#ff4444';
        submitBtn.style.color = '#fff';
      }
    })
    .catch(() => {
      submitBtn.textContent = '✗ Failed. Try again.';
      submitBtn.style.background = '#ff4444';
      submitBtn.style.color = '#fff';
    })
    .finally(() => {
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  });

  // ============================
  // SMOOTH SCROLL FOR CTA LINKS
  // ============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const yOffset = -80;
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============================
  // STAGGER ANIMATION FOR GRIDS
  // ============================
  const staggerContainers = [
    '.about-tags .tag-chip',
    '.cert-card',
    '.learning-tag',
    '.why-card',
    '.interest-card',
    '.philosophy-card'
  ];

  staggerContainers.forEach(selector => {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.05}s`;
    });
  });

  // ============================
  // PARALLAX HERO GLOW
  // ============================
  const heroGlow = document.querySelector('.hero-photo-glow');
  if (heroGlow) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(${x}px, ${y}px) rotate(${x * 5}deg)`;
    }, { passive: true });
  }

  // ============================
  // TAG CHIP ANIMATION ON SCROLL
  // ============================
  const tagChips = document.querySelectorAll('.tag-chip');
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chips = entry.target.querySelectorAll('.tag-chip');
        chips.forEach((chip, i) => {
          setTimeout(() => {
            chip.style.opacity = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 100);
        });
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const aboutTags = document.querySelector('.about-tags');
  if (aboutTags) {
    tagChips.forEach(chip => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(20px)';
      chip.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    tagObserver.observe(aboutTags);
  }

});
