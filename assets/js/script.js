/*eslint-env es6*/
var document;

// Function to initialize all modal triggers and event listeners
function initializeModalSystem() {
  // Select all elements that need to be clickable
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const externalLinkTriggers = document.querySelectorAll('[data-external-link]');
  const closeModalButtons = document.querySelectorAll('[data-close-button]');
  const overlay = document.getElementById('overlay');

  // Add click events to modal triggers (works that open modals)
  modalTriggers.forEach(trigger => {
    // Remove existing event listeners to prevent duplicates
    trigger.removeEventListener('click', handleModalTriggerClick);
    // Add new event listener
    trigger.addEventListener('click', handleModalTriggerClick);
  });

  // Add click events to external link triggers (works that link to external sites)
  externalLinkTriggers.forEach(trigger => {
    // Remove existing event listeners to prevent duplicates
    trigger.removeEventListener('click', handleExternalLinkClick);
    // Add new event listener
    trigger.addEventListener('click', handleExternalLinkClick);
  });

  // Close modal when clicking overlay
  if (overlay) {
    overlay.removeEventListener('click', handleOverlayClick);
    overlay.addEventListener('click', handleOverlayClick);
  }

  // Close modal when clicking close button
  closeModalButtons.forEach(button => {
    button.removeEventListener('click', handleCloseButtonClick);
    button.addEventListener('click', handleCloseButtonClick);
  });
}

// Handler functions for event listeners
function handleModalTriggerClick() {
  const modal = document.querySelector(this.dataset.modalTarget);
  openModal(modal);
}

function handleExternalLinkClick() {
  window.open(this.dataset.externalLink, '_blank');
}

function handleOverlayClick() {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => {
    closeModal(modal);
  });
}

function handleCloseButtonClick() {
  const modal = this.closest('.modal');
  closeModal(modal);
}

// Function to open modal
function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('modal-open');
  // Always scroll modal content to top on open
  modal.scrollTop = 0;
  const body = modal.querySelector('.modal-body, .modal-info');
  if (body) body.scrollTop = 0;
}

// Function to close modal
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// ===== WORKS FILTER TABS =====
function initializeFilters() {
  const filterBtns = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.works__img[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('filter-active'));
      this.classList.add('filter-active');

      workCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          // Show: unhide first, then fade in
          card.style.display = '';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => { card.style.opacity = '1'; });
          });
        } else {
          // Hide: fade out first, then remove from layout
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ===== CAROUSEL =====
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(function(carousel) {
    var track = carousel.querySelector('.carousel__track');
    var slides = carousel.querySelectorAll('.carousel__slide');
    var dots = carousel.querySelectorAll('.carousel__dot');
    var current = 0;

    function goTo(index) {
      current = ((index % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    var prevBtn = carousel.querySelector('.carousel__btn--prev');
    var nextBtn = carousel.querySelector('.carousel__btn--next');
    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goTo(i); });
    });

    goTo(0);
  });
}

// Initialize the modal system when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeModalSystem();
  initializeFilters();
  initCarousels();
});

// Initialize immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeModalSystem();
  initializeFilters();
  initCarousels();
}