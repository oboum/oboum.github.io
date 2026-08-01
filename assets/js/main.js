/*eslint-env es6*/

/*===== MENU SHOW Y HIDDEN =====*/
var sectionId;

const navMenu = document.getElementById('nav-menu'),
    toggleMenu = document.getElementById('nav-toggle'),
    closeMenu = document.getElementById('nav-close')

// SHOW
toggleMenu.addEventListener('click', ()=>{
    navMenu.classList.toggle('show')
})

// HIDDEN
closeMenu.addEventListener('click', ()=>{
    navMenu.classList.remove('show')
})

/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction(){
  /*Remove menu mobile*/
  navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*===== CV DOWNLOAD BUTTON ANIMATION =====*/
document.addEventListener('DOMContentLoaded', function() {
    const cvButton = document.querySelector('.home__button');

    if (cvButton) {
        // Create a container for particles
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        cvButton.appendChild(particlesContainer);

        // Colors for particles
        const colors = [
            '#4CA4FC', // Light blue
            '#486F9E', // Medium blue
            '#3E4756', // Dark blue
            '#EAE7E6', // Light gray
            '#FFFAFA', // White
            '#FFD700', // Gold
            '#FF6B6B', // Coral
            '#7FFFD4'  // Aquamarine
        ];

        // Particle shapes
        const shapes = ['circle', 'triangle', 'square', 'star'];

        // Create initial set of particles
        createInitialParticles(particlesContainer, colors, shapes);

        // Hover effect - create particles
        cvButton.addEventListener('mouseenter', function() {
            animateParticles(particlesContainer, colors, shapes);
        });

        // Click effect - burst of particles
        cvButton.addEventListener('click', function(e) {
            createClickBurst(e, colors, shapes);
        });
    }

    // Create initial decorative particles
    function createInitialParticles(container, colors, shapes) {
        // Create 15 static particles positioned around the button
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            const size = Math.floor(Math.random() * 8) + 4; // 4-12px
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            particle.className = `particle particle--${shape}`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Position randomly around the button
            const posX = Math.random() * 120 - 10; // -10% to 110% of button width
            const posY = Math.random() * 120 - 10; // -10% to 110% of button height

            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = '0.6';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(particle);
        }
    }

    // Animate particles on hover
    function animateParticles(container, colors, shapes) {
        // Create 20 animated particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (!document.body.contains(container)) return; // Safety check

                const particle = document.createElement('div');
                const size = Math.floor(Math.random() * 10) + 5; // 5-15px
                const shape = shapes[Math.floor(Math.random() * shapes.length)];

                particle.className = `particle particle--${shape}`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

                // Start from edge positions
                const edgePosition = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
                let posX, posY;

                switch (edgePosition) {
                    case 0: // top
                        posX = Math.random() * 100;
                        posY = -10;
                        break;
                    case 1: // right
                        posX = 110;
                        posY = Math.random() * 100;
                        break;
                    case 2: // bottom
                        posX = Math.random() * 100;
                        posY = 110;
                        break;
                    case 3: // left
                        posX = -10;
                        posY = Math.random() * 100;
                        break;
                }

                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;

                // Choose animation direction
                let animationName;
                if (edgePosition === 0) animationName = 'float-down';
                else if (edgePosition === 1) animationName = 'float-left';
                else if (edgePosition === 2) animationName = 'float-up';
                else animationName = 'float-right';

                // Apply animation
                particle.style.animation = `${animationName} ${Math.random() * 2 + 2}s ease-out forwards`;

                container.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode === container) {
                        container.removeChild(particle);
                    }
                }, 4000);

            }, i * 100); // Stagger particle creation
        }
    }

    // Create burst of particles on click
    function createClickBurst(e, colors, shapes) {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create 30 particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.floor(Math.random() * 12) + 5; // 5-17px
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            particle.className = `particle particle--${shape}`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.position = 'fixed';
            particle.style.top = `${centerY}px`;
            particle.style.left = `${centerX}px`;
            particle.style.zIndex = '9999';

            document.body.appendChild(particle);

            // Random direction and speed
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 150 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            // Animate with physics
            let posX = centerX;
            let posY = centerY;
            let opacity = 1;
            let scale = 1;
            const gravity = Math.random() * 0.4 + 0.2;
            const friction = 0.98;
            let velocityX = vx;
            let velocityY = vy;

            function animate() {
                if (opacity <= 0) {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                    return;
                }

                velocityX *= friction;
                velocityY *= friction;
                velocityY += gravity;

                posX += velocityX * 0.016; // Approx for 60fps
                posY += velocityY * 0.016;
                opacity -= 0.01;
                scale -= 0.003;

                if (scale < 0.5) scale = 0.5;

                particle.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${posX + posY}deg)`;
                particle.style.left = `${posX}px`;
                particle.style.top = `${posY}px`;
                particle.style.opacity = opacity;

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }
    }
});

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('nav-active')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('nav-active')
        }
    })
}

/*===== MODAL SYSTEM =====*/
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
