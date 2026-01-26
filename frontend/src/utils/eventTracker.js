const API_BASE = 'http://localhost:8000/api'

class EventTracker {
  constructor() {
    this.sessionId = this.generateSessionId()
    this.cartState = { items: 0, value: 0 }
    this.updateUserId()
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  updateUserId() {
    const guestUser = JSON.parse(localStorage.getItem('guestUser') || 'null')
    if (guestUser) {
      this.userId = guestUser.guest_id || guestUser.email.split('@')[0] // Use guest_0002 instead of guest_0002@guest.com
    } else {
      const email = localStorage.getItem('user_email')
      this.userId = email || 'anonymous_' + this.sessionId
    }
  }

  getUserId() {
    this.updateUserId() // Always get fresh user ID
    return this.userId
  }

  updateCartState() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    this.cartState.items = cart.reduce((total, item) => total + item.quantity, 0)
    this.cartState.value = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  async trackEvent(eventType, productId = null, data = {}) {
    try {
      const userId = this.getUserId()
      console.log(`Tracking event: ${eventType} for user: ${userId}`)
      
      await fetch(`${API_BASE}/events/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: this.sessionId,
          event_type: eventType,
          product_id: productId,
          data: data
        })
      })
    } catch (error) {
      console.error('Event tracking error:', error)
    }
  }

  async trackCartEvent(action, productId, quantity = 1) {
    try {
      this.updateCartState()
      const userId = this.getUserId()
      console.log(`Tracking cart event: ${action} for user: ${userId}`)
      
      await fetch(`${API_BASE}/events/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: this.sessionId,
          action: action,
          product_id: productId,
          quantity: quantity,
          cart_total_items: this.cartState.items,
          cart_total_value: this.cartState.value
        })
      })
    } catch (error) {
      console.error('Cart tracking error:', error)
    }
  }

  // Event methods
  trackProductView(productId, productData = {}) {
    this.trackEvent('product_view', productId, productData)
  }

  trackSearch(query) {
    this.trackEvent('search', null, { search_query: query })
  }

  trackCartAdd(productId, productData = {}) {
    this.trackCartEvent('add', productId, 1)
    this.trackEvent('cart_add', productId, productData)
  }

  trackCartRemove(productId) {
    this.trackCartEvent('remove', productId, 1)
    this.trackEvent('cart_remove', productId)
  }

  trackPurchase(orderData) {
    this.trackEvent('purchase', null, orderData)
  }
}

export const tracker = new EventTracker()