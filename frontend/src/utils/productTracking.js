// Frontend tracking utilities
class ProductTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.viewedProducts = new Set(); // In-memory dedupe
    this.impressionObserver = null;
    this.impressionQueue = [];
    this.impressionTimer = null;
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

  // Track explicit product views (clicks, navigation)
  trackProductView(productId, source = 'card_click', additionalData = {}) {
    const key = `${this.sessionId}_${productId}`;
    
    // Deduplicate by session + product
    if (this.viewedProducts.has(key)) {
      return;
    }
    
    this.viewedProducts.add(key);
    
    // Store in sessionStorage for page reload persistence
    const viewed = JSON.parse(sessionStorage.getItem('viewed_products') || '[]');
    if (!viewed.includes(key)) {
      viewed.push(key);
      sessionStorage.setItem('viewed_products', JSON.stringify(viewed));
    }

    // Send to backend
    this.sendEvent('/api/track/product-view', {
      product_id: productId,
      session_id: this.sessionId,
      source: source,
      data: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        ...additionalData
      }
    });
  }

  // Initialize impression tracking
  initImpressionTracking() {
    if (!('IntersectionObserver' in window)) return;

    this.impressionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const productId = entry.target.dataset.productId;
        if (!productId) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Start tracking visibility
          entry.target._impressionStart = Date.now();
        } else if (entry.target._impressionStart) {
          // Calculate duration
          const duration = Date.now() - entry.target._impressionStart;
          if (duration >= 500) { // Minimum 500ms visibility
            this.queueImpression(productId, duration, entry.intersectionRatio);
          }
          delete entry.target._impressionStart;
        }
      });
    }, {
      threshold: [0.5], // 50% visibility
      rootMargin: '0px'
    });
  }

  queueImpression(productId, duration, visibility) {
    this.impressionQueue.push({
      product_id: productId,
      duration: duration,
      visibility: visibility,
      timestamp: new Date().toISOString()
    });

    // Batch send impressions every 5 seconds or when queue reaches 10
    if (this.impressionQueue.length >= 10) {
      this.flushImpressions();
    } else if (!this.impressionTimer) {
      this.impressionTimer = setTimeout(() => this.flushImpressions(), 5000);
    }
  }

  flushImpressions() {
    if (this.impressionQueue.length === 0) return;

    this.sendEvent('/api/track/impressions', {
      impressions: [...this.impressionQueue],
      session_id: this.sessionId
    });

    this.impressionQueue = [];
    if (this.impressionTimer) {
      clearTimeout(this.impressionTimer);
      this.impressionTimer = null;
    }
  }

  // Observe product elements for impressions
  observeProduct(element) {
    if (this.impressionObserver && element.dataset.productId) {
      this.impressionObserver.observe(element);
    }
  }

  // Send tracking event to backend
  async sendEvent(endpoint, data) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if available
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Tracking failed:', error);
    }
  }

  // Initialize from sessionStorage on page load
  init() {
    const viewed = JSON.parse(sessionStorage.getItem('viewed_products') || '[]');
    viewed.forEach(key => this.viewedProducts.add(key));
    this.initImpressionTracking();
  }
}

// React Hook
export const useProductTracking = () => {
  const [tracker] = useState(() => new ProductTracker());
  
  useEffect(() => {
    tracker.init();
    return () => {
      tracker.flushImpressions();
    };
  }, [tracker]);

  return {
    trackProductView: tracker.trackProductView.bind(tracker),
    observeProduct: tracker.observeProduct.bind(tracker)
  };
};

// React Component Examples
export const ProductCard = ({ product }) => {
  const { trackProductView, observeProduct } = useProductTracking();
  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      observeProduct(cardRef.current);
    }
  }, [observeProduct]);

  const handleClick = () => {
    trackProductView(product.id, 'card_click', {
      category: product.category,
      price: product.price
    });
    // Navigate to product page
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      ref={cardRef}
      data-product-id={product.id}
      onClick={handleClick}
      className="product-card cursor-pointer"
    >
      {/* Product content */}
    </div>
  );
};

export const ProductDetail = ({ productId }) => {
  const { trackProductView } = useProductTracking();

  useEffect(() => {
    trackProductView(productId, 'detail_page');
  }, [productId, trackProductView]);

  return <div>{/* Product details */}</div>;
};

// Usage in components:
// 1. Product card click: trackProductView(productId, 'card_click')
// 2. Product detail page: trackProductView(productId, 'detail_page') 
// 3. Quick view modal: trackProductView(productId, 'quick_view')
// 4. Impressions: Automatic via IntersectionObserver

export default ProductTracker;