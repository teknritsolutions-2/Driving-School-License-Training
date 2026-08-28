/**
 * ApexDrive Academy - Commercial Driving School & License Training
 * Main Application Script (ES6+)
 */

// Progressive enhancement marker for CSS animation readiness
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initNavbar();
  initScrollToTop();
  initScrollReveal();
  initFormValidation();
  initFilters();
  initCounters();
  initCountdown();
  initPasswordToggles();
  initCarousels();
  initResponsiveDrawerObserver();
});

/**
 * 1. Theme Management (Light / Dark Mode)
 */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const themeSetBtns = document.querySelectorAll('[data-theme-set]');
  const storedTheme = localStorage.getItem('apexdrive_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  // Desktop/Topbar toggle buttons
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem('apexdrive_theme', activeTheme);
      showToast(`Switched to ${activeTheme.toUpperCase()} mode`, 'info');
    });
  });

  // Drawer segmented control buttons
  themeSetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTheme = btn.getAttribute('data-theme-set');
      applyTheme(targetTheme);
      localStorage.setItem('apexdrive_theme', targetTheme);
      showToast(`Switched to ${targetTheme.toUpperCase()} mode`, 'info');
    });
  });

  // Listen to system changes if no explicit storage
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('apexdrive_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  
  // Update desktop toggle buttons
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', `Toggle color theme (currently ${theme})`);
    btn.setAttribute('aria-pressed', theme === 'dark');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
  });

  // Update drawer segmented buttons
  const themeSetBtns = document.querySelectorAll('[data-theme-set]');
  themeSetBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-theme-set') === theme;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
  });

  // Update light/dark logos for navbar and content (NEVER swap footer logo which is always on dark navy)
  const brandLogos = document.querySelectorAll('img.brand-logo-svg:not(.brand-logo-white)');
  brandLogos.forEach(logo => {
    if (logo.closest('.footer-apex') || logo.classList.contains('brand-logo-white') || logo.classList.contains('footer-logo-img')) {
      return;
    }
    const src = logo.getAttribute('src') || '';
    if (theme === 'dark') {
      if (src.includes('logo.svg')) {
        logo.setAttribute('src', src.replace('logo.svg', 'logo-white.svg'));
      }
    } else {
      if (src.includes('logo-white.svg')) {
        logo.setAttribute('src', src.replace('logo-white.svg', 'logo.svg'));
      }
    }
  });
}

/**
 * 2. Direction Management (LTR / RTL)
 */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const dirSetBtns = document.querySelectorAll('[data-dir-set]');
  const storedDir = localStorage.getItem('apexdrive_direction') || 'ltr';
  applyDirection(storedDir);

  // Desktop/Topbar toggle buttons
  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(activeDir);
      localStorage.setItem('apexdrive_direction', activeDir);
      showToast(`Switched text direction to ${activeDir.toUpperCase()}`, 'info');
      window.dispatchEvent(new Event('resize'));
    });
  });

  // Drawer segmented control buttons
  dirSetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDir = btn.getAttribute('data-dir-set');
      applyDirection(targetDir);
      localStorage.setItem('apexdrive_direction', targetDir);
      showToast(`Switched text direction to ${targetDir.toUpperCase()}`, 'info');
      window.dispatchEvent(new Event('resize'));
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  
  // Update desktop toggle buttons
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', `Toggle direction (currently ${dir.toUpperCase()})`);
    btn.setAttribute('aria-pressed', dir === 'rtl');
    const badge = btn.querySelector('.dir-badge');
    if (badge) {
      badge.textContent = dir.toUpperCase();
    }
  });

  // Update drawer segmented buttons
  const dirSetBtns = document.querySelectorAll('[data-dir-set]');
  dirSetBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-dir-set') === dir;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
  });
}

/**
 * 3. Navbar & Accessible Dropdown Enhancements
 */
function initNavbar() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item, .drawer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      
      // If inside dropdown, highlight parent toggle
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });
}

/**
 * 4. Global Scroll-To-Top Button
 */
function initScrollToTop() {
  let scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.type = 'button';
    scrollBtn.id = 'scrollToTop';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top of page');
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 5. Scroll-Triggered Entrance Motion (Item-Level Global Reveal)
 */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item, [data-reveal]');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => {
    // On tablet/mobile (<= 1024px), carousel cards are immediately marked visible to prevent any conflict with sliding
    if (window.innerWidth <= 1024 && item.closest('.carousel-track')) {
      item.classList.add('is-visible');
    } else {
      revealObserver.observe(item);
    }
  });

  // On resize below 1025px, ensure any carousel cards are marked visible
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
      document.querySelectorAll('.carousel-track .reveal-item').forEach(item => {
        item.classList.add('is-visible');
      });
    }
  }, { passive: true });
}

/**
 * 6. Form Validation & Submission
 */
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        showToast('Please correct the highlighted fields.', 'danger');
      } else {
        form.classList.remove('was-validated');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
          form.reset();
          showToast('Thank you! Your request has been submitted successfully.', 'success');
        }, 1000);
      }
    }, false);
  });
}

/**
 * 7. Dynamic Category Filtering (Courses, Vehicles, Blog)
 */
function initFilters() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline-secondary');

      const filterValue = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue || (itemCategory && itemCategory.includes(filterValue))) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/**
 * 8. Animated Number Counters
 */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = Math.max(1, target / 35);

        const updateCount = () => {
          count += speed;
          if (count < target) {
            entry.target.innerText = `${prefix}${Math.ceil(count)}${suffix}`;
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = `${prefix}${target}${suffix}`;
          }
        };

        updateCount();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * 9. Coming Soon Countdown Timer
 */
function initCountdown() {
  const countdownEl = document.getElementById('comingSoonCountdown');
  if (!countdownEl) return;

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMinutes');
  const secsEl = document.getElementById('countSeconds');

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);
  targetDate.setHours(targetDate.getHours() + 14);

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = d < 10 ? `0${d}` : d;
    if (hoursEl) hoursEl.innerText = h < 10 ? `0${h}` : h;
    if (minsEl) minsEl.innerText = m < 10 ? `0${m}` : m;
    if (secsEl) secsEl.innerText = s < 10 ? `0${s}` : s;
  }

  update();
  setInterval(update, 1000);
}

/**
 * 10. Password Visibility Toggle
 */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPass = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPass ? 'text' : 'password');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPass ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill';
      }
    });
  });
}

/**
 * 11. Universal Responsive Carousel Engine
 * Handles: Desktop grid fallback, Tablet (2-card slide), Mobile (1-card slide),
 * Touch/Swipe, Auto-sliding with pause on interaction, debounced resize recalculation, and RTL.
 */
function initCarousels() {
  const carousels = document.querySelectorAll('[data-carousel], .responsive-carousel');
  if (!carousels.length) return;

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (!track || slides.length < 2) return;

    let currentIndex = 0;
    let autoSlideTimer = null;
    let isPaused = false;

    // Get visible slides count based on current viewport
    function getVisibleCount() {
      const width = window.innerWidth;
      if (width >= 1025 && carousel.classList.contains('desktop-grid')) {
        return slides.length; // All visible in grid mode
      }
      if (width >= 640) {
        return 2; // Tablet: 2 cards
      }
      return 1; // Mobile: 1 card
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, slides.length - visible);
    }

    function updateCarousel() {
      const width = window.innerWidth;
      if (width >= 1025 && carousel.classList.contains('desktop-grid')) {
        track.style.transform = '';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = 0;
      }
      if (currentIndex < 0) {
        currentIndex = maxIndex;
      }

      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(window.getComputedStyle(track).gap) || 20;
      const offset = currentIndex * (slideWidth + gap);
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

      const transformValue = isRtl
        ? `translate3d(${offset}px, 0, 0)`
        : `translate3d(-${offset}px, 0, 0)`;

      track.style.transform = transformValue;

      if (prevBtn) prevBtn.disabled = (currentIndex === 0 && !autoSlideTimer);
      if (nextBtn) nextBtn.disabled = (currentIndex >= maxIndex && !autoSlideTimer);
    }

    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex += 1;
      }
      updateCarousel();
    }

    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex -= 1;
      }
      updateCarousel();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoTimer();
      });
    }

    // Auto-sliding every 5.5 seconds (Pause on interaction)
    function startAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(() => {
        if (!isPaused && window.innerWidth < 1025) {
          nextSlide();
        }
      }, 5500);
    }

    function resetAutoTimer() {
      startAutoSlide();
    }

    carousel.addEventListener('mouseenter', () => { isPaused = true; });
    carousel.addEventListener('mouseleave', () => { isPaused = false; });
    carousel.addEventListener('focusin', () => { isPaused = true; });
    carousel.addEventListener('focusout', () => { isPaused = false; });

    // Touch / Swipe Handling
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      isPaused = false;
      resetAutoTimer();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      const threshold = 45;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          // Swiped left
          if (isRtl) prevSlide(); else nextSlide();
        } else {
          // Swiped right
          if (isRtl) nextSlide(); else prevSlide();
        }
      }
    }

    // Debounced Resize listener
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCarousel, 80);
    }, { passive: true });

    updateCarousel();
    startAutoSlide();
  });
}

/**
 * 12. Responsive Drawer Auto-Close on Desktop Resize
 */
function initResponsiveDrawerObserver() {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      const openDrawers = document.querySelectorAll('.offcanvas.show');
      openDrawers.forEach(drawer => {
        if (window.bootstrap && window.bootstrap.Offcanvas) {
          const instance = window.bootstrap.Offcanvas.getInstance(drawer);
          if (instance) {
            instance.hide();
          }
        }
      });
    }
  }, { passive: true });
}

/**
 * 13. Toast Notifications Dispatcher
 */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1090';
    document.body.appendChild(container);
  }

  const iconClass = type === 'success' ? 'bi-check-circle-fill text-primary' :
                    type === 'danger' ? 'bi-exclamation-triangle-fill text-danger' :
                    'bi-info-circle-fill text-primary';

  const toastEl = document.createElement('div');
  toastEl.className = 'toast-apex shadow-lg d-flex align-items-center gap-2 p-3 mb-2 rounded-3 border';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <i class="bi ${iconClass} fs-5"></i>
    <div class="toast-body small fw-medium flex-grow-1 text-heading">${message}</div>
    <button type="button" class="btn-close btn-close-sm ms-2" aria-label="Close"></button>
  `;

  const closeBtn = toastEl.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => toastEl.remove());

  container.appendChild(toastEl);

  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateY(10px)';
    toastEl.style.transition = 'all 0.3s ease';
    setTimeout(() => toastEl.remove(), 300);
  }, 4000);
}
