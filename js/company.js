// Company Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize company page functionality
    initCompanyPage();
});

function initCompanyPage() {
    // Initialize video functionality
    initVideoPlayer();
    
    // Initialize certificate functionality
    initCertificateModal();
    
    // Initialize add certificate functionality
    initAddCertificate();
    
    // Initialize animations
    initAnimations();
    
    // Initialize stats counter
    initStatsCounter();
}

// Video Player Functionality
function initVideoPlayer() {
    const videoPlayer = document.querySelector('.company-video__player');
    const playBtn = document.querySelector('.video-play-btn');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (!videoPlayer || !playBtn) return;
    
    // Play button click
    playBtn.addEventListener('click', function() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            videoOverlay.style.opacity = '0';
        } else {
            videoPlayer.pause();
            videoOverlay.style.opacity = '1';
        }
    });
    
    // Video click to play/pause
    videoPlayer.addEventListener('click', function() {
        if (videoPlayer.paused) {
            videoPlayer.play();
            videoOverlay.style.opacity = '0';
        } else {
            videoPlayer.pause();
            videoOverlay.style.opacity = '1';
        }
    });
    
    // Show overlay when video ends
    videoPlayer.addEventListener('ended', function() {
        videoOverlay.style.opacity = '1';
    });
    
    // Show overlay when video is paused
    videoPlayer.addEventListener('pause', function() {
        videoOverlay.style.opacity = '1';
    });
    
    // Hide overlay when video is playing
    videoPlayer.addEventListener('play', function() {
        videoOverlay.style.opacity = '0';
    });
}

// Certificate Modal Functionality
function initCertificateModal() {
    const certificateModal = document.getElementById('certificate-modal');
    const certificateImage = document.getElementById('certificate-image');
    const zoomButtons = document.querySelectorAll('.certificate-zoom');
    const closeModal = certificateModal?.querySelector('[data-close-modal]');
    
    if (!certificateModal || !certificateImage) return;
    
    // Zoom button clicks
    zoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const certificateItem = this.closest('.certificate-item');
            const img = certificateItem.querySelector('img');
            
            if (img && img.src) {
                certificateImage.src = img.src;
                certificateImage.alt = img.alt || 'Сертификат';
                openModal(certificateModal);
            } else {
                // For placeholder certificates
                showNotification('Сертификат пока не загружен', 'info');
            }
        });
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => closeModal(certificateModal));
    }
    
    // Close modal on backdrop click
    certificateModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(certificateModal);
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certificateModal.classList.contains('open')) {
            closeModal(certificateModal);
        }
    });
}

// Add Certificate Functionality
function initAddCertificate() {
    const addCertificateBtn = document.querySelector('.certificate-add-btn');
    const addCertificateItem = document.querySelector('.add-certificate');
    
    if (!addCertificateBtn || !addCertificateItem) return;
    
    addCertificateBtn.addEventListener('click', function() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showNotification('Пожалуйста, выберите изображение', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Размер файла не должен превышать 5MB', 'error');
                    return;
                }
                
                // Create FileReader to preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    addNewCertificate(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
}

// Add New Certificate Function
function addNewCertificate(imageSrc, fileName) {
    const certificatesGrid = document.querySelector('.certificates-grid');
    const addCertificateItem = document.querySelector('.add-certificate');
    
    if (!certificatesGrid || !addCertificateItem) return;
    
    // Create new certificate item
    const newCertificate = document.createElement('div');
    newCertificate.className = 'certificate-item';
    newCertificate.innerHTML = `
        <div class="certificate-image">
            <img src="${imageSrc}" alt="${fileName}" />
            <div class="certificate-overlay">
                <button class="certificate-zoom" aria-label="Увеличить">🔍</button>
            </div>
        </div>
        <h3>Новый сертификат</h3>
        <p>Загружен: ${new Date().toLocaleDateString('ru-RU')}</p>
    `;
    
    // Insert before the add certificate item
    certificatesGrid.insertBefore(newCertificate, addCertificateItem);
    
    // Re-initialize certificate modal for new item
    initCertificateModal();
    
    // Show success notification
    showNotification('Сертификат успешно добавлен!', 'success');
    
    // Add animation
    newCertificate.style.opacity = '0';
    newCertificate.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        newCertificate.style.transition = 'all 0.6s ease-out';
        newCertificate.style.opacity = '1';
        newCertificate.style.transform = 'translateY(0)';
    }, 100);
}

// Animation on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.value-card, .certificate-item, .achievement-item, .stat-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animate Counter Function
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasSlash = text.includes('/');
    
    let finalNumber;
    let suffix = '';
    
    if (hasPlus) {
        finalNumber = parseInt(text.replace(/[^\d]/g, ''));
        suffix = '+';
    } else if (hasSlash) {
        finalNumber = parseInt(text.replace(/[^\d]/g, ''));
        suffix = '/7';
    } else {
        finalNumber = parseInt(text);
    }
    
    let currentNumber = 0;
    const increment = finalNumber / 50;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            currentNumber = finalNumber;
            clearInterval(timer);
        }
        
        if (hasPlus) {
            element.textContent = Math.floor(currentNumber).toLocaleString('ru-RU') + suffix;
        } else if (hasSlash) {
            element.textContent = Math.floor(currentNumber) + suffix;
        } else {
            element.textContent = Math.floor(currentNumber);
        }
    }, 50);
}

// Modal Functions
function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Notification Function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрыть">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Montserrat', sans-serif;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Water Drop Animation Enhancement
function initWaterDropAnimation() {
    const waterDrop = document.querySelector('.water-drop');
    if (!waterDrop) return;
    
    // Add click animation
    waterDrop.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'float 3s ease-in-out infinite';
        }, 100);
    });
    
    // Add hover effect
    waterDrop.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    waterDrop.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize water drop animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWaterDropAnimation();
});

// Export functions for potential external use
window.CompanyPage = {
    initCompanyPage,
    addNewCertificate,
    showNotification
};
