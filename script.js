/**
 * Portfolio Website - Interactive Features
 * =========================================
 * - Smooth scrolling for navigation links
 * - Active navbar link highlighting
 * - Scroll animations (fade-in elements)
 * - Mobile navigation toggle
 * - Header scroll effect
 * - Typing effect for hero section
 * - Social card interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initSmoothScroll();
    initActiveNavLinks();
    initScrollAnimations();
    initMobileNav();
    initHeaderScroll();
    initTypingEffect();
    initSocialCards();
    initWorkCards();
});

/**
 * Smooth Scrolling for Navigation Links
 * =====================================
 * Enables smooth scrolling when clicking on navigation links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            }
        });
    });
    
    // Logo click - scroll to top
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Active Navigation Link Highlighting
 * ===================================
 * Highlights the current section's nav link based on scroll position
 */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Scroll Animations
 * =================
 * Adds fade-in animation to elements when they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.skill-card, .work-card, .section-title, .work-header, .contact-title, ' +
        '.contact-button, .about-content, .social-card, .about-tag, .upcoming-badge'
    );
    
    // Add fade-in class to all animated elements
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Mobile Navigation Toggle
 * ========================
 * Handles the mobile menu open/close functionality
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

/**
 * Close Mobile Menu
 * =================
 * Helper function to close the mobile navigation menu
 */
function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Header Scroll Effect
 * ====================
 * Adds a shadow to the header when scrolling down
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class based on scroll position
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }
}

/**
 * Typing Effect
 * =============
 * Creates a typing animation for the hero name
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let charIndex = 0;
        const typingSpeed = 100; // milliseconds per character
        const startDelay = 500; // delay before typing starts
        
        setTimeout(() => {
            const typeChar = () => {
                if (charIndex < text.length) {
                    typingElement.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                }
            };
            
            typeChar();
        }, startDelay);
    }
}

/**
 * Social Cards Interaction
 * ========================
 * Adds hover effects and click tracking for social cards
 */
function initSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle scale effect
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Track clicks (optional analytics)
        card.addEventListener('click', (e) => {
            const platform = card.querySelector('.social-name')?.textContent;
            console.log(`Opening ${platform} profile`);
        });
    });
}

/**
 * Work Cards Interaction
 * ======================
 * Adds click handlers for work cards
 */
function initWorkCards() {
    const workCards = document.querySelectorAll('.work-card');
    
    workCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add a subtle click animation
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Log the project name
            const projectName = card.querySelector('.work-name')?.textContent;
            console.log(`Clicked on project: ${projectName}`);
            
            // Here you could add modal opening or navigation logic
            // For example: window.open(projectUrl, '_blank');
        });
    });
}

/**
 * Skill Card Interactions
 * =======================
 * Adds hover effects for skill cards
 */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Could add sound effects or other interactions here
    });
});

/**
 * Contact Button Interaction
 * ==========================
 * Adds a ripple effect to the contact button
 */
document.querySelectorAll('.contact-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * About Tags Animation
 * ====================
 * Staggered animation for about tags
 */
document.querySelectorAll('.about-tag').forEach((tag, index) => {
    tag.style.transitionDelay = `${index * 0.1}s`;
});

/**
 * Performance: Debounce function
 * ==============================
 * Utility function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Performance: Throttle function
 * ==============================
 * Utility function for limiting function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSmoothScroll,
        initActiveNavLinks,
        initScrollAnimations,
        initMobileNav,
        initHeaderScroll,
        initTypingEffect,
        initSocialCards,
        initWorkCards,
        debounce,
        throttle
    };
}
