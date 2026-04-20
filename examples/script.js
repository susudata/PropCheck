/**
 * PropCheck Landing Page - Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
});

/**
 * Navigation scroll effect
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            nav.style.boxShadow = '0 2px 20px rgba(107, 83, 64, 0.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Scroll animations for elements
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation class to sections
    const sections = document.querySelectorAll('.problem-grid, .features-grid, .pricing-grid, .steps');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Add animation to individual cards
    const cards = document.querySelectorAll('.problem-item, .feature-card, .pricing-card, .step');
    cards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            showNotification('error', 'Wypełnij wszystkie pola formularza.');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('error', 'Podaj prawidłowy adres email.');
            return;
        }
        
        // Simulate sending
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wysyłanie...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('success', 'Dziękujemy za wiadomość! Odpowiemy w ciągu 24 godzin.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show notification
 */
function showNotification(type, message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Zamknij">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#7A9E7A' : '#C45C3E'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add keyframe animations dynamically
 */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

/**
 * Pin hover effect on floorplan (visual enhancement)
 */
document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.3)';
        this.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
    });
    
    pin.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.filter = 'none';
    });
});

/**
 * Active nav link highlighting based on scroll position
 */
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

highlightActiveNavLink();
