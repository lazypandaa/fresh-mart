const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Helper function to check if error is a network/fetch failure
function isNetworkError(error) {
  return error.name === 'TypeError' && 
         (error.message.includes('Failed to fetch') || 
          error.message.includes('Load failed') ||
          error.message.includes('NetworkError'))
}

class EventTracker {
  constructor() {
    this.sessionId = this.generateSessionId()
    this.cartState = { items: 0, value: 0 }
    this.updateUserId()
    // Don't init session immediately - wait for user state to be determined
    setTimeout(() => this.initSession(), 100)
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  updateUserId() {
    // First check for logged-in user email
    const userEmail = localStorage.getItem('user_email')
    console.log('Checking user_email from localStorage:', userEmail)
    
    if (userEmail) {
      this.userId = userEmail
      console.log('Set userId to logged-in email:', this.userId)
      return
    }
    
    // Then check for guest user
    const guestUser = JSON.parse(localStorage.getItem('guestUser') || 'null')
    console.log('Checking guestUser from localStorage:', guestUser)
    
    if (guestUser) {
      this.userId = guestUser.guest_id || guestUser.email.split('@')[0]
      console.log('Set userId to guest:', this.userId)
      return
    }
    
    // Default to anonymous
    this.userId = 'anonymous_' + this.sessionId
    console.log('Set userId to anonymous:', this.userId)
  }

  getUserId() {
    this.updateUserId() // Always get fresh user ID
    return this.userId
  }

  async initSession() {
    try {
      const userId = this.getUserId()
      const isLoggedIn = !userId.startsWith('anonymous_')
      
      console.log('Session init - userId:', userId, 'isLoggedIn:', isLoggedIn)
      
      const payload = {
        user_id: isLoggedIn ? userId : null,
        session_id: this.sessionId,
        action: 'start',
        data: {
          user_agent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          user_type: isLoggedIn ? 'logged_in' : 'anonymous'
        }
      }
      
      console.log('Sending session init payload:', payload)
      
      const response = await fetch(`${API_BASE}/track/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      console.log(`Session started: ${this.sessionId} for user: ${userId} (${isLoggedIn ? 'logged in' : 'anonymous'})`)
    } catch (error) {
      // Silently fail if backend is unavailable - tracking should not break the app
      if (isNetworkError(error)) {
        console.warn('Analytics backend unavailable - continuing without session tracking')
      } else {
        console.error('Session init error:', error)
      }
    }
  }

  async trackSession(action, data = {}) {
    try {
      const userId = this.getUserId()
      const isLoggedIn = !userId.startsWith('anonymous_')
      
      const payload = {
        user_id: isLoggedIn ? userId : null,
        session_id: this.sessionId,
        action: action,
        data: {
          url: window.location.href,
          timestamp: new Date().toISOString(),
          user_type: isLoggedIn ? 'logged_in' : 'anonymous',
          ...data
        }
      }
      
      console.log('Sending session payload:', payload)
      
      const response = await fetch(`${API_BASE}/track/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      console.log('Session tracked successfully:', action)
    } catch (error) {
      // Silently fail if backend is unavailable - tracking should not break the app
      if (isNetworkError(error)) {
        console.warn('Analytics backend unavailable - continuing without session tracking')
      } else {
        console.error('Session tracking error:', error)
      }
    }
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
      // Silently fail if backend is unavailable - tracking should not break the app
      if (isNetworkError(error)) {
        console.warn('Analytics backend unavailable - continuing without event tracking')
      } else {
        console.error('Event tracking error:', error)
      }
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
      // Silently fail if backend is unavailable - tracking should not break the app
      if (isNetworkError(error)) {
        console.warn('Analytics backend unavailable - continuing without cart tracking')
      } else {
        console.error('Cart tracking error:', error)
      }
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
    this.trackSession('purchase', orderData)
  }

  trackPageView(page) {
    this.trackSession('page_view', { page })
  }

  endSession() {
    this.trackSession('end')
  }
}

export const tracker = new EventTracker()

// Track page unload
window.addEventListener('beforeunload', () => {
  tracker.endSession()
})