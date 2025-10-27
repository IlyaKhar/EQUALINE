// Preloader logic
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => preloader.classList.add('hidden'), 700);
});

// Theme: init from saved preference or system, then handle toggle
(() => {
  const storageKey = 'equala_theme';
  const htmlEl = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(storageKey);
  const initial = saved || (prefersDark ? 'dark' : 'light');
  htmlEl.setAttribute('data-theme', initial);

  const toggleBtn = document.getElementById('themeToggle');
  const updateIcon = () => {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('.icon');
    if (icon) icon.textContent = htmlEl.getAttribute('data-theme') === 'dark' ? '🌞' : '🌙';
  };
  updateIcon();

  toggleBtn?.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem(storageKey, next);
    updateIcon();
  });
})();

// Authentication system with localStorage
class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.updateAuthUI();
  }

  getCurrentUser() {
    const user = localStorage.getItem('equaline_user');
    return user ? JSON.parse(user) : null;
  }

  saveUser(user) {
    localStorage.setItem('equaline_user', JSON.stringify(user));
    this.currentUser = user;
    this.updateAuthUI();
  }

  logout() {
    localStorage.removeItem('equaline_user');
    this.currentUser = null;
    this.updateAuthUI();
  }

  updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    if (!authLinks) return;

    if (this.currentUser) {
      authLinks.innerHTML = `
        <div class="user-info">
          <span>Привет, ${this.currentUser.name}!</span>
          <button class="logout-btn" onclick="authSystem.logout()">Выйти</button>
        </div>
      `;
    } else {
      authLinks.innerHTML = `
        <button data-open-modal="login">Вход</button>
        <button data-open-modal="register">Регистрация</button>
      `;
      // Re-attach event listeners
      document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
      });
    }
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password) {
    return password.length >= 6;
  }

  validateName(name) {
    return name.trim().length >= 2;
  }

  validatePhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if we have 10 or 11 digits (with or without country code)
    return cleaned.length >= 10 && cleaned.length <= 11;
  }
}

// Normalize phone number to standard format
function normalizePhone(phone) {
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
  
  return cleaned;
}

const authSystem = new AuthSystem();

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarClose = document.querySelector('.sidebar__close');
const toggleSidebar = (open) => {
  const willOpen = open ?? !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', willOpen);
  sidebarToggle.setAttribute('aria-expanded', String(willOpen));
  document.body.style.overflow = willOpen ? 'hidden' : '';
};
sidebarToggle?.addEventListener('click', () => toggleSidebar());
sidebarClose?.addEventListener('click', () => toggleSidebar(false));

// Close sidebar by ESC or outside click
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleSidebar(false); });
document.addEventListener('click', (e) => {
  if (sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) toggleSidebar(false);
  }
});

// Sidebar search (simple demo)
document.querySelector('.sidebar__search')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = new FormData(e.currentTarget).get('');
  const input = e.currentTarget.querySelector('input');
  const query = (input?.value || '').trim();
  if (!query) return;
  window.location.href = `pages/catalog.html?search=${encodeURIComponent(query)}`;
});

// Scroll down button
document.querySelector('.scroll-down')?.addEventListener('click', () => {
  document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' });
});

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  toTop?.classList.toggle('show', show);
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Intersection animation for cards
const reveal = (els) => {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.animate([
          { transform: 'translateY(12px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 }
        ], { duration: 500, easing: 'ease', fill: 'both' });
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
};
reveal([...document.querySelectorAll('.card')]);

// Modal helpers
const openModal = (id) => {
  const m = document.getElementById(`modal-${id}`);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeModals = () => {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
};
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
});
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModals));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) closeModals(); }));

// Forms: login, register, callback
const successModal = document.getElementById('modal-success');
const successTitle = document.getElementById('successTitle');
const successText = document.getElementById('successText');
const showSuccess = (title, text) => {
  successTitle.textContent = title;
  successText.textContent = text;
  successModal.classList.add('open');
};

const showError = (input, message) => {
  input.classList.add('error');
  let errorEl = input.parentNode.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
};

const clearError = (input) => {
  input.classList.remove('error');
  const errorEl = input.parentNode.querySelector('.form-error');
  if (errorEl) errorEl.remove();
};

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email').trim();
    const password = formData.get('password');
    
    let isValid = true;
    
    // Clear previous errors
    clearError(loginForm.querySelector('[name="email"]'));
    clearError(loginForm.querySelector('[name="password"]'));
    
    // Validate email
    if (!authSystem.validateEmail(email)) {
      showError(loginForm.querySelector('[name="email"]'), 'Введите корректный email');
      isValid = false;
    }
    
    // Validate password
    if (!authSystem.validatePassword(password)) {
      showError(loginForm.querySelector('[name="password"]'), 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    }
    
    if (isValid) {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('equaline_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        authSystem.saveUser({ name: user.name, email: user.email, phone: user.phone });
        closeModals();
        showSuccess('Вход выполнен', `Добро пожаловать, ${user.name}!`);
        loginForm.reset();
        // Dispatch auth success event
        document.dispatchEvent(new CustomEvent('authSuccess'));
      } else {
        showError(loginForm.querySelector('[name="email"]'), 'Неверный email или пароль');
      }
    }
  });
}

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const phone = formData.get('phone').trim();
    const password = formData.get('password');
    
    let isValid = true;
    
    // Clear previous errors
    clearError(registerForm.querySelector('[name="name"]'));
    clearError(registerForm.querySelector('[name="email"]'));
    clearError(registerForm.querySelector('[name="phone"]'));
    clearError(registerForm.querySelector('[name="password"]'));
    
    // Validate name
    if (!authSystem.validateName(name)) {
      showError(registerForm.querySelector('[name="name"]'), 'Имя должно содержать минимум 2 символа');
      isValid = false;
    }
    
    // Validate email
    if (!authSystem.validateEmail(email)) {
      showError(registerForm.querySelector('[name="email"]'), 'Введите корректный email');
      isValid = false;
    }
    
    // Validate phone
    if (!authSystem.validatePhone(phone)) {
      showError(registerForm.querySelector('[name="phone"]'), 'Введите корректный номер телефона');
      isValid = false;
    }
    
    // Validate password
    if (!authSystem.validatePassword(password)) {
      showError(registerForm.querySelector('[name="password"]'), 'Пароль должен содержать минимум 6 символов');
      isValid = false;
    }
    
    if (isValid) {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('equaline_users') || '[]');
      if (users.find(u => u.email === email)) {
        showError(registerForm.querySelector('[name="email"]'), 'Пользователь с таким email уже существует');
        return;
      }
      
      // Save new user with normalized phone
      const normalizedPhone = normalizePhone(phone);
      const newUser = { name, email, phone: normalizedPhone, password };
      users.push(newUser);
      localStorage.setItem('equaline_users', JSON.stringify(users));
      
      authSystem.saveUser({ name, email, phone: normalizedPhone });
      closeModals();
      showSuccess('Регистрация завершена', `Добро пожаловать, ${name}!`);
      registerForm.reset();
      // Dispatch auth success event
      document.dispatchEvent(new CustomEvent('authSuccess'));
    }
  });
}

// Callback form with validation
const callbackForm = document.getElementById('callbackForm');
if (callbackForm) {
  callbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearError(callbackForm.querySelector('[name="name"]'));
    clearError(callbackForm.querySelector('[name="phone"]'));
    clearError(callbackForm.querySelector('[name="email"]'));
    
    // Validate name
    if (!authSystem.validateName(name)) {
      showError(callbackForm.querySelector('[name="name"]'), 'Введите ваше имя');
      isValid = false;
    }
    
    // Validate phone
    if (!authSystem.validatePhone(phone)) {
      showError(callbackForm.querySelector('[name="phone"]'), 'Введите корректный номер телефона');
      isValid = false;
    }
    
    // Validate email if provided
    if (email && !authSystem.validateEmail(email)) {
      showError(callbackForm.querySelector('[name="email"]'), 'Введите корректный email');
      isValid = false;
    }
    
    if (isValid) {
      // Save callback request to localStorage
      const callbacks = JSON.parse(localStorage.getItem('equaline_callbacks') || '[]');
      callbacks.push({
        name, phone, email, message,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('equaline_callbacks', JSON.stringify(callbacks));
      
      showSuccess('Заявка отправлена', 'Мы свяжемся с вами в ближайшее время.');
      callbackForm.reset();
    }
  });
}

// Reviews carousel functionality
const reviewsData = [
  {
    id: 1,
    name: 'Матвей Поздеев',
    initials: 'МП',
    date: '02 МАЯ 2025',
    rating: 5,
    text: 'Очень удобно, что доставляют в выходные дни, так как в будни много работаю. Интервал доставки 3-4 часа, заказываю утром, а привозят в обед. Цену считаю выгодной.'
  },
  {
    id: 2,
    name: 'Екатерина Попова',
    initials: 'ЕП',
    date: '15 АПРЕЛЯ 2025',
    rating: 5,
    text: 'После рождения сына перешли на бутилированную питьевую воду. Изучала в интернете, сравнивала цены. Заказали в «Пей Воду для Ля...» и остались довольны качеством.'
  },
  {
    id: 3,
    name: 'Александр Иванов',
    initials: 'АИ',
    date: '28 МАРТА 2025',
    rating: 5,
    text: 'Заказываю воду уже полгода. Качество отличное, доставка быстрая. Особенно нравится, что можно заказать онлайн и выбрать удобное время.'
  },
  {
    id: 4,
    name: 'Мария Петрова',
    initials: 'МП',
    date: '10 МАРТА 2025',
    rating: 5,
    text: 'Вода очень вкусная и чистая. Заказываем для всей семьи. Служба доставки работает профессионально, всегда привозят вовремя.'
  },
  {
    id: 5,
    name: 'Дмитрий Соколов',
    initials: 'ДС',
    date: '22 ФЕВРАЛЯ 2025',
    rating: 5,
    text: 'Отличное соотношение цена-качество. Вода действительно хорошая, пьем всей семьей. Рекомендую всем знакомым.'
  },
  {
    id: 6,
    name: 'Анна Козлова',
    initials: 'АК',
    date: '05 ФЕВРАЛЯ 2025',
    rating: 5,
    text: 'Очень довольна сервисом. Вода качественная, доставка быстрая. Особенно удобно, что можно заказать через сайт.'
  },
  {
    id: 7,
    name: 'Елена Волкова',
    initials: 'ЕВ',
    date: '28 ЯНВАРЯ 2025',
    rating: 5,
    text: 'Превосходное качество воды! Заказываем уже год, всегда довольны. Курьеры вежливые и пунктуальные.'
  },
  {
    id: 8,
    name: 'Сергей Морозов',
    initials: 'СМ',
    date: '15 ЯНВАРЯ 2025',
    rating: 4,
    text: 'Хорошая вода по разумной цене. Иногда бывают небольшие задержки с доставкой, но качество компенсирует.'
  },
  {
    id: 9,
    name: 'Татьяна Новикова',
    initials: 'ТН',
    date: '08 ЯНВАРЯ 2025',
    rating: 5,
    text: 'Отличный сервис! Вода мягкая и вкусная. Заказываем для офиса, все сотрудники довольны.'
  },
  {
    id: 10,
    name: 'Андрей Лебедев',
    initials: 'АЛ',
    date: '02 ЯНВАРЯ 2025',
    rating: 5,
    text: 'Заказываем воду уже полгода. Качество стабильное, доставка быстрая. Рекомендую всем!'
  },
  {
    id: 11,
    name: 'Мария Кузнецова',
    initials: 'МК',
    date: '25 ДЕКАБРЯ 2024',
    rating: 5,
    text: 'Очень довольна качеством воды. Вкусная, чистая, без привкуса. Доставка работает отлично.'
  },
  {
    id: 12,
    name: 'Дмитрий Федоров',
    initials: 'ДФ',
    date: '18 ДЕКАБРЯ 2024',
    rating: 4,
    text: 'Неплохая вода, цена соответствует качеству. Иногда задерживается доставка, но в целом все устраивает.'
  },
  {
    id: 13,
    name: 'Ольга Смирнова',
    initials: 'ОС',
    date: '10 ДЕКАБРЯ 2024',
    rating: 5,
    text: 'Отличная вода! Заказываем для всей семьи. Особенно нравится удобство заказа через интернет.'
  },
  {
    id: 14,
    name: 'Игорь Попов',
    initials: 'ИП',
    date: '05 ДЕКАБРЯ 2024',
    rating: 5,
    text: 'Превосходное качество! Вода действительно чистая и вкусная. Служба доставки работает профессионально.'
  },
  {
    id: 15,
    name: 'Наталья Васильева',
    initials: 'НВ',
    date: '28 НОЯБРЯ 2024',
    rating: 4,
    text: 'Хорошая вода, приятный вкус. Единственное - иногда бывают задержки с доставкой, но качество хорошее.'
  }
];

let currentReviewIndex = 0;
const reviewsPerPage = 2;

const renderReviews = () => {
  const reviewsCards = document.querySelector('.reviews-cards');
  if (!reviewsCards) {
    return;
  }
  
  // Check if reviews are already in HTML
  const existingReviews = reviewsCards.querySelectorAll('.review-card');
  if (existingReviews.length > 0) {
    return;
  }
  
  // Add fade out effect
  reviewsCards.style.opacity = '0';
  reviewsCards.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    const startIndex = currentReviewIndex;
    const endIndex = Math.min(startIndex + reviewsPerPage, reviewsData.length);
    const currentReviews = reviewsData.slice(startIndex, endIndex);
    
    
    
    reviewsCards.innerHTML = currentReviews.map((review, index) => `
      <div class="review-card" style="animation-delay: ${index * 0.1}s">
        <div class="review-header">
          <div class="review-avatar">
            <div class="avatar-circle">${review.initials}</div>
          </div>
          <div class="review-info">
            <div class="review-date">${review.date}</div>
            <div class="review-name">${review.name}</div>
          </div>
        </div>
        <div class="review-rating">
          <span class="stars">${'★'.repeat(review.rating)}</span>
        </div>
        <div class="review-text">
          <div class="quote-icon">"</div>
          <p>${review.text}</p>
        </div>
      </div>
    `).join('');
    
    // Add fade in effect
    reviewsCards.style.opacity = '1';
    reviewsCards.style.transform = 'translateY(0)';
  }, 150);
};

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  const navPrev = document.querySelector('.nav-prev');
  const navNext = document.querySelector('.nav-next');
  const navDots = document.querySelectorAll('.dot');
  
  // Previous button
  if (navPrev) {
    navPrev.addEventListener('click', () => {
      if (currentReviewIndex > 0) {
        currentReviewIndex -= reviewsPerPage;
        renderReviews();
        updateNavigation();
      }
    });
  }
  
  // Next button
  if (navNext) {
    navNext.addEventListener('click', () => {
      if (currentReviewIndex + reviewsPerPage < reviewsData.length) {
        currentReviewIndex += reviewsPerPage;
        renderReviews();
        updateNavigation();
      }
    });
  }
  
  // Dot navigation
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentReviewIndex = index * reviewsPerPage;
      renderReviews();
      updateNavigation();
    });
  });
  
  // Initialize reviews and navigation
  renderReviews();
  updateNavigation();
  
  // Leave review functionality
  const leaveReviewLink = document.querySelector('.leave-review');
  if (leaveReviewLink) {
    leaveReviewLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('leave-review');
    });
  }
  
  // All reviews functionality
  const allReviewsLink = document.querySelector('.all-reviews');
  if (allReviewsLink) {
    allReviewsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openAllReviewsModal();
    });
  }
  
  // Handle data-open-modal="all-reviews" buttons
  const allReviewsButtons = document.querySelectorAll('[data-open-modal="all-reviews"]');
  allReviewsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openAllReviewsModal();
    });
  });
});

// Update navigation state
const updateNavigation = () => {
  const navPrev = document.querySelector('.nav-prev');
  const navNext = document.querySelector('.nav-next');
  const navDots = document.querySelectorAll('.dot');
  const totalPages = Math.ceil(reviewsData.length / reviewsPerPage);
  const currentPage = Math.floor(currentReviewIndex / reviewsPerPage);
  
  
  // Update arrow buttons
  if (navPrev) {
    navPrev.disabled = currentReviewIndex === 0;
  }
  if (navNext) {
    navNext.disabled = currentReviewIndex + reviewsPerPage >= reviewsData.length;
  }
  
  // Update dots
  navDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentPage);
    dot.style.display = index < totalPages ? 'block' : 'none';
  });
};


// Leave review form
const leaveReviewForm = document.getElementById('leaveReviewForm');
if (leaveReviewForm) {
  leaveReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name').trim();
    const rating = parseInt(formData.get('rating'));
    const text = formData.get('text').trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearError(leaveReviewForm.querySelector('[name="name"]'));
    clearError(leaveReviewForm.querySelector('[name="text"]'));
    
    // Validate name
    if (!authSystem.validateName(name)) {
      showError(leaveReviewForm.querySelector('[name="name"]'), 'Введите ваше имя');
      isValid = false;
    }
    
    // Validate text
    if (text.length < 10) {
      showError(leaveReviewForm.querySelector('[name="text"]'), 'Отзыв должен содержать минимум 10 символов');
      isValid = false;
    }
    
    if (isValid) {
      // Add new review to data
      const newReview = {
        id: reviewsData.length + 1,
        name: name,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        date: new Date().toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase(),
        rating: rating,
        text: text
      };
      
      reviewsData.unshift(newReview); // Add to beginning
      currentReviewIndex = 0; // Reset to first page
      renderReviews();
      
      closeModals();
      showSuccess('Отзыв добавлен', 'Спасибо за ваш отзыв! Он будет опубликован после модерации.');
      leaveReviewForm.reset();
    }
  });
}

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    
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
    
    // Also handle click on toggle button
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      question.click();
    });
  });
});

// Brand New Reviews System
class NewReviewsManager {
  constructor() {
    this.reviewsData = reviewsData; // Используем основной массив отзывов
    
    this.currentPage = 0;
    this.reviewsPerPage = 2;
    this.totalPages = Math.ceil(this.reviewsData.length / this.reviewsPerPage);
    this.isAnimating = false;
    this.autoSlideInterval = null;
    
    this.reviewsList = document.getElementById('reviewsList');
    this.prevBtn = document.getElementById('prevBtnNew');
    this.nextBtn = document.getElementById('nextBtnNew');
    this.pageDots = document.getElementById('pageDots');
    
    this.init();
  }
  
  init() {
    if (!this.reviewsList) {
      console.log('Reviews list not found');
      return;
    }
    
    console.log('Initializing new reviews system');
    this.renderReviews();
    this.renderNavigation();
    this.bindEvents();
  }
  
  renderReviews() {
    if (!this.reviewsList) return;
    
    const startIndex = this.currentPage * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    const currentReviews = this.reviewsData.slice(startIndex, endIndex);
    
    // Добавляем анимацию исчезновения
    this.reviewsList.style.opacity = '0';
    this.reviewsList.style.transform = 'translateX(10px)';
    
    setTimeout(() => {
      this.reviewsList.innerHTML = currentReviews.map((review, index) => `
        <div class="review-item" style="animation-delay: ${index * 0.1}s">
          <div class="review-item-header">
            <div class="review-avatar">${review.initials}</div>
            <div class="review-item-info">
              <div class="review-item-date">${review.date}</div>
              <div class="review-item-name">${review.name}</div>
            </div>
          </div>
          <div class="review-item-rating">
            <span class="review-stars">${'★'.repeat(review.rating)}</span>
          </div>
          <div class="review-item-text">
            <div class="review-quote">"</div>
            <p>${review.text}</p>
          </div>
        </div>
      `).join('');
      
      // Анимация появления
      this.reviewsList.style.opacity = '1';
      this.reviewsList.style.transform = 'translateX(0)';
    }, 200);
  }
  
  renderNavigation() {
    if (!this.pageDots) return;
    
    this.pageDots.innerHTML = '';
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = `page-dot ${i === this.currentPage ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToPage(i));
      this.pageDots.appendChild(dot);
    }
    
    this.updateButtons();
  }
  
  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentPage === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
    }
  }
  
  goToPage(page) {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.renderReviews();
    this.renderNavigation();
  }
  
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
    }
    
    // Автоматическое листание
    this.startAutoSlide();
    
    // Останавливаем автолистание при наведении
    if (this.reviewsList) {
      this.reviewsList.addEventListener('mouseenter', () => this.stopAutoSlide());
      this.reviewsList.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }
  
  startAutoSlide() {
    this.stopAutoSlide(); // Останавливаем предыдущий интервал
    this.autoSlideInterval = setInterval(() => {
      this.goToPage(this.currentPage + 1);
    }, 5000); // Листаем каждые 5 секунд
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// Initialize brand new reviews system
document.addEventListener('DOMContentLoaded', () => {
  new NewReviewsManager();
});

// Newsletter subscription form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email').trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearError(newsletterForm.querySelector('[name="email"]'));
    
    // Validate email
    if (!authSystem.validateEmail(email)) {
      showError(newsletterForm.querySelector('[name="email"]'), 'Введите корректный email');
      isValid = false;
    }
    
    if (isValid) {
      // Save newsletter subscription to localStorage
      const subscriptions = JSON.parse(localStorage.getItem('equaline_newsletter') || '[]');
      if (!subscriptions.find(sub => sub.email === email)) {
        subscriptions.push({
          email: email,
          timestamp: new Date().toISOString(),
          id: Date.now()
        });
        localStorage.setItem('equaline_newsletter', JSON.stringify(subscriptions));
        
        closeModals();
        showSuccess('Подписка оформлена', 'Спасибо за подписку! Мы будем присылать вам актуальные новости и предложения.');
        newsletterForm.reset();
      } else {
        showError(newsletterForm.querySelector('[name="email"]'), 'Этот email уже подписан на рассылку');
      }
    }
  });
}

// All Reviews Modal functionality
const openAllReviewsModal = () => {
  console.log('Opening all reviews modal...');
  const modal = document.getElementById('modal-all-reviews');
  const allReviewsList = document.getElementById('allReviewsList');
  const totalReviewsEl = document.getElementById('totalReviews');
  const averageRatingEl = document.getElementById('averageRating');
  
  console.log('Modal:', modal);
  console.log('Reviews list:', allReviewsList);
  console.log('Total reviews element:', totalReviewsEl);
  console.log('Average rating element:', averageRatingEl);
  
  if (!modal || !allReviewsList) {
    console.error('Modal or reviews list not found!');
    return;
  }
  
  // Calculate statistics
  const totalReviews = 15; // У нас 15 отзывов
  const averageRating = 4.9; // Средняя оценка
  
  // Update statistics
  console.log('Updating statistics...');
  if (totalReviewsEl) {
    totalReviewsEl.textContent = totalReviews;
    console.log('Updated total reviews to:', totalReviews);
  } else {
    console.error('Total reviews element not found!');
  }
  if (averageRatingEl) {
    averageRatingEl.textContent = averageRating;
    console.log('Updated average rating to:', averageRating);
  } else {
    console.error('Average rating element not found!');
  }
  
  // Render all reviews - используем все 15 отзывов
  const allReviews = [
    { name: 'Матвей Поздеев', initials: 'МП', date: '02 МАЯ 2022', rating: 5, text: 'Очень удобно, что доставляют в выходные дни, так как в будни много работаю. Интервал доставки 3-4 часа, заказываю утром, а привозят в обед. Цену считаю выгодной.' },
    { name: 'Екатерина Попова', initials: 'ЕП', date: '15 АПРЕЛЯ 2022', rating: 5, text: 'После рождения сына перешли на бутилированную питьевую воду. Изучала в интернете, сравнивала цены. Заказали в «Пей Воду для Ля...» и остались довольны качеством.' },
    { name: 'Александр Иванов', initials: 'АИ', date: '28 МАРТА 2022', rating: 5, text: 'Заказываю воду уже полгода. Качество отличное, доставка быстрая. Особенно нравится, что можно заказать онлайн и выбрать удобное время.' },
    { name: 'Мария Петрова', initials: 'МП', date: '10 МАРТА 2022', rating: 5, text: 'Вода очень вкусная и чистая. Заказываем для всей семьи. Служба доставки работает профессионально, всегда привозят вовремя.' },
    { name: 'Дмитрий Соколов', initials: 'ДС', date: '22 ФЕВРАЛЯ 2022', rating: 5, text: 'Отличное соотношение цена-качество. Вода действительно хорошая, пьем всей семьей. Рекомендую всем знакомым.' },
    { name: 'Анна Козлова', initials: 'АК', date: '05 ФЕВРАЛЯ 2022', rating: 5, text: 'Очень довольна сервисом. Вода качественная, доставка быстрая. Особенно удобно, что можно заказать через сайт.' },
    { name: 'Елена Волкова', initials: 'ЕВ', date: '28 ЯНВАРЯ 2022', rating: 5, text: 'Превосходное качество воды! Заказываем уже год, всегда довольны. Курьеры вежливые и пунктуальные.' },
    { name: 'Сергей Морозов', initials: 'СМ', date: '15 ЯНВАРЯ 2022', rating: 4, text: 'Хорошая вода по разумной цене. Иногда бывают небольшие задержки с доставкой, но качество компенсирует.' },
    { name: 'Татьяна Новикова', initials: 'ТН', date: '08 ЯНВАРЯ 2022', rating: 5, text: 'Отличный сервис! Вода мягкая и вкусная. Заказываем для офиса, все сотрудники довольны.' },
    { name: 'Андрей Лебедев', initials: 'АЛ', date: '02 ЯНВАРЯ 2022', rating: 5, text: 'Заказываем воду уже полгода. Качество стабильное, доставка быстрая. Рекомендую всем!' },
    { name: 'Мария Кузнецова', initials: 'МК', date: '25 ДЕКАБРЯ 2021', rating: 5, text: 'Очень довольна качеством воды. Вкусная, чистая, без привкуса. Доставка работает отлично.' },
    { name: 'Дмитрий Федоров', initials: 'ДФ', date: '18 ДЕКАБРЯ 2021', rating: 4, text: 'Неплохая вода, цена соответствует качеству. Иногда задерживается доставка, но в целом все устраивает.' },
    { name: 'Ольга Смирнова', initials: 'ОС', date: '10 ДЕКАБРЯ 2021', rating: 5, text: 'Отличная вода! Заказываем для всей семьи. Особенно нравится удобство заказа через интернет.' },
    { name: 'Игорь Попов', initials: 'ИП', date: '05 ДЕКАБРЯ 2021', rating: 5, text: 'Превосходное качество! Вода действительно чистая и вкусная. Служба доставки работает профессионально.' },
    { name: 'Наталья Васильева', initials: 'НВ', date: '28 НОЯБРЯ 2021', rating: 4, text: 'Хорошая вода, приятный вкус. Единственное - иногда бывают задержки с доставкой, но качество хорошее.' }
  ];
  
  allReviewsList.innerHTML = allReviews.map((review, index) => `
    <div class="review-item-modal" style="animation-delay: ${index * 0.1}s">
      <div class="review-header">
        <div class="review-avatar">
          <div class="avatar-circle">${review.initials}</div>
        </div>
        <div class="review-info">
          <div class="review-date">${review.date}</div>
          <div class="review-name">${review.name}</div>
        </div>
      </div>
      <div class="review-rating">
        <span class="stars">${'★'.repeat(review.rating)}</span>
      </div>
      <div class="review-text">
        <p>${review.text}</p>
      </div>
    </div>
  `).join('');
  
  // Open modal
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Add smooth scroll to top of reviews list
  setTimeout(() => {
    allReviewsList.scrollTop = 0;
  }, 100);
};

// Stone to Water Animation System
class StoneWaterAnimation {
  constructor() {
    this.stoneImage = document.getElementById('stoneImage');
    this.waterImage = document.getElementById('waterImage');
    this.container = document.getElementById('productsImageContainer');
    this.stonePiecesContainer = document.getElementById('stonePiecesContainer');
    this.stonePieces = document.querySelectorAll('.stone-piece');
    this.isAnimating = false;
    
    console.log('StoneWaterAnimation инициализирован с 6 кусочками камня');
    console.log('stoneImage найден:', !!this.stoneImage);
    console.log('waterImage найден:', !!this.waterImage);
    console.log('stonePiecesContainer найден:', !!this.stonePiecesContainer);
    console.log('Количество кусочков:', this.stonePieces.length);
    
    if (this.stoneImage && this.stonePiecesContainer) {
      this.init();
    } else {
      console.error('Не все элементы найдены!');
    }
  }

  init() {
    this.stoneImage.addEventListener('mouseenter', () => this.animateStoneToWater());
  }

  animateStoneToWater() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    console.log('Начинаем анимацию раскола камня при наведении');
    
    // Сначала показываем трещины на камне
    this.stoneImage.classList.add('cracking');
    this.createDetailedCracks();
    
    // Через 100мс показываем кусочки камня
    setTimeout(() => {
      console.log('Показываем кусочки камня');
      this.showStonePieces();
    }, 100);
    
    // Через 300мс начинаем скрывать камень и анимировать кусочки
    setTimeout(() => {
      console.log('Скрываем камень и анимируем кусочки');
      this.stoneImage.style.transition = 'opacity 0.3s ease-out';
      this.stoneImage.style.opacity = '0';
      this.animateStonePieces();
    }, 300);
    
    // Через 400мс показываем бутылку
    setTimeout(() => {
      console.log('Начинаем медленное появление бутылки');
      this.waterImage.classList.add('appearing');
    }, 200); // Начинаем показывать бутылку через 200мс (во время трещин)
    
    // Через 2с скрываем камень навсегда
    setTimeout(() => {
      this.stoneImage.style.display = 'none';
    }, 2000);
  }

  createDetailedCracks() {
    const rect = this.stoneImage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    console.log('Создаем трещины в позиции:', centerX, centerY);
    console.log('Размеры камня:', rect.width, 'x', rect.height);
    console.log('Позиция камня:', rect.left, rect.top);
    
    // Создаем контейнер для трещин как на сайте Petroglyph
    const cracksContainer = document.createElement('div');
    cracksContainer.className = 'cracks-container';
    cracksContainer.style.position = 'absolute';
    cracksContainer.style.left = rect.left + 'px';
    cracksContainer.style.top = rect.top + 'px';
    cracksContainer.style.width = rect.width + 'px';
    cracksContainer.style.height = rect.height + 'px';
    cracksContainer.style.pointerEvents = 'none';
    cracksContainer.style.zIndex = '1000';
    // Создаем внутренний элемент
    const crackInner = document.createElement('div');
    crackInner.className = 'crack-inner';
    crackInner.style.pointerEvents = 'auto';
    
    cracksContainer.appendChild(crackInner);
    document.body.appendChild(cracksContainer);
    
    console.log('Создан контейнер трещин с размерами:', rect.width, 'x', rect.height);
    
    // Создаем основные трещины - ровные и симметричные
    const mainCracks = [
      { angle: 0, length: 60, delay: 0 },           // Горизонтальная
      { angle: Math.PI/2, length: 60, delay: 50 },  // Вертикальная
      { angle: Math.PI, length: 60, delay: 100 },   // Горизонтальная (противоположная)
      { angle: -Math.PI/2, length: 60, delay: 150 }, // Вертикальная (противоположная)
      { angle: Math.PI/4, length: 50, delay: 200 },  // Диагональная
      { angle: -Math.PI/4, length: 50, delay: 250 }, // Диагональная (противоположная)
      { angle: Math.PI/6, length: 45, delay: 300 },  // Дополнительная
      { angle: -Math.PI/6, length: 45, delay: 350 }  // Дополнительная
    ];
    
    mainCracks.forEach((crack, i) => {
      const crackElement = document.createElement('div');
      crackElement.className = 'crack-element main-crack';
      
      // Трещины начинаются точно из центра
      const startX = centerX;
      const startY = centerY;
      
      crackElement.style.left = startX + 'px';
      crackElement.style.top = startY + 'px';
      crackElement.style.width = crack.length + 'px';
      crackElement.style.height = '5px';
      crackElement.style.background = '#000'; // Черный цвет
      crackElement.style.transform = `rotate(${crack.angle * 180 / Math.PI}deg)`;
      crackElement.style.pointerEvents = 'none';
      crackElement.style.opacity = '1'; // Сразу видимые
      crackElement.style.border = '1px solid #000';
      
      crackInner.appendChild(crackElement);
      console.log(`Создана трещина ${i} в позиции:`, startX, startY, 'размер:', crack.length);
      
      // Простая анимация появления трещины
      setTimeout(() => {
        crackElement.style.transition = 'width 0.3s ease-out';
        crackElement.style.width = (crack.length + 20) + 'px';
        console.log(`Показываем трещину ${i}`);
      }, crack.delay);
      
      // Удаляем трещину после анимации
      setTimeout(() => {
        if (crackElement.parentNode) {
          crackElement.parentNode.removeChild(crackElement);
        }
      }, 1200);
    });
    
    // Добавляем мелкие трещины - более ровные
    const smallCrackAngles = [
      Math.PI/8, -Math.PI/8, Math.PI/3, -Math.PI/3, 
      Math.PI*2/3, -Math.PI*2/3, Math.PI*5/6, -Math.PI*5/6,
      Math.PI*7/8, -Math.PI*7/8
    ];
    
    for (let i = 0; i < 10; i++) {
      const smallCrack = document.createElement('div');
      smallCrack.className = 'crack-element small-crack';
      
      const angle = smallCrackAngles[i];
      const length = 25 + Math.random() * 15; // Более предсказуемая длина
      const startX = centerX + Math.cos(angle) * 20; // Фиксированное расстояние от центра
      const startY = centerY + Math.sin(angle) * 20;
      
      smallCrack.style.left = startX + 'px';
      smallCrack.style.top = startY + 'px';
      smallCrack.style.width = length + 'px';
      smallCrack.style.height = '2px';
      smallCrack.style.background = '#444'; // Темно-серый цвет
      smallCrack.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
      smallCrack.style.pointerEvents = 'none';
      smallCrack.style.opacity = '1'; // Сразу видимые
      smallCrack.style.border = '1px solid #000';
      
      crackInner.appendChild(smallCrack);
      
      setTimeout(() => {
        smallCrack.style.transition = 'opacity 0.2s ease-out';
        smallCrack.style.opacity = '1';
      }, 180 + i * 20);
      
      setTimeout(() => {
        if (smallCrack.parentNode) {
          smallCrack.parentNode.removeChild(smallCrack);
        }
      }, 1000);
    }
    
    // Создаем эффект пыли при расколе
    this.createDustEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Удаляем контейнер после анимации
    setTimeout(() => {
      if (cracksContainer.parentNode) {
        cracksContainer.parentNode.removeChild(cracksContainer);
      }
    }, 1500);
  }

  createDustEffect(centerX, centerY) {
    // Создаем частицы пыли
    for (let i = 0; i < 15; i++) {
      const dust = document.createElement('div');
      dust.style.position = 'fixed';
      dust.style.left = centerX + 'px';
      dust.style.top = centerY + 'px';
      dust.style.width = '2px';
      dust.style.height = '2px';
      dust.style.background = '#8B7355';
      dust.style.borderRadius = '50%';
      dust.style.pointerEvents = 'none';
      dust.style.zIndex = '1002';
      dust.style.opacity = '0.8';
      
      document.body.appendChild(dust);
      
      // Анимация разлета пыли
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 40;
      const duration = 0.8 + Math.random() * 0.4;
      
      dust.style.transition = `all ${duration}s ease-out`;
      dust.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      dust.style.opacity = '0';
      
      // Удаляем частицу пыли
      setTimeout(() => {
        if (dust.parentNode) {
          dust.parentNode.removeChild(dust);
        }
      }, duration * 1000);
    }
  }

  showStonePieces() {
    // Показываем контейнер с кусочками
    this.stonePiecesContainer.classList.add('active');
    this.stonePiecesContainer.classList.add('unified');
    
    // Показываем каждый кусочек одновременно для эффекта единого камня
    this.stonePieces.forEach((piece, index) => {
      piece.style.opacity = '1';
      piece.style.animation = 'pieceAppear 0.3s ease-out forwards';
    });
  }

  animateStonePieces() {
    // Сначала убираем эффект единого камня
    this.stonePiecesContainer.classList.remove('unified');
    
    // Направления разлетания: сначала в стороны, потом падение вниз
    const fallDirections = [
      { x: -60, y: 0 },   // 1 - левый верхний -> влево, потом вниз
      { x: 0, y: 0 },     // 2 - верх центр -> прямо вниз
      { x: 60, y: 0 },    // 3 - правый верхний -> вправо, потом вниз
      { x: -50, y: 0 },   // 4 - левый нижний -> влево, потом вниз
      { x: 0, y: 0 },     // 5 - нижний центр -> прямо вниз
      { x: 50, y: 0 }     // 6 - правый нижний -> вправо, потом вниз
    ];
    
    this.stonePieces.forEach((piece, index) => {
      // Используем предопределенные направления
      const direction = fallDirections[index] || fallDirections[0];
      const fallX = direction.x;
      const fallY = direction.y;
      const duration = 3.0; // Увеличиваем длительность для реалистичного падения
      
      // Устанавливаем CSS переменные для анимации
      piece.style.setProperty('--fall-x', fallX + 'px');
      piece.style.setProperty('--fall-y', fallY + 'px');
      
      // Запускаем анимацию падения с небольшой задержкой
      setTimeout(() => {
        piece.style.animation = `pieceFall ${duration}s linear forwards`;
      }, 50 + index * 100);
      
      // Удаляем кусочек после анимации
      setTimeout(() => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      }, (duration + 0.5) * 1000);
    });
  }

  createFallingPieces() {
    const rect = this.stoneImage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем 12-15 падающих кусочков камня
    const pieceCount = 12 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('div');
      piece.className = 'falling-piece';
      
      // Случайные размеры кусочка
      const size = 8 + Math.random() * 12;
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      
      // Случайные оттенки серого/коричневого для камня
      const stoneColors = ['#8B7355', '#A68B5B', '#6B5B47', '#7A6B4F', '#9B8B6B', '#8A7A5A'];
      piece.style.background = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      
      // Позиционируем кусочки в разных точках камня
      const angle = (Math.PI * 2 * i) / pieceCount;
      const distance = 10 + Math.random() * 30;
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;
      
      piece.style.position = 'fixed';
      piece.style.left = startX + 'px';
      piece.style.top = startY + 'px';
      piece.style.borderRadius = '2px';
      piece.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      piece.style.pointerEvents = 'none';
      piece.style.zIndex = '1001';
      piece.style.opacity = '1';
      
      document.body.appendChild(piece);
      
      // Анимация падения кусочка
      const fallDistance = 100 + Math.random() * 150;
      const fallAngle = (Math.random() - 0.5) * Math.PI / 2; // Случайный угол падения
      const fallX = Math.sin(fallAngle) * fallDistance;
      const fallY = Math.cos(fallAngle) * fallDistance + 50; // Всегда немного вниз
      const rotation = (Math.random() - 0.5) * 720; // До 2 оборотов
      const duration = 1.2 + Math.random() * 0.6;
      
      piece.style.transition = `all ${duration}s ease-in`;
      piece.style.transform = `translate(${fallX}px, ${fallY}px) rotate(${rotation}deg)`;
      piece.style.opacity = '0';
      
      // Удаляем кусочек после падения
      setTimeout(() => {
        if (piece.parentNode) {
          piece.parentNode.removeChild(piece);
        }
      }, duration * 1000);
    }
  }

  createStoneFragments() {
    const rect = this.stoneImage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем ровно 8 фрагментов с разными формами
    const fragmentShapes = ['triangle', 'diamond', 'hexagon', 'irregular'];
    const fragmentSizes = [
      { width: 20, height: 25 },
      { width: 18, height: 22 },
      { width: 22, height: 18 },
      { width: 16, height: 20 },
      { width: 24, height: 16 },
      { width: 19, height: 24 },
      { width: 21, height: 19 },
      { width: 17, height: 23 }
    ];
    
    for (let i = 0; i < 8; i++) {
      const fragment = document.createElement('div');
      fragment.className = `stone-fragment ${fragmentShapes[i % fragmentShapes.length]}`;
      
      // Размеры фрагмента
      const size = fragmentSizes[i];
      fragment.style.width = size.width + 'px';
      fragment.style.height = size.height + 'px';
      
      // Случайные оттенки серого/коричневого для камня
      const stoneColors = ['#8B7355', '#A68B5B', '#6B5B47', '#7A6B4F', '#9B8B6B', '#8A7A5A'];
      fragment.style.background = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      
      // Позиционируем фрагменты в центре (как на сайте Petroglyph)
      fragment.style.left = centerX + 'px';
      fragment.style.top = centerY + 'px';
      
      // Каждый фрагмент летит в свою сторону с реалистичной физикой
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 100;
      const fallX = Math.cos(angle) * distance;
      const fallY = Math.sin(angle) * distance + 60 + Math.random() * 40; // гравитация
      const rotation = (Math.random() - 0.5) * 1440; // до 4 оборотов
      
      fragment.style.setProperty('--fall-x', fallX + 'px');
      fragment.style.setProperty('--fall-y', fallY + 'px');
      fragment.style.setProperty('--rotation', rotation + 'deg');
      
      document.body.appendChild(fragment);
      
      // Небольшая задержка для каждого фрагмента (как на сайте Petroglyph)
      const delay = i * 20; // 20мс задержка между фрагментами
      
      setTimeout(() => {
        // Анимация разлета фрагмента
        fragment.style.animation = `fragmentFall 1.5s ease-out forwards`;
      }, delay);
      
      // Удаляем фрагмент после анимации
      setTimeout(() => {
        if (fragment.parentNode) {
          fragment.parentNode.removeChild(fragment);
        }
      }, 1500 + delay);
    }
  }

}

// Инициализируем анимацию после загрузки DOM
// Отключено по просьбе: не инициализируем анимацию камня и бутылки
// document.addEventListener('DOMContentLoaded', () => {
//   new StoneWaterAnimation();
// });

// Enable drag within productsImageContainer for .stone-piece
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productsImageContainer');
  if (!container) return;
  const pieces = Array.from(container.querySelectorAll('.stone-piece'));
  const water = document.getElementById('waterImage');

  let active = null;
  let startX = 0, startY = 0;
  let startLeft = 0, startTop = 0;

  const getRect = () => container.getBoundingClientRect();
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const storageKey = 'stone_piece_positions_v1';
  const readSaved = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; }
  };
  const writeSaved = (obj) => {
    try { localStorage.setItem(storageKey, JSON.stringify(obj)); } catch {}
  };
  const getId = (el) => {
    const m = Array.from(el.classList).find(c => /^piece-\d+$/.test(c));
    return m || (el.getAttribute('src') || 'piece-' + pieces.indexOf(el));
  };
  let saved = readSaved();

  const onPointerDown = (e) => {
    const t = e.target.closest('.stone-piece');
    if (!t) return;
    active = t;
    active.setPointerCapture?.(e.pointerId);
    const rect = getRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    startLeft = parseFloat(active.style.left) || parseFloat(active.dataset.left) || 0;
    startTop = parseFloat(active.style.top) || parseFloat(active.dataset.top) || 0;
  };

  const onPointerMove = (e) => {
    if (!active) return;
    const rect = getRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - startX;
    const dy = y - startY;
    // расширяем рабочую область за границы контейнера
    const left = clamp(startLeft + (dx / rect.width) * 100, -20, 120);
    const top = clamp(startTop + (dy / rect.height) * 100, -20, 120);
    active.style.left = left + '%';
    active.style.top = top + '%';
  };

  const onPointerUp = () => {
    if (!active) return;
    active.dataset.left = String(parseFloat(active.style.left) || 0);
    active.dataset.top = String(parseFloat(active.style.top) || 0);
    // persist to localStorage
    const id = getId(active);
    saved[id] = { left: active.dataset.left, top: active.dataset.top };
    writeSaved(saved);
    active = null;
  };

  // initialize saved dataset positions
  pieces.forEach(p => {
    const id = getId(p);
    const pos = saved[id];
    if (pos) {
      p.dataset.left = pos.left;
      p.dataset.top = pos.top;
    } else {
      // seed from computed CSS
      const computed = window.getComputedStyle(p);
      const rect = getRect();
      const leftPx = parseFloat(computed.left) || 0;
      const topPx = parseFloat(computed.top) || 0;
      const leftPct = (leftPx / (rect.width || 1)) * 100;
      const topPct = (topPx / (rect.height || 1)) * 100;
      p.dataset.left = String(leftPct);
      p.dataset.top = String(topPct);
    }
    // apply into style
    p.style.left = p.dataset.left + '%';
    p.style.top = p.dataset.top + '%';
  });

  container.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Trigger explode animation by double-click/tap on область
  const triggerExplode = () => {
    if (container.dataset.closed === '1') {
      // навсегда закрыто — больше не показываем бутылку и не взрываем
      container.classList.remove('bottle-visible', 'bottle-hiding', 'breaking', 'collecting');
      return;
    }
    // назначаем направления разлета от центра контейнера
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    pieces.forEach((p, i) => {
      const pr = p.getBoundingClientRect();
      const px = pr.left - rect.left + pr.width / 2;
      const py = pr.top - rect.top + pr.height / 2;
      const vx = (px - cx);
      const vy = (py - cy);
      const k = 1.6; // коэффициент разлета
      p.style.setProperty('--explode-x', vx * k + 'px');
      p.style.setProperty('--explode-y', vy * (k + 0.2) + 'px');
      p.style.setProperty('--rotation', ((i % 2 ? 1 : -1) * (5 + i*2)) + 'deg');
      p.style.setProperty('--dur', (2.5 + (i%5)*0.15) + 's');
    });
    // Перезапускаем класс анимации breaking для повторного проигрывания
    container.classList.remove('breaking');
    // force reflow
    void container.offsetWidth;
    container.classList.add('breaking');
    // показать бутылку только если не закрыто навсегда
    if (container.dataset.closed !== '1') {
      container.classList.add('bottle-visible');
    }
  };

  // Сброс анимации при убирании мыши
  const resetAnimation = () => {
    container.classList.remove('breaking', 'bottle-visible');
    // Запускаем анимацию сбора через 5 секунд
    container.collectTimer = setTimeout(() => {
      if (!container.classList.contains('breaking')) {
        collectPieces();
      }
    }, 5000);
  };

  // Анимация сбора кусочков обратно
  const collectPieces = () => {
    console.log('collectPieces called');
    container.classList.add('collecting');
    container.classList.remove('bottle-visible', 'bottle-hiding');
    
    // После завершения анимации сбора убираем класс
    setTimeout(() => {
      console.log('Collect animation finished');
      container.classList.remove('collecting');
      pieces.forEach(p => {
        p.style.animation = 'none';
        p.style.setProperty('--explode-x', '0px');
        p.style.setProperty('--explode-y', '0px');
        p.style.setProperty('--rotation', '0deg');
      });
      // После закрытия помечаем, что больше бутылка не должна появляться
      container.dataset.closed = '1';
      container.classList.remove('breaking', 'bottle-visible', 'bottle-hiding');
    }, 2500); // время анимации + небольшой запас
  };

  // Запуск анимации при наведении
  container.addEventListener('mouseenter', () => {
    if (container.dataset.closed === '1') {
      // Ничего не делаем, оставляем камень закрытым
      container.classList.remove('bottle-visible', 'bottle-hiding', 'breaking', 'collecting');
      return;
    }
    // Отменяем таймер сбора если мышь вернулась
    clearTimeout(container.collectTimer);
    // Убираем класс исчезновения если бутылка еще исчезает
    container.classList.remove('bottle-hiding');
    // Если шла анимация сбора — отменяем и сбрасываем состояния кусочков
    if (container.classList.contains('collecting')) {
      container.classList.remove('collecting');
      pieces.forEach(p => {
        p.style.animation = 'none';
        // force reflow для сброса анимации
        void p.offsetWidth;
        p.style.animation = '';
        // сброс значений смещения
        p.style.setProperty('--explode-x', '0px');
        p.style.setProperty('--explode-y', '0px');
        p.style.setProperty('--rotation', '0deg');
        p.style.opacity = '1';
      });
    }
    
    // Если бутылка была в процессе исчезновения, плавно показываем её
    if (container.classList.contains('bottle-visible')) {
      // Бутылка уже видна, ничего не делаем
    } else {
      // Запускаем анимацию разлета
      triggerExplode();
    }
  });
  container.addEventListener('mouseleave', () => {
    if (container.dataset.closed === '1') {
      container.classList.remove('bottle-visible', 'bottle-hiding', 'breaking', 'collecting');
      return;
    }
    // Запускаем медленное исчезновение бутылки
    container.classList.remove('bottle-visible');
    container.classList.add('bottle-hiding');
    
    // Убираем класс исчезновения через время анимации
    setTimeout(() => {
      container.classList.remove('bottle-hiding');
    }, 2000);
    
    // Запускаем таймер сбора (через 7 секунд, чтобы дать время бутылке исчезнуть)
    container.collectTimer = setTimeout(() => {
      console.log('Timer fired, checking conditions...');
      console.log('breaking class:', container.classList.contains('breaking'));
      // Убираем класс breaking перед сбором
      container.classList.remove('breaking');
      console.log('Starting collect animation...');
      collectPieces();
    }, 2000);
  });
  container.addEventListener('touchstart', () => { if (container.dataset.closed !== '1') triggerExplode(); });
  container.addEventListener('touchend', () => {
    if (container.dataset.closed === '1') {
      container.classList.remove('bottle-visible', 'bottle-hiding', 'breaking', 'collecting');
      return;
    }
    // Запускаем медленное исчезновение бутылки
    container.classList.remove('bottle-visible');
    container.classList.add('bottle-hiding');
    
    // Убираем класс исчезновения через время анимации
    setTimeout(() => {
      container.classList.remove('bottle-hiding');
    }, 2000);
    
    // Запускаем таймер сбора (через 7 секунд, чтобы дать время бутылке исчезнуть)
    container.collectTimer = setTimeout(() => {
      // Убираем класс breaking перед сбором
      container.classList.remove('breaking');
      collectPieces();
    }, 5000);
  });
});


