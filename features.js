// Features Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeFeatureAnimations();
    setupDemoButtons();
    setupScrollAnimations();
});

// Initialize feature card animations
function initializeFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Setup demo button functionality
function setupDemoButtons() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoContainer = this.closest('.feature-demo');
            const progressBar = demoContainer.querySelector('.progress-bar');
            const timeDisplay = demoContainer.querySelector('.demo-time');
            
            // Toggle play/pause
            if (this.textContent === '▶') {
                startDemo(this, progressBar, timeDisplay);
            } else {
                pauseDemo(this, progressBar);
            }
        });
    });
}

function startDemo(button, progressBar, timeDisplay) {
    button.textContent = '⏸';
    button.style.background = 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
    
    // Get the duration from the time display
    const timeText = timeDisplay.textContent;
    const duration = parseTimeString(timeText.split(' / ')[1]);
    
    // Animate progress bar
    let startTime = Date.now();
    let currentTime = 0;
    
    const interval = setInterval(() => {
        currentTime = Date.now() - startTime;
        const progress = Math.min((currentTime / (duration * 1000)) * 100, 100);
        
        progressBar.style.width = progress + '%';
        updateTimeDisplay(timeDisplay, currentTime, duration);
        
        if (progress >= 100) {
            clearInterval(interval);
            resetDemo(button, progressBar, timeDisplay);
        }
    }, 100);
    
    // Store interval for pausing
    button.dataset.interval = interval;
}

function pauseDemo(button, progressBar) {
    button.textContent = '▶';
    button.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)';
    
    // Clear the interval
    if (button.dataset.interval) {
        clearInterval(button.dataset.interval);
        delete button.dataset.interval;
    }
}

function resetDemo(button, progressBar, timeDisplay) {
    button.textContent = '▶';
    button.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)';
    progressBar.style.width = '0%';
    
    // Reset time display
    const originalTime = timeDisplay.textContent.split(' / ')[1];
    timeDisplay.textContent = `0:00 / ${originalTime}`;
    
    // Clear interval reference
    if (button.dataset.interval) {
        clearInterval(button.dataset.interval);
        delete button.dataset.interval;
    }
}

function parseTimeString(timeStr) {
    const parts = timeStr.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
}

function updateTimeDisplay(timeDisplay, currentTimeMs, totalDuration) {
    const currentSeconds = Math.floor(currentTimeMs / 1000);
    const currentMinutes = Math.floor(currentSeconds / 60);
    const remainingSeconds = currentSeconds % 60;
    
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalRemainingSeconds = totalDuration % 60;
    
    const currentFormatted = `${currentMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    const totalFormatted = `${totalMinutes}:${totalRemainingSeconds.toString().padStart(2, '0')}`;
    
    timeDisplay.textContent = `${currentFormatted} / ${totalFormatted}`;
}

// Setup scroll animations for other sections
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.support-text, .analytics-text, .step, .cta-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Animate statistics counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isHours = target.includes('hrs');
        const numericValue = parseInt(target.replace(/[^\d]/g, ''));
        
        let current = 0;
        const increment = numericValue / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPercentage) {
                displayValue += '%';
            } else if (isHours) {
                displayValue += 'hrs+';
            }
            
            counter.textContent = displayValue;
        }, 20);
    });
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsContainers = document.querySelectorAll('.support-stats, .analytics-stats');
    statsContainers.forEach(container => {
        statsObserver.observe(container);
    });
});

// Add smooth scrolling for anchor links
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

// Mobile menu functionality (if needed)
function setupMobileMenu() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
}

// Initialize mobile menu on load
document.addEventListener('DOMContentLoaded', setupMobileMenu);
