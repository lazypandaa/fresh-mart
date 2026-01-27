const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class UserTracker {
  constructor() {
    this.sessionId = this.generateSessionId()
    this.userId = this.getUserId()
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  getUserId() {
    const email = localStorage.getItem('user_email')
    return email || 'anonymous_' + this.sessionId
  }

  async track(eventType, data = {}) {
    try {
      console.log('Tracking:', eventType, data)
      const response = await fetch(`${API_BASE}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: this.userId,
          event_type: eventType,
          session_id: this.sessionId,
          ...data
        })
      })
      const result = await response.json()
      console.log('Tracking result:', result)
    } catch (error) {
      // Silently fail if backend is unavailable - tracking should not break the app
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.warn('Analytics backend unavailable - continuing without tracking')
      } else {
        console.error('Tracking error:', error)
      }
    }
  }

  trackView(productId) {
    this.track('view', { product_id: productId })
  }

  trackSearch(query) {
    this.track('search', { search_query: query })
  }

  trackCartAdd(productId, metadata = {}) {
    this.track('cart_add', { product_id: productId, metadata })
  }

  trackCartRemove(productId) {
    this.track('cart_remove', { product_id: productId })
  }

  trackClick(productId, context = '') {
    this.track('click', { product_id: productId, metadata: { context } })
  }

  trackPurchase(orderData) {
    this.track('purchase', { metadata: orderData })
  }
}

export const tracker = new UserTracker()