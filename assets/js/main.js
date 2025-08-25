/*eslint-env es6*/


/*===== MENU SHOW Y HIDDEN =====*/
var document;
var window;
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
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
