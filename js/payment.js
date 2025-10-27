// Payment page functionality
class PaymentPageManager {
  constructor() {
    this.currentStep = 1;
    this.selectedMethod = null;
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.startAnimations();
    this.initializePaymentMethods();
  }
  
  setupEventListeners() {
    // Payment method cards
    const paymentCards = document.querySelectorAll('.payment-method-card');
    paymentCards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectPaymentMethod(card);
      });
      
      card.addEventListener('mouseenter', () => {
        this.highlightPaymentMethod(card);
      });
    });
    
    // Payment indicator dots
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    indicatorDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.switchIndicator(index);
      });
    });
    
    // Process steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        this.activateStep(index + 1);
      });
    });
    
    // Security features
    const securityFeatures = document.querySelectorAll('.security-feature');
    securityFeatures.forEach(feature => {
      feature.addEventListener('mouseenter', () => {
        this.animateSecurityFeature(feature);
      });
    });
  }
  
  startAnimations() {
    // Staggered animation for payment cards
    const cards = document.querySelectorAll('.payment-method-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
    
    // Animate process steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateX(0)';
      }, index * 300);
    });
    
    // Animate security features
    const securityFeatures = document.querySelectorAll('.security-feature');
    securityFeatures.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateX(0)';
      }, index * 200);
    });
  }
  
  initializePaymentMethods() {
    const paymentMethods = [
      {
        id: 'cards',
        name: 'Банковские карты',
        description: 'Visa, MasterCard, МИР',
        features: ['Безопасно', 'Быстро'],
        logos: ['VISA', 'MC', 'МИР']
      },
      {
        id: 'mobile',
        name: 'Мобильные платежи',
        description: 'Apple Pay, Google Pay, Samsung Pay',
        features: ['Удобно', 'Современно'],
        logos: ['🍎', 'G', 'S']
      },
      {
        id: 'bank',
        name: 'Банковский перевод',
        description: 'Для юридических лиц и крупных заказов',
        features: ['Надежно', 'Выгодно'],
        logos: ['СБ', 'ВТБ', 'АЛЬФА']
      },
      {
        id: 'cash',
        name: 'Наличные',
        description: 'При получении товара курьеру',
        features: ['Просто', 'Понятно'],
        logos: ['₽', '$', '€']
      }
    ];
    
    // Add click animations to payment cards
    paymentMethods.forEach((method, index) => {
      const card = document.querySelector(`[data-method="${method.id}"]`);
      if (card) {
        card.addEventListener('click', () => {
          this.animateCardClick(card);
        });
      }
    });
  }
  
  selectPaymentMethod(card) {
    // Remove active class from all cards
    document.querySelectorAll('.payment-method-card').forEach(c => {
      c.classList.remove('active');
    });
    
    // Add active class to selected card
    card.classList.add('active');
    this.selectedMethod = card.dataset.method;
    
    // Animate selection
    this.animateCardSelection(card);
    
    // Show payment details modal or redirect
    setTimeout(() => {
      this.showPaymentDetails(this.selectedMethod);
    }, 500);
  }
  
  highlightPaymentMethod(card) {
    // Add glow effect
    card.style.boxShadow = '0 15px 40px rgba(59,178,137,0.3)';
    
    // Animate icon
    const icon = card.querySelector('.payment-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  }
  
  animateCardClick(card) {
    // Click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.style.transform = 'scale(1)';
    }, 150);
    
    // Ripple effect
    this.createRippleEffect(card);
  }
  
  animateCardSelection(card) {
    // Selection animation
    card.style.transform = 'scale(1.05)';
    card.style.borderColor = 'var(--accent)';
    
    setTimeout(() => {
      card.style.transform = 'scale(1)';
    }, 300);
  }
  
  createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(59,178,137,0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.marginLeft = '-50px';
    ripple.style.marginTop = '-50px';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  switchIndicator(index) {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    // Animate payment methods based on indicator
    this.animatePaymentMethods(index);
  }
  
  animatePaymentMethods(index) {
    const cards = document.querySelectorAll('.payment-method-card');
    cards.forEach((card, i) => {
      if (i === index) {
        card.style.transform = 'scale(1.05)';
        card.style.zIndex = '10';
      } else {
        card.style.transform = 'scale(0.95)';
        card.style.zIndex = '1';
      }
    });
  }
  
  activateStep(stepNumber) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      if (index + 1 <= stepNumber) {
        step.classList.add('active');
        step.style.background = 'var(--accent)';
        step.style.color = '#fff';
      } else {
        step.classList.remove('active');
        step.style.background = '#f8fafc';
        step.style.color = 'var(--text)';
      }
    });
    
    this.currentStep = stepNumber;
    this.animateStepTransition(stepNumber);
  }
  
  animateStepTransition(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
      step.style.transform = 'scale(1.05)';
      setTimeout(() => {
        step.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  animateSecurityFeature(feature) {
    const icon = feature.querySelector('.feature-icon');
    if (icon) {
      icon.style.transform = 'scale(1.2) rotate(10deg)';
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 300);
    }
  }
  
  showPaymentDetails(method) {
    const methodNames = {
      'cards': 'Банковские карты',
      'mobile': 'Мобильные платежи',
      'bank': 'Банковский перевод',
      'cash': 'Наличные'
    };
    
    const methodDescriptions = {
      'cards': 'Оплата банковскими картами Visa, MasterCard и МИР. Все транзакции защищены современными системами шифрования.',
      'mobile': 'Быстрая и удобная оплата через Apple Pay, Google Pay и Samsung Pay. Просто приложите телефон к терминалу.',
      'bank': 'Безналичный расчет для юридических лиц. Выставляем счета и принимаем банковские переводы.',
      'cash': 'Оплата наличными при получении товара. Курьер примет точную сумму без сдачи.'
    };
    
    // Create and show payment details modal
    const modal = document.createElement('div');
    modal.className = 'payment-details-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${methodNames[method]}</h3>
          <button class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>${methodDescriptions[method]}</p>
          <div class="payment-actions">
            <button class="btn btn-primary" onclick="paymentManager.proceedToPayment('${method}')">
              Продолжить
            </button>
            <button class="btn btn-secondary" onclick="paymentManager.closeModal()">
              Отмена
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    // Close modal handlers
    modal.querySelector('.close-btn').addEventListener('click', () => {
      this.closeModal();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
  }
  
  proceedToPayment(method) {
    // Simulate payment process
    this.showPaymentProgress(method);
  }
  
  showPaymentProgress(method) {
    const progressModal = document.createElement('div');
    progressModal.className = 'payment-progress-modal';
    progressModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Обработка платежа</h3>
        </div>
        <div class="modal-body">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <p class="progress-text">Подключение к платежной системе...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(progressModal);
    
    // Animate progress
    const progressFill = progressModal.querySelector('.progress-fill');
    const progressText = progressModal.querySelector('.progress-text');
    
    const steps = [
      { text: 'Подключение к платежной системе...', progress: 25 },
      { text: 'Проверка данных карты...', progress: 50 },
      { text: 'Обработка платежа...', progress: 75 },
      { text: 'Платеж успешно обработан!', progress: 100 }
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        progressFill.style.width = steps[currentStep].progress + '%';
        progressText.textContent = steps[currentStep].text;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.showPaymentSuccess();
          progressModal.remove();
        }, 1000);
      }
    }, 1000);
  }
  
  showPaymentSuccess() {
    const successModal = document.createElement('div');
    successModal.className = 'payment-success-modal';
    successModal.innerHTML = `
      <div class="modal-content">
        <div class="success-icon">✅</div>
        <h3>Платеж успешно обработан!</h3>
        <p>Ваш заказ принят в обработку. Мы свяжемся с вами для подтверждения доставки.</p>
        <button class="btn btn-primary" onclick="paymentManager.closeModal()">
          Понятно
        </button>
      </div>
    `;
    
    document.body.appendChild(successModal);
    
    setTimeout(() => {
      successModal.classList.add('show');
    }, 10);
  }
  
  closeModal() {
    const modals = document.querySelectorAll('.payment-details-modal, .payment-progress-modal, .payment-success-modal');
    modals.forEach(modal => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
  }
  
}

// Initialize payment page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.paymentManager = new PaymentPageManager();
});

// Add CSS for modals
const modalStyles = `
  .payment-details-modal,
  .payment-progress-modal,
  .payment-success-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .payment-details-modal.show,
  .payment-progress-modal.show,
  .payment-success-modal.show {
    opacity: 1;
    visibility: visible;
  }
  
  .modal-content {
    background: #fff;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  
  .payment-details-modal.show .modal-content,
  .payment-progress-modal.show .modal-content,
  .payment-success-modal.show .modal-content {
    transform: scale(1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e3f2fd;
  }
  
  .modal-header h3 {
    margin: 0;
    color: var(--text);
    font-size: 20px;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--muted);
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: var(--text);
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .payment-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
  
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: var(--accent);
    color: #fff;
  }
  
  .btn-primary:hover {
    background: var(--accent-2);
  }
  
  .btn-secondary {
    background: #f8fafc;
    color: var(--text);
    border: 1px solid #e3f2fd;
  }
  
  .btn-secondary:hover {
    background: #e3f2fd;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e3f2fd;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px 0;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.5s ease;
  }
  
  .progress-text {
    text-align: center;
    color: var(--muted);
    margin: 0;
  }
  
  .success-icon {
    font-size: 48px;
    text-align: center;
    margin-bottom: 16px;
    animation: bounce 1s ease;
  }
  
  .payment-success-modal .modal-content {
    text-align: center;
    padding: 40px 20px;
  }
  
  .payment-success-modal h3 {
    color: var(--text);
    margin: 0 0 16px;
  }
  
  .payment-success-modal p {
    color: var(--muted);
    margin: 0 0 24px;
    line-height: 1.6;
  }
`;

// Add FAQ styles (CSS-only accordion)
const faqStyles = `
  .payment-faq .faq-item {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .payment-faq .faq-item:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 20px rgba(59, 178, 136, 0.1);
  }
  
  .payment-faq .faq-checkbox {
    display: none;
  }
  
  .payment-faq .faq-question {
    padding: 1.5rem;
    background: var(--bg);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
    margin: 0;
  }
  
  .payment-faq .faq-question:hover {
    background: var(--bg-strong);
  }
  
  .payment-faq .faq-question span:first-child {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
    margin: 0;
  }
  
  .payment-faq .faq-toggle {
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--accent);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .payment-faq .faq-toggle:hover {
    background: rgba(59, 178, 136, 0.1);
  }
  
  .payment-faq .faq-answer {
    padding: 0 1.5rem;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .payment-faq .faq-answer p {
    color: var(--muted);
    line-height: 1.6;
    margin: 0;
  }
  
  /* CSS-only accordion functionality */
  .payment-faq .faq-checkbox:checked + .faq-question .faq-toggle {
    transform: rotate(45deg);
    background: var(--accent);
    color: white;
  }
  
  .payment-faq .faq-checkbox:checked + .faq-question {
    background: var(--bg-strong);
  }
  
  .payment-faq .faq-checkbox:checked ~ .faq-answer {
    padding: 1.5rem;
    max-height: 200px;
  }
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles + faqStyles;
document.head.appendChild(styleSheet);
