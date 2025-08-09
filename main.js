import './style.css'

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const contactForm = document.getElementById('contact-form');
const contactCtaBtn = document.getElementById('contact-cta-btn');

// Modal elements (will be created dynamically if needed)
let modal = null;
let modalClose = null;

/**
 * Mobile Navigation Handler
 * Toggles mobile menu and handles outside clicks
 */
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // Close mobile menu when clicking nav links
  navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

/**
 * Navbar Scroll Effects
 * Adds scroll-based styling and hide/show behavior
 */
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (navbar) {
    // Add scrolled class for styling
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide navbar on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }
  
  lastScrollY = currentScrollY;
});

/**
 * Demo Video Handler - Commented out for YouTube embed
 */
/*
const videoOverlay = document.getElementById('video-overlay');
const playButton = document.getElementById('play-button');
const demoVideo = document.querySelector('.demo-video');

if (playButton && demoVideo) {
  playButton.addEventListener('click', () => {
    demoVideo.play();
    videoOverlay.style.display = 'none';
  });
}

// Show overlay again when video ends
if (demoVideo) {
  demoVideo.addEventListener('ended', () => {
    videoOverlay.style.display = 'flex';
  });
  
  demoVideo.addEventListener('pause', () => {
    videoOverlay.style.display = 'flex';
  });
}
*/

/**
 * Feature Demo Controls
 */
const featureDemos = document.querySelectorAll('.feature-card');

featureDemos.forEach(card => {
  const playBtn = card.querySelector('.play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // Simulate demo playback
      playBtn.textContent = '⏸';
      const progressBar = card.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.animation = 'progress 10s linear forwards';
      }
      
      setTimeout(() => {
        playBtn.textContent = '▶';
        if (progressBar) {
          progressBar.style.animation = 'none';
          progressBar.style.width = '0%';
        }
      }, 10000);
    });
  }
});

/**
 * Smooth Scrolling for Navigation Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Contact Form Handling
 */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'clinicName'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Scheduling Demo...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      showNotification('Demo scheduled! We\'ll contact you within 24 hours.', 'success');
      contactForm.reset();
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

/**
 * Contact CTA Button Handler
 */
if (contactCtaBtn) {
  contactCtaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Scroll to contact form
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const bgColor = type === 'success' ? '#10b981' : 
                  type === 'error' ? '#ef4444' : 
                  '#6366f1';
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Scroll Animations
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

/**
 * Initialize Animations
 */
document.addEventListener('DOMContentLoaded', () => {
  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    '.feature-card, .benefit-item, .pricing-card, .testimonial-card, .step-card'
  );
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

/**
 * Page Load Animations
 */
window.addEventListener('load', () => {
  // Animate hero elements
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');
  
  setTimeout(() => {
    if (heroTitle) heroTitle.style.animation = 'slideInUp 0.8s ease forwards';
  }, 200);
  
  setTimeout(() => {
    if (heroSubtitle) heroCta.style.animation = 'slideInUp 0.8s ease forwards';
  }, 400);
  
  setTimeout(() => {
    if (heroCta) heroCta.style.animation = 'slideInUp 0.8s ease forwards';
  }, 600);
});

/**
 * VAPI Widget Integration
 * Connect the purple wave button to trigger the VAPI widget
 */
document.addEventListener('DOMContentLoaded', () => {
  const voiceWaveBtn = document.getElementById('voice-wave-btn');
  
  if (voiceWaveBtn) {
    console.log('Voice wave button found:', voiceWaveBtn);
    
    voiceWaveBtn.addEventListener('click', () => {
      console.log('Voice wave button clicked!');
      
      // Add active state to button
      voiceWaveBtn.classList.add('active');
      
      // Trigger the VAPI functionality
      if (window.vapiTrigger && typeof window.vapiTrigger === 'function') {
        console.log('Triggering VAPI via global function');
        window.vapiTrigger();
      } else {
        // Fallback: try clicking the floating button directly
        setTimeout(() => {
          const vapiButton = document.getElementById('vapi-floating-button');
          if (vapiButton) {
            console.log('Clicking VAPI floating button directly');
            vapiButton.click();
          } else {
            console.log('VAPI button not found yet, waiting...');
          }
        }, 100);
      }
      
      // Remove active state after animation
      setTimeout(() => {
        voiceWaveBtn.classList.remove('active');
      }, 300);
    });
    
    // Add hover effects
    voiceWaveBtn.addEventListener('mouseenter', () => {
      voiceWaveBtn.classList.add('hover');
    });
    
    voiceWaveBtn.addEventListener('mouseleave', () => {
      voiceWaveBtn.classList.remove('hover');
    });
  } else {
    console.log('Voice wave button not found! Looking for element with ID: voice-wave-btn');
  }
});

console.log('Pawsistant main.js loaded successfully');
