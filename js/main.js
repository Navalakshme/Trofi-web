/* ============================================
   TROFI — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──
  const nav = document.querySelector('.nav');
  if (nav) {
    const heroSection = document.querySelector('.hero, .article-hero');
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

  // ── Mockup Offers Carousel (Continuous Infinite Loop) ──
  const track = document.querySelector('.mockup-slider-track');
  const overlay = document.querySelector('.mockup-slider-overlay');
  
  if (track && overlay) {
    const slides = Array.from(track.children);
    const totalOriginalSlides = slides.length; // should be 3
    
    if (totalOriginalSlides > 1) {
      // 1. Clone the first slide and append it to the end
      const firstClone = slides[0].cloneNode(true);
      track.appendChild(firstClone);
      
      // 2. Adjust track and slides width dynamically
      const totalSlidesCount = totalOriginalSlides + 1; // 4 slides
      track.style.width = `${totalSlidesCount * 100}%`;
      track.style.display = 'flex';
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const allSlides = track.children;
      for (let slide of allSlides) {
        slide.style.width = `${100 / totalSlidesCount}%`;
      }
      
      let currentIndex = 0;
      let autoPlayTimer = null;
      let isTransitioning = false;
      
      const updateSlider = (index) => {
        if (isTransitioning) return;
        
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = `translateX(-${index * (100 / totalSlidesCount)}%)`;
        currentIndex = index;
        
        // Handle wrapping from cloned slide back to the first slide
        if (index === totalOriginalSlides) {
          isTransitioning = true;
          // Wait for transition to complete
          setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            currentIndex = 0;
            isTransitioning = false;
          }, 500); // 500ms matches the transition duration
        }
      };
      
      const startAutoPlay = () => {
        autoPlayTimer = setInterval(() => {
          if (!isTransitioning) {
            updateSlider(currentIndex + 1);
          }
        }, 4000);
      };
      
      const stopAutoPlay = () => {
        if (autoPlayTimer) {
          clearInterval(autoPlayTimer);
        }
      };
      
      // Touch swipe support
      let startX = 0;
      let isDragging = false;
      
      overlay.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
      }, { passive: true });
      
      overlay.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Threshold of 30px
        if (Math.abs(diffX) > 30) {
          if (diffX > 0) {
            // Swipe left -> Next
            if (!isTransitioning) {
              updateSlider(currentIndex + 1);
            }
          } else {
            // Swipe right -> Prev
            if (!isTransitioning) {
              if (currentIndex === 0) {
                // If we are on the first slide and swipe right, jump to cloned slide instantly first
                track.style.transition = 'none';
                track.style.transform = `translateX(-${totalOriginalSlides * (100 / totalSlidesCount)}%)`;
                currentIndex = totalOriginalSlides;
                // Then in next frame, transition to slide 3 (index 2)
                setTimeout(() => {
                  updateSlider(totalOriginalSlides - 1);
                }, 20);
              } else {
                updateSlider(currentIndex - 1);
              }
            }
          }
        }
        startAutoPlay();
      });
      
      startAutoPlay();
    }
  }

});
