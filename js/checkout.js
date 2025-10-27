// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    checkAuthentication();
    
    // Initialize checkout page
    initializeCheckout();
    
    // Set minimum delivery date to tomorrow
    setMinimumDeliveryDate();
    
    // Format phone input
    formatPhoneInput();
    
    // Handle form submission
    handleFormSubmission();
});

function initializeCheckout() {
    // Load cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || 
                     JSON.parse(localStorage.getItem('equaline_cart')) || [];
    
    if (cartItems.length === 0) {
        // Redirect to catalog if cart is empty
        window.location.href = 'catalog.html';
        return;
    }
    
    // Display cart items
    displayCartItems(cartItems);
    
    // Calculate totals
    calculateTotals(cartItems);
}

// Authentication check function
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('equaline_user') || 'null');
    
    if (!currentUser) {
        // User is not logged in - show auth required modal
        showAuthRequiredModal();
        return false;
    }
    
    // User is logged in - auto-fill form data
    autoFillUserData(currentUser);
    return true;
}

// Show modal requiring authentication
function showAuthRequiredModal() {
    // Create modal HTML
    const modalHTML = `
        <div id="authRequiredModal" class="modal open" aria-hidden="false" role="dialog" aria-modal="true">
            <div class="modal__dialog auth-required-modal">
                <button class="modal__close" data-close-modal>×</button>
                <div class="auth-required-content">
                    <div class="auth-icon">🔒</div>
                    <h3>Требуется авторизация</h3>
                    <p>Для оформления заказа необходимо войти в аккаунт или зарегистрироваться.</p>
                    <p class="auth-subtitle">Без аккаунта заказ сделать нельзя.</p>
                    <div class="auth-actions">
                        <button class="btn btn-primary" onclick="openLoginModal()">Войти</button>
                        <button class="btn btn-secondary" onclick="openRegisterModal()">Регистрация</button>
                        <button class="btn btn-outline" onclick="goToCatalog()">Вернуться в каталог</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Block form
    blockCheckoutForm();
}

// Auto-fill user data
function autoFillUserData(user) {
    const nameField = document.getElementById('customerName');
    const emailField = document.getElementById('customerEmail');
    const phoneField = document.getElementById('customerPhone');
    
    if (nameField && user.name) {
        nameField.value = user.name;
        nameField.disabled = true; // Disable editing of auto-filled data
        nameField.style.backgroundColor = '#f5f5f5';
    }
    
    if (emailField && user.email) {
        emailField.value = user.email;
        emailField.disabled = true;
        emailField.style.backgroundColor = '#f5f5f5';
    }
    
    if (phoneField && user.phone) {
        // Format phone number to match expected format
        const formattedPhone = formatPhoneNumber(user.phone);
        phoneField.value = formattedPhone;
        phoneField.disabled = true;
        phoneField.style.backgroundColor = '#f5f5f5';
    }
}

// Block checkout form for non-authenticated users
function blockCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'checkout-overlay';
    overlay.innerHTML = `
        <div class="overlay-content">
            <div class="overlay-icon">🔒</div>
            <h3>Требуется авторизация</h3>
            <p>Войдите в аккаунт для оформления заказа</p>
        </div>
    `;
    
    // Make form container relative positioned
    const formContainer = form.closest('.checkout-form-container');
    if (formContainer) {
        formContainer.style.position = 'relative';
        formContainer.appendChild(overlay);
    }
    
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

// Helper functions for modal actions
function openLoginModal() {
    // Close auth required modal
    const authModal = document.getElementById('authRequiredModal');
    if (authModal) {
        authModal.remove();
        document.body.style.overflow = '';
    }
    
    // Open login modal (reuse existing modal system)
    const loginModal = document.getElementById('modal-login');
    if (loginModal) {
        loginModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function openRegisterModal() {
    // Close auth required modal
    const authModal = document.getElementById('authRequiredModal');
    if (authModal) {
        authModal.remove();
        document.body.style.overflow = '';
    }
    
    // Open register modal
    const registerModal = document.getElementById('modal-register');
    if (registerModal) {
        registerModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function goToCatalog() {
    window.location.href = 'catalog.html';
}

// Format phone number to match expected format
function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If starts with 8, replace with 7
    if (cleaned.startsWith('8')) {
        cleaned = '7' + cleaned.substring(1);
    }
    
    // If doesn't start with 7, add it
    if (!cleaned.startsWith('7')) {
        cleaned = '7' + cleaned;
    }
    
    // Ensure we have exactly 11 digits
    if (cleaned.length > 11) {
        cleaned = cleaned.substring(0, 11);
    }
    
    // Format as +7 (XXX) XXX-XX-XX
    if (cleaned.length === 11) {
        return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    return phone; // Return original if can't format
}

function displayCartItems(cartItems) {
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                ${item.name.charAt(0)}
            </div>
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-details">
                    ${item.quantity} шт. × ${item.price} ₽
                </div>
            </div>
            <div class="order-item-price">
                ${(item.quantity * item.price).toLocaleString()} ₽
            </div>
        </div>
    `).join('');
}

function calculateTotals(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const delivery = 0; // Free delivery
    const total = subtotal + delivery;
    
    // Update totals in UI
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal.toLocaleString()} ₽`;
    }
    
    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString()} ₽`;
    }
}

function setMinimumDeliveryDate() {
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (!deliveryDateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    deliveryDateInput.min = minDate;
    deliveryDateInput.value = minDate;
}

function formatPhoneInput() {
    const phoneInput = document.getElementById('customerPhone');
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

function handleFormSubmission() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = getFormData();
        
        // Process order
        processOrder(formData);
    });
}

function validateForm() {
    const requiredFields = [
        'customerName',
        'customerPhone',
        'deliveryAddress',
        'deliveryDate',
        'deliveryTime',
        'agreeTerms'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                showFieldError(field, 'Необходимо согласие с условиями');
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Это поле обязательно для заполнения');
            }
        }
    });
    
    // Validate phone format
    const phoneField = document.getElementById('customerPhone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phoneField.value)) {
            isValid = false;
            showFieldError(phoneField, 'Введите корректный номер телефона');
        }
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
    
    // Add error styling
    field.style.borderColor = '#e74c3c';
    
    // Remove error styling on input
    field.addEventListener('input', function() {
        field.style.borderColor = '#e0e0e0';
        if (existingError) {
            existingError.remove();
        }
    }, { once: true });
}

function getFormData() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    const data = {
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        delivery: {
            address: formData.get('address'),
            date: formData.get('deliveryDate'),
            time: formData.get('deliveryTime'),
            notes: formData.get('notes')
        },
        payment: {
            method: formData.get('paymentMethod')
        },
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        timestamp: new Date().toISOString()
    };
    
    return data;
}

function processOrder(orderData) {
    // Show loading state
    const submitButton = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Обработка...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'EQ' + Date.now().toString().slice(-6);
        
        // Save order to localStorage (in real app, send to server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
            ...orderData,
            orderNumber: orderNumber,
            status: 'pending'
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cartItems');
        localStorage.removeItem('equaline_cart');
        
        // Show success modal
        showSuccessModal(orderNumber);
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
    }, 2000);
}

function showSuccessModal(orderNumber) {
    const modal = document.getElementById('orderSuccessModal');
    const orderNumberSpan = document.getElementById('orderNumber');
    
    if (orderNumberSpan) {
        orderNumberSpan.textContent = orderNumber;
    }
    
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Modal functionality
document.addEventListener('click', function(e) {
    if (e.target.matches('[data-close-modal]')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
            openModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
});

// Handle successful login/register
function handleAuthSuccess() {
    // Close any open modals
    const loginModal = document.getElementById('modal-login');
    const registerModal = document.getElementById('modal-register');
    const authModal = document.getElementById('authRequiredModal');
    
    if (loginModal) loginModal.classList.remove('open');
    if (registerModal) registerModal.classList.remove('open');
    if (authModal) authModal.remove();
    
    document.body.style.overflow = '';
    
    // Remove overlay and unblock form
    unblockCheckoutForm();
    
    // Auto-fill user data
    const currentUser = JSON.parse(localStorage.getItem('equaline_user') || 'null');
    if (currentUser) {
        autoFillUserData(currentUser);
    }
}

// Unblock checkout form
function unblockCheckoutForm() {
    const overlay = document.querySelector('.checkout-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    
    // Enable all form inputs
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// Listen for auth success events
document.addEventListener('authSuccess', handleAuthSuccess);

// Add field error styles and auth modal styles
const style = document.createElement('style');
style.textContent = `
    .field-error {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    }
    
    .modal.open {
        display: flex;
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
        align-items: center;
        justify-content: center;
    }
    
    .modal__dialog {
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }
    
    .modal__close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal__close:hover {
        color: #333;
    }
    
    /* Auth Required Modal Styles */
    .auth-required-modal {
        max-width: 400px;
        text-align: center;
    }
    
    .auth-required-content {
        padding: 20px 0;
    }
    
    .auth-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .auth-required-content h3 {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 24px;
    }
    
    .auth-required-content p {
        margin: 0 0 10px 0;
        color: #666;
        line-height: 1.5;
    }
    
    .auth-subtitle {
        font-weight: 600;
        color: #e74c3c;
        margin-bottom: 25px !important;
    }
    
    .auth-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .auth-actions .btn {
        width: 100%;
        padding: 12px 20px;
        border-radius: 8px;
        border: none;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .auth-actions .btn-primary {
        background: #007bff;
        color: white;
    }
    
    .auth-actions .btn-primary:hover {
        background: #0056b3;
    }
    
    .auth-actions .btn-secondary {
        background: #6c757d;
        color: white;
    }
    
    .auth-actions .btn-secondary:hover {
        background: #545b62;
    }
    
    .auth-actions .btn-outline {
        background: transparent;
        color: #007bff;
        border: 2px solid #007bff;
    }
    
    .auth-actions .btn-outline:hover {
        background: #007bff;
        color: white;
    }
    
    /* Checkout Overlay Styles */
    .checkout-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        border-radius: 12px;
    }
    
    .overlay-content {
        text-align: center;
        padding: 40px 20px;
    }
    
    .overlay-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .overlay-content h3 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 20px;
    }
    
    .overlay-content p {
        margin: 0;
        color: #666;
        font-size: 16px;
    }
    
    /* Auto-filled field styles */
    input[disabled] {
        background-color: #f5f5f5 !important;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
