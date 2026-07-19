// Product Database
const products = [
    {
        id: 1,
        name: 'Luxury Rose Perfume',
        category: 'Perfumes',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1570194065650-add96e1ce488?w=400&h=400&fit=crop',
        rating: 4.8,
        reviews: 245,
        description: 'An exquisite blend of roses and vanilla notes. Perfect for any occasion.',
        reviewsList: [
            { name: 'Sarah M.', rating: 5, text: 'Absolutely stunning fragrance! Worth every penny.' },
            { name: 'Emma L.', rating: 5, text: 'Long-lasting and elegant. Highly recommended!' },
            { name: 'Jessica P.', rating: 4, text: 'Beautiful scent, very luxurious.' }
        ]
    },
    {
        id: 2,
        name: 'Diamond Luxury Bag',
        category: 'Bags',
        price: 599.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        rating: 4.9,
        reviews: 189,
        description: 'Handcrafted leather bag with premium diamond-shaped quilting.',
        reviewsList: [
            { name: 'Victoria T.', rating: 5, text: 'The most elegant bag I own. Premium quality!' },
            { name: 'Amanda K.', rating: 5, text: 'Perfect for evening events. Absolutely gorgeous.' }
        ]
    },
    {
        id: 3,
        name: 'Velvet Makeup Set',
        category: 'Makeup',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1596450546340-9a7cadc6c6f3?w=400&h=400&fit=crop',
        rating: 4.7,
        reviews: 312,
        description: 'Complete makeup collection with lipsticks, eyeshadow, and more.',
        reviewsList: [
            { name: 'Mia S.', rating: 5, text: 'Great quality and amazing colors!' },
            { name: 'Bella R.', rating: 4, text: 'Very good value for money.' }
        ]
    },
    {
        id: 4,
        name: 'Emerald Diamond Ring',
        category: 'Jewellery',
        price: 799.99,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
        rating: 4.9,
        reviews: 156,
        description: 'Stunning emerald ring with diamond accents. 18K gold setting.',
        reviewsList: [
            { name: 'Rachel G.', rating: 5, text: 'Absolutely breathtaking! Perfect engagement ring.' }
        ]
    },
    {
        id: 5,
        name: 'Premium Skincare Bundle',
        category: 'Beauty',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
        rating: 4.8,
        reviews: 234,
        description: 'Complete skincare routine with serums, creams, and masks.',
        reviewsList: [
            { name: 'Elena D.', rating: 5, text: 'My skin has never looked better! Highly recommend.' },
            { name: 'Sophie B.', rating: 5, text: 'Worth every cent. Great results in 2 weeks.' }
        ]
    },
    {
        id: 6,
        name: 'Silk Evening Gown',
        category: 'Fashion',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1595777707802-41f9a64e0cce?w=400&h=400&fit=crop',
        rating: 4.8,
        reviews: 178,
        description: 'Elegant pink silk gown, perfect for special occasions.',
        reviewsList: [
            { name: 'Lauren H.', rating: 5, text: 'Stunning dress! Fits perfectly and looks amazing.' }
        ]
    },
    {
        id: 7,
        name: 'Gold Luxury Watch',
        category: 'Jewellery',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
        rating: 4.9,
        reviews: 203,
        description: 'Luxury gold watch with diamond bezel and sapphire crystal.',
        reviewsList: [
            { name: 'Michael J.', rating: 5, text: 'Premium quality timepiece. Highly satisfied!' }
        ]
    },
    {
        id: 8,
        name: 'Luxury Lipstick Collection',
        category: 'Makeup',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1586894245616-4a6a30e2c1fa?w=400&h=400&fit=crop',
        rating: 4.7,
        reviews: 289,
        description: 'Set of 12 luxury lipsticks in various shades.',
        reviewsList: [
            { name: 'Anna M.', rating: 5, text: 'Colors are so vibrant and long-lasting!' }
        ]
    }
];

// Customer Reviews
const customerReviews = [
    {
        name: 'Sarah Anderson',
        initials: 'SA',
        rating: 5,
        text: 'GlowNest has the most amazing collection of premium products. Every purchase has been outstanding!'
    },
    {
        name: 'Emma Wilson',
        initials: 'EW',
        rating: 5,
        text: 'The quality and service are exceptional. I love shopping here and always find what I need.'
    },
    {
        name: 'Jessica Brown',
        initials: 'JB',
        rating: 4,
        text: 'Great selection of luxury items. Shipping was fast and packaging was beautiful.'
    },
    {
        name: 'Victoria Martinez',
        initials: 'VM',
        rating: 5,
        text: 'Best online luxury store I\'ve found. Highly recommend to everyone!'
    },
    {
        name: 'Amanda Taylor',
        initials: 'AT',
        rating: 5,
        text: 'Exceptional quality and customer service. Will definitely shop again!'
    },
    {
        name: 'Sophia Lee',
        initials: 'SL',
        rating: 4,
        text: 'Love the products and the elegant website design. Great experience overall.'
    }
];

// State Management
let cart = [];
let wishlist = [];
let currentProduct = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderProducts();
    renderReviews();
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
});

// Load data from localStorage
function loadFromLocalStorage() {
    const savedCart = localStorage.getItem('glownest_cart');
    const savedWishlist = localStorage.getItem('glownest_wishlist');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('glownest_cart', JSON.stringify(cart));
    localStorage.setItem('glownest_wishlist', JSON.stringify(wishlist));
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const starsHTML = generateStars(product.rating);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-icon ${isInWishlist ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${starsHTML}</span>
                    <span>(${product.reviews})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="buy-btn" onclick="openProductModal(${product.id})">
                    Buy Now
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Generate star rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '½';
    }
    
    return stars;
}

// Open Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    const modal = document.getElementById('productModal');
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    document.getElementById('modalImg').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalStars').innerHTML = generateStars(product.rating);
    document.getElementById('modalReviewCount').textContent = `(${product.reviews} reviews)`;
    
    const wishlistBtn = document.getElementById('modalWishlist');
    if (isInWishlist) {
        wishlistBtn.classList.add('active');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
    
    renderModalReviews(product.reviewsList);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Render Modal Reviews
function renderModalReviews(reviews) {
    const reviewsList = document.getElementById('modalReviewsList');
    reviewsList.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-name">${review.name}</span>
                <span class="review-date">★ ${review.rating}/5</span>
            </div>
            <p class="review-text">"${review.text}"</p>
        `;
        reviewsList.appendChild(reviewItem);
    });
}

// Close Modal
document.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.querySelector('.close')?.addEventListener('click', closeModal);

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentProduct = null;
}

// Toggle Wishlist
function toggleWishlist(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
    }
    
    saveToLocalStorage();
    updateWishlistCount();
    renderProducts();
    
    if (currentProduct && currentProduct.id === productId) {
        const wishlistBtn = document.getElementById('modalWishlist');
        if (existingIndex > -1) {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    }
    
    showNotification(`${product.name} ${existingIndex > -1 ? 'removed from' : 'added to'} wishlist!`);
}

// Add to Cart
function addToCart() {
    if (!currentProduct) return;
    
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            quantity: 1
        });
    }
    
    saveToLocalStorage();
    updateCartCount();
    showNotification(`${currentProduct.name} added to cart!`);
    closeModal();
}

document.getElementById('modalAddCart')?.addEventListener('click', addToCart);
document.getElementById('modalWishlist')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentProduct) {
        toggleWishlist(currentProduct.id, e);
    }
});

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Update Wishlist Count
function updateWishlistCount() {
    document.querySelector('.wishlist-count').textContent = wishlist.length;
}

// Cart Button
document.getElementById('cartBtn')?.addEventListener('click', () => {
    showNotification(`Cart has ${cart.length} item(s) - $${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}`);
});

// Wishlist Button
document.getElementById('wishlistBtn')?.addEventListener('click', () => {
    showNotification(`Wishlist has ${wishlist.length} item(s)`);
});

// Render Reviews
function renderReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    reviewsGrid.innerHTML = '';
    
    customerReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        let starDisplay = '';
        for (let i = 0; i < review.rating; i++) {
            starDisplay += '★';
        }
        
        reviewCard.innerHTML = `
            <div class="review-card-header">
                <div class="review-avatar">${review.initials}</div>
                <div class="review-meta">
                    <h4>${review.name}</h4>
                    <p class="review-stars">${starDisplay}</p>
                </div>
            </div>
            <p class="review-text">"${review.text}"</p>
        `;
        
        reviewsGrid.appendChild(reviewCard);
    });
}

// Newsletter Form
document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    showNotification(`Thank you! We've sent a confirmation email to ${email}`);
    this.reset();
});

// Search Functionality
document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No products found. Try another search!</p>';
    } else {
        renderFilteredProducts(filteredProducts);
    }
});

function renderFilteredProducts(filtered) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    filtered.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const starsHTML = generateStars(product.rating);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-icon ${isInWishlist ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${starsHTML}</span>
                    <span>(${product.reviews})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="buy-btn" onclick="openProductModal(${product.id})">
                    Buy Now
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Search Button
document.querySelector('.search-btn')?.addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.dispatchEvent(new Event('keyup'));
});

// CTA Button
document.querySelector('.cta-btn')?.addEventListener('click', () => {
    document.querySelector('.featured-products').scrollIntoView({ behavior: 'smooth' });
});

// Mobile Menu Toggle
document.getElementById('menuToggle')?.addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff1493, #ff69b4);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInDown 0.3s ease;
        box-shadow: 0 5px 20px rgba(255, 20, 147, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Category links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const category = this.textContent;
            if (category !== 'Home' && category !== 'Products' && category !== 'About Us' && category !== 'Contact') {
                e.preventDefault();
                const filtered = products.filter(p => p.category === category);
                renderFilteredProducts(filtered);
                document.querySelector('.featured-products').scrollIntoView({ behavior: 'smooth' });
                showNotification(`Showing ${category} products`);
            }
        });
    });
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.className.includes('product-card') ? 
                'slideUp 0.6s ease' : 
                'fadeIn 0.6s ease';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .review-card, .contact-card').forEach(el => {
    observer.observe(el);
});