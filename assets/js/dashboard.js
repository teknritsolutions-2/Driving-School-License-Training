/**
 * ApexDrive Academy - Student Dashboard Logic (ES6+)
 * Strictly learner-focused: Booking wizard, hours tracking, lessons filter, feedback & report generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initBookingWizard();
  initLessonsFilter();
  initPrintReport();
  initProfileForm();
  initDashboardActionButtons();
});

/**
 * 1. Dashboard Tab Navigation
 */
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dashboard-nav-item .nav-link[data-tab], [data-nav-tab]');
  const tabSections = document.querySelectorAll('.dashboard-tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab') || link.getAttribute('data-nav-tab');
      if (!targetTab) return;

      // Update Nav active states across desktop & mobile drawer
      document.querySelectorAll(`.dashboard-nav-item .nav-link`).forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.dashboard-nav-item .nav-link[data-tab="${targetTab}"]`).forEach(l => l.classList.add('active'));

      // Show target tab section
      tabSections.forEach(section => {
        if (section.id === `tab-${targetTab}`) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

      // Close mobile offcanvas drawer if open
      const offcanvasEl = link.closest('.offcanvas') || document.getElementById('dashboardDrawer');
      if (offcanvasEl && window.bootstrap && window.bootstrap.Offcanvas) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      }

      // Update URL hash without scroll
      history.replaceState(null, null, `#${targetTab}`);
    });
  });

  // Check URL Hash on load
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash) {
    const activeLink = document.querySelector(`.dashboard-nav-item .nav-link[data-tab="${currentHash}"]`);
    if (activeLink) activeLink.click();
  }
}

/**
 * 2. Interactive Lesson Booking Wizard
 */
function initBookingWizard() {
  const wizardSteps = document.querySelectorAll('.wizard-step-node');
  const wizardPanels = document.querySelectorAll('.wizard-panel');
  const nextBtns = document.querySelectorAll('.btn-wizard-next');
  const prevBtns = document.querySelectorAll('.btn-wizard-prev');
  let currentStep = 1;

  // Selection state object
  const bookingState = {
    course: 'Class B - Standard 4-Wheeler Car Training',
    instructor: 'Marcus Vance (Senior Instructor)',
    date: 'Tomorrow, Oct 14',
    time: '10:00 AM - 12:00 PM',
    vehicle: 'Dual-Control Toyota Corolla (Auto)'
  };

  // Slot chip selection
  const slotChips = document.querySelectorAll('.slot-chip:not(.unavailable)');
  slotChips.forEach(chip => {
    chip.addEventListener('click', () => {
      slotChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      bookingState.time = chip.getAttribute('data-time') || chip.innerText.trim();
      updateBookingSummary();
    });
  });

  // Vehicle option cards
  const vehicleCards = document.querySelectorAll('.wizard-vehicle-card');
  vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
      vehicleCards.forEach(c => c.classList.remove('border-primary', 'bg-primary-light'));
      card.classList.add('border-primary', 'bg-primary-light');
      bookingState.vehicle = card.getAttribute('data-vehicle') || card.querySelector('h6').innerText;
      updateBookingSummary();
    });
  });

  // Instructor option radio/cards
  const instructorRadios = document.querySelectorAll('input[name="bookingInstructor"]');
  instructorRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      bookingState.instructor = radio.value;
      updateBookingSummary();
    });
  });

  function updateBookingSummary() {
    const summaryCourse = document.getElementById('summaryCourse');
    const summaryInstructor = document.getElementById('summaryInstructor');
    const summaryTime = document.getElementById('summaryTime');
    const summaryVehicle = document.getElementById('summaryVehicle');

    if (summaryCourse) summaryCourse.innerText = bookingState.course;
    if (summaryInstructor) summaryInstructor.innerText = bookingState.instructor;
    if (summaryTime) summaryTime.innerText = `${bookingState.date} @ ${bookingState.time}`;
    if (summaryVehicle) summaryVehicle.innerText = bookingState.vehicle;
  }

  function goToStep(step) {
    currentStep = step;
    wizardSteps.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx + 1 < currentStep) node.classList.add('completed');
      if (idx + 1 === currentStep) node.classList.add('active');
    });

    wizardPanels.forEach((panel, idx) => {
      panel.style.display = (idx + 1 === currentStep) ? 'block' : 'none';
    });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < wizardPanels.length) {
        goToStep(currentStep + 1);
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  // Confirm booking button
  const confirmBtn = document.getElementById('btnConfirmBooking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Confirming Lesson...`;

      setTimeout(() => {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<i class="bi bi-check2-circle"></i> Book Lesson Slot`;
        
        // Show success notification & reset to overview
        if (typeof showToast === 'function') {
          showToast('Lesson slot booked successfully! Added to your schedule.', 'success');
        }

        // Navigate to My Lessons tab
        const myLessonsTab = document.querySelector('.dashboard-nav-item .nav-link[data-tab="lessons"]');
        if (myLessonsTab) myLessonsTab.click();
        goToStep(1);
      }, 1200);
    });
  }
}

/**
 * 3. My Lessons Filtering (Upcoming, Completed, Cancelled)
 */
function initLessonsFilter() {
  const filterBtns = document.querySelectorAll('.lesson-status-filter');
  const lessonRows = document.querySelectorAll('.lesson-item-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline-secondary');

      const filter = btn.getAttribute('data-status');

      lessonRows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Printable Progress Report
 */
function initPrintReport() {
  const printBtns = document.querySelectorAll('.btn-print-report');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}

/**
 * 5. Profile & Settings Form
 */
function initProfileForm() {
  const profileForm = document.getElementById('studentProfileForm');
  if (!profileForm) return;

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const saveBtn = profileForm.querySelector('button[type="submit"]');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Saving Changes...`;
    }

    setTimeout(() => {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="bi bi-check-lg"></i> Save Profile Settings`;
      }
      if (typeof showToast === 'function') {
        showToast('Profile and training preferences updated successfully.', 'success');
      }
    }, 800);
  });
}

/**
 * 6. Interactive Action Handlers (Reschedule, Cancel, Book Next)
 */
function initDashboardActionButtons() {
  // Reschedule buttons
  document.querySelectorAll('.btn-reschedule-lesson').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookingTab = document.querySelector('.dashboard-nav-item .nav-link[data-tab="booking"]');
      if (bookingTab) {
        bookingTab.click();
        if (typeof showToast === 'function') {
          showToast('Select a new date and time slot to reschedule your lesson.', 'info');
        }
      }
    });
  });

  // Cancel lesson buttons
  document.querySelectorAll('.btn-cancel-lesson').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to cancel this scheduled driving lesson?')) {
        const row = btn.closest('.lesson-item-row');
        if (row) {
          row.setAttribute('data-status', 'cancelled');
          const badge = row.querySelector('.badge-apex');
          if (badge) {
            badge.className = 'badge-apex badge-secondary';
            badge.innerText = 'Cancelled';
          }
          btn.style.display = 'none';
        }
        if (typeof showToast === 'function') {
          showToast('Lesson has been cancelled. Your training hours have been credited.', 'info');
        }
      }
    });
  });

  // Book next lesson CTA
  document.querySelectorAll('[data-action="book-next"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const bookingTab = document.querySelector('.dashboard-nav-item .nav-link[data-tab="booking"]');
      if (bookingTab) bookingTab.click();
    });
  });
}
