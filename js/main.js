/* ============================================
   TROFI — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──
  const nav = document.querySelector('.nav');
  if (nav) {
    const heroSection = document.querySelector('.hero');
    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      } else {
        nav.classList.remove('scrolled');
        if (heroSection) nav.classList.add('transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run immediately to set initial state on load
  }

  // ── Mobile menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.classList.toggle('active', open);
      
      // Toggle menu-open on navigation bar
      if (nav) {
        nav.classList.toggle('menu-open', open);
      }

      // Animate bars
      const bars = hamburger.querySelectorAll('span');
      if (open) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        if (nav) nav.classList.remove('menu-open');
        document.body.style.overflow = '';
        const bars = hamburger.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      });
    });
  }

  // ── Intersection Observer for animations ──
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right');

  if (animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
        window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
      }
    });
  });

  // ── Marquee duplicate for seamless loop ──
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentElement.appendChild(clone);
  }

  // ── Testimonials slider (mobile) ──
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  let touchStartX = 0;
  if (testimonialsGrid && window.innerWidth < 768) {
    testimonialsGrid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  }

  // ── FAQ Accordion with smooth slide-down ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    const icon = q.querySelector('.faq-icon');
    
    q.addEventListener('click', () => {
      const active = item.classList.contains('active');
      
      // Close other open FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherA = otherItem.querySelector('.faq-a');
          if (otherA) {
            otherA.style.maxHeight = '0px';
            otherA.style.opacity = '0';
          }
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });
      
      if (active) {
        item.classList.remove('active');
        a.style.maxHeight = '0px';
        a.style.opacity = '0';
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
        a.style.opacity = '1';
        if (icon) icon.textContent = '−';
      }
    });
  });

});

// ── QR Code pattern generator (decorative) ──
const qrGrid = document.getElementById('qr-grid');
if (qrGrid) {
  // Fixed QR-like pattern seeded deterministically
  const pattern = [
    1,1,1,1,1,1,1,0,1,0,
    1,0,0,0,0,0,1,0,0,1,
    1,0,1,1,1,0,1,0,1,0,
    1,0,1,1,1,0,1,0,0,1,
    1,0,1,1,1,0,1,0,1,1,
    1,0,0,0,0,0,1,0,0,1,
    1,1,1,1,1,1,1,0,1,0,
    0,0,0,0,0,0,0,0,1,1,
    1,0,1,1,0,1,1,0,0,1,
    0,1,0,0,1,0,1,1,1,0
  ];
  pattern.forEach(bit => {
    const cell = document.createElement('div');
    cell.style.cssText = `background:${bit ? '#0a0a0a' : '#fff'};border-radius:1px;`;
    qrGrid.appendChild(cell);
  });
}
