// Catalog functionality
class CatalogManager {
  constructor() {
    this.products = [
      {
        id: 1,
        name: 'Горная ледниковая вода',
        price: 89,
        volume: '0.5 л',
        description: 'Чистейшая вода из горных ледников с уникальным минеральным составом.',
        category: 'premium'
      },
      {
        id: 2,
        name: 'Родниковая премиум',
        price: 149,
        volume: '1 л',
        description: 'Натуральная родниковая вода с уникальным минеральным составом.',
        category: 'premium'
      },
      {
        id: 3,
        name: 'Минеральная классик',
        price: 199,
        volume: '1.5 л',
        description: 'Сбалансированная минеральная вода для ежедневного употребления.',
        category: 'classic'
      },
      {
        id: 4,
        name: 'Артезианская элит',
        price: 249,
        volume: '2 л',
        description: 'Глубинная артезианская вода с природной фильтрацией.',
        category: 'premium'
      },
      {
        id: 5,
        name: 'Детская вода',
        price: 179,
        volume: '0.33 л',
        description: 'Специально подготовленная вода для детей с мягким составом.',
        category: 'kids'
      },
      {
        id: 6,
        name: 'Спортивная вода',
        price: 129,
        volume: '0.75 л',
        description: 'Вода с добавлением электролитов для активного образа жизни.',
        category: 'sports'
      },
      {
        id: 7,
        name: 'Вода для кулера',
        price: 299,
        volume: '19 л',
        description: 'Большая бутыль для кулера с доставкой на дом.',
        category: 'cooler'
      },
      {
        id: 8,
        name: 'Минеральная лечебная',
        price: 189,
        volume: '1 л',
        description: 'Лечебно-столовая вода с высоким содержанием минералов.',
        category: 'medical'
      }
    ];
    
    this.cart = this.loadCart();
    this.filteredProducts = [...this.products];
    
    this.init();
  }
  
  init() {
    this.renderProducts();
    this.setupEventListeners();
    this.updateCartUI();
    this.handleSearchFromURL();
  }
  
  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterProducts(e.target.value);
      });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortProducts(e.target.value);
      });
    }
    
    // Cart button
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        this.openCart();
      });
    }
    
    // Cart modal close
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.querySelector('.cart-modal__close');
    if (cartClose) {
      cartClose.addEventListener('click', () => {
        this.closeCart();
      });
    }
    
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          this.closeCart();
        }
      });
    }
    
    // Checkout button - removed old handler, new one is in DOMContentLoaded
  }
  
  handleSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      document.getElementById('q').textContent = searchQuery;
      document.getElementById('productSearch').value = searchQuery;
      this.filterProducts(searchQuery);
    }
  }
  
  filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.volume.toLowerCase().includes(term)
    );
    this.renderProducts();
  }
  
  sortProducts(sortType) {
    switch (sortType) {
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'volume-asc':
        this.filteredProducts.sort((a, b) => this.parseVolume(a.volume) - this.parseVolume(b.volume));
        break;
      case 'volume-desc':
        this.filteredProducts.sort((a, b) => this.parseVolume(b.volume) - this.parseVolume(a.volume));
        break;
    }
    this.renderProducts();
  }
  
  parseVolume(volume) {
    return parseFloat(volume.replace(/[^\d.]/g, ''));
  }
  
  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    if (this.filteredProducts.length === 0) {
      grid.innerHTML = '<div class="no-products"><p>Товары не найдены</p></div>';
      return;
    }
    
    grid.innerHTML = this.filteredProducts.map(product => `
      <div class="product" data-id="${product.id}">
        <div class="product-media">
          <div class="product-icon">${this.getProductIcon(product)}</div>
          <div class="bubbles">
            <span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="volume">${product.volume}</div>
        <h3>${product.name}</h3>
        <div class="price">${product.price}</div>
        <div class="description">${product.description}</div>
        <button class="add-to-cart" onclick="catalogManager.addToCart(${product.id})">
          Добавить в корзину
        </button>
      </div>
    `).join('');
  }

  getProductIcon(product) {
    const size = 64;
    const gradId = `grad-${product.id}`;
    const name = (product.name || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const base = (inner) => `
      <svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name}">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3bb289"/>
            <stop offset="100%" stop-color="#2aa673"/>
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#softShadow)">${inner}</g>
      </svg>`;

    // New icon set inspired by provided references
    const icons = {
      iceberg: `
        <path d="M8 46L20 26L26 34L32 24L44 46H8Z" fill="url(#${gradId})"/>
        <path d="M20 26L18 30H24L20 26Z" fill="#a6e3c5"/>
        <path d="M32 24L30 28H36L32 24Z" fill="#a6e3c5"/>`,
      trees: `
        <path d="M18 40C18 32 24 26 24 26C24 26 30 32 30 40C30 44.4183 26.4183 48 22 48C17.5817 48 14 44.4183 14 40" fill="url(#${gradId})"/>
        <rect x="22" y="36" width="2" height="12" rx="1" fill="#2f7d62"/>
        <path d="M36 42C36 36 41 32 41 32C41 32 46 36 46 42C46 45.3137 43.3137 48 40 48C36.6863 48 34 45.3137 34 42" fill="url(#${gradId})"/>
        <rect x="39" y="38" width="2" height="10" rx="1" fill="#2f7d62"/>`,
      recycle: `
        <path d="M22 28L30 20L34 24" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 28L34 20L30 24" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 44L24 36H30" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
      earth: `
        <circle cx="32" cy="36" r="12" stroke="url(#${gradId})" stroke-width="3"/>
        <path d="M24 36C28 34 36 34 40 36" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 30C28 34 36 38 36 42" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>`,
      handsWater: `
        <path d="M20 42C20 39 24 38 26 40C28 42 30 42 32 41" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>
        <path d="M44 42C44 39 40 38 38 40C36 42 34 42 32 41" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>
        <path d="M28 28C26 30 26 32 28 34" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>
        <path d="M36 26C34 28 34 30 36 32" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>`,
      bulbLeaves: `
        <circle cx="32" cy="30" r="10" stroke="url(#${gradId})" stroke-width="3"/>
        <rect x="28" y="40" width="8" height="4" rx="2" fill="url(#${gradId})"/>
        <path d="M28 34C30 32 34 32 36 34" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>`,
      gearLeaf: `
        <circle cx="32" cy="36" r="8" stroke="url(#${gradId})" stroke-width="3"/>
        <path d="M36 30L38 32M26 40L24 38M38 40L40 38M24 32L26 30" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 34C34 34 36 36 36 40" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round"/>`,
      solarPanel: `
        <rect x="20" y="30" width="24" height="12" rx="2" stroke="url(#${gradId})" stroke-width="3"/>
        <path d="M28 30V42M36 30V42M20 36H44" stroke="url(#${gradId})" stroke-width="3"/>
        <circle cx="46" cy="24" r="4" fill="url(#${gradId})"/>`,
      dropEnergy: `
        <path d="M32 22C28 28 24 30 24 36C24 40.4183 27.5817 44 32 44C36.4183 44 40 40.4183 40 36C40 30 36 28 32 22Z" stroke="url(#${gradId})" stroke-width="3"/>
        <path d="M31 32L27 36H33L29 40" stroke="url(#${gradId})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      `
    };

    const pick = () => {
      if (category === 'premium' && name.includes('ледник')) return icons.iceberg; // glacier
      if (category === 'premium' && name.includes('родник')) return icons.trees; // spring/nature
      if (category === 'classic' || name.includes('минерал')) return icons.recycle; // mineral
      if (category === 'premium' || name.includes('артези')) return icons.earth; // artesian/planet
      if (category === 'kids' || name.includes('дет')) return icons.handsWater; // kids
      if (category === 'sports' || name.includes('спорт')) return icons.bulbLeaves; // energy/ideas
      if (category === 'cooler' || name.includes('кулер')) return icons.gearLeaf; // equipment
      if (category === 'medical' || name.includes('лечеб')) return icons.dropEnergy; // medical/energized
      return icons.recycle;
    };

    return base(pick());
  }
  
  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = this.cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        volume: product.volume,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartUI();
    this.showAddToCartAnimation(productId);
  }
  
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
    this.renderCartItems();
  }
  
  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateCartUI();
      this.renderCartItems();
    }
  }
  
  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }
  
  openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.add('open');
      this.renderCartItems();
    }
  }
  
  closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.remove('open');
    }
  }
  
  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <p>Корзина пуста</p>
          <a href="catalog.html" class="btn btn-primary">Перейти к каталогу</a>
        </div>
      `;
      cartFooter.style.display = 'none';
      return;
    }
    
    cartItems.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">${item.price} ₽</div>
        </div>
        <div class="cart-item__controls">
          <div class="cart-item__quantity">
            <button onclick="catalogManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="catalogManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
          <button class="cart-item__remove" onclick="catalogManager.removeFromCart(${item.id})">
            Удалить
          </button>
        </div>
      </div>
    `).join('');
    
    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
      cartTotal.textContent = total;
    }
    cartFooter.style.display = 'block';
  }
  
  // Old checkout method removed - now redirects to checkout page
  
  showAddToCartAnimation(productId) {
    const product = document.querySelector(`[data-id="${productId}"]`);
    if (product) {
      product.style.transform = 'scale(0.95)';
      setTimeout(() => {
        product.style.transform = '';
      }, 200);
    }
  }
  
  saveCart() {
    localStorage.setItem('equaline_cart', JSON.stringify(this.cart));
  }
  
  loadCart() {
    return JSON.parse(localStorage.getItem('equaline_cart') || '[]');
  }
}

// Initialize catalog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.catalogManager = new CatalogManager();
  
  // Add checkout button handler
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    console.log('Checkout button found and handler added');
    checkoutBtn.addEventListener('click', () => {
      console.log('Checkout button clicked!');
      // Save cart items to localStorage for checkout page
      const cartItems = window.catalogManager.cart;
      console.log('Cart items:', cartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Redirect to checkout page
      console.log('Redirecting to checkout...');
      window.location.href = 'checkout.html';
    });
  } else {
    console.log('Checkout button not found!');
  }
});
