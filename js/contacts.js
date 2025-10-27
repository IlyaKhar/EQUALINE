// Contacts Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize map
    initializeMap();
    
    // Initialize FAQ
    initializeFAQ();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize phone formatting
    initializePhoneFormatting();
    
    // Initialize modals
    initializeModals();
    
    // Initialize back to top
    initializeBackToTop();
});

// Initialize Sidebar
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar__close');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            const isOpen = sidebar.classList.contains('open');
            sidebarToggle.setAttribute('aria-expanded', isOpen);
            sidebar.setAttribute('aria-hidden', !isOpen);
        });
    }
    
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                sidebarToggle.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        }
    });
    
    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        }
    });
}

// Initialize Leaflet Map
function initializeMap() {
    // Оренбург, пос. им. Куйбышева, ул. Ветеранов Труда, д. 15а
    // Примерные координаты (можете уточнить при необходимости)
    const coords = [51.8169, 55.1935];
    const map = L.map('map').setView(coords, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add custom marker
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                border: 3px solid white;
            ">
                📍
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Add marker to map
    L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">EquaLine</h3>
                <p style="margin: 0; color: #666;">
                    г. Оренбург, пос. им. Куйбышева,<br>
                    ул. Ветеранов Труда, д. 15а
                </p>
            </div>
        `)
        .openPopup();
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Simulate form submission
                submitContactForm(data);
            }
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('contactName', 'Введите корректное имя');
        isValid = false;
    }
    
    // Validate phone
    if (!data.phone || !isValidPhone(data.phone)) {
        showFieldError('contactPhone', 'Введите корректный номер телефона');
        isValid = false;
    }
    
    // Validate email (if provided)
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('contactEmail', 'Введите корректный email');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('contactMessage', 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    }
    
    return isValid;
}

// Submit contact form
function submitContactForm(data) {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Отправляем...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    // Create success modal
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>Сообщение отправлено!</h3>
            <p>Мы получили ваше сообщение и ответим в течение 2 часов.</p>
            <button class="btn-close-modal">Закрыть</button>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = modal.querySelector('.success-modal-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        margin: 1rem;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = modal.querySelector('.success-icon');
    icon.style.cssText = `
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        margin: 0 auto 1rem;
    `;
    
    const closeBtn = modal.querySelector('.btn-close-modal');
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
    `;
    
    // Add to page
    document.body.appendChild(modal);
    
    // Close modal handlers
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 5000);
}

// Initialize phone formatting
function initializePhoneFormatting() {
    const phoneInput = document.getElementById('contactPhone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Если начинается не с 7, добавляем 7
        if (value.length > 0 && value[0] !== '7') {
            value = '7' + value;
        }
        
        // Ограничиваем длину до 11 цифр (7 + 10 цифр)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Форматируем по мере ввода
        let formatted = '';
        if (value.length >= 1) {
            formatted = '+' + value.substring(0, 1);
        }
        if (value.length >= 2) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4);
        }
        if (value.length >= 5) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
        }
        if (value.length >= 8) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
            formatted = '+' + value.substring(0, 1) + ' (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
        }
        
        e.target.value = formatted;
    });
}

// Utility functions
function isValidPhone(phone) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    // Insert after field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearFormErrors() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(message => message.remove());
}

// Initialize Modals
function initializeModals() {
    // Modal open buttons
    const modalOpenButtons = document.querySelectorAll('[data-open-modal]');
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-open-modal');
            const modal = document.getElementById(`modal-${modalId}`);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Modal close buttons
    const modalCloseButtons = document.querySelectorAll('[data-close-modal]');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal on backdrop click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                activeModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }
    });

    // Handle callback form
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate form submission
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            callbackForm.reset();
            const modal = callbackForm.closest('.modal');
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }

    // Handle newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate form submission
            alert('Спасибо за подписку!');
            newsletterForm.reset();
            const modal = newsletterForm.closest('.modal');
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
}

// Initialize Back to Top
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('toTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(-20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }
    
    .modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal__dialog {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        position: relative;
    }
    
    .modal__close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        z-index: 100;
        transition: all 0.3s ease;
    }
    
    .to-top:hover {
        background: var(--accent-2);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
