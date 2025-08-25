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
}

// Function to close modal
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Initialize the modal system when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeModalSystem();
});

// Initialize immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeModalSystem();
}