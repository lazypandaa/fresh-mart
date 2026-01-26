import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { CreditCard, MapPin, User, Mail, Phone, CheckCircle } from 'lucide-react'

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  })

  useEffect(() => {
    // Load user profile data from localStorage
    const isGuest = localStorage.getItem('isGuest')
    const guestUser = JSON.parse(localStorage.getItem('guestUser') || 'null')
    
    if (isGuest && guestUser) {
      setFormData(prev => ({
        ...prev,
        name: guestUser.name,
        email: guestUser.email,
        phone: '',
        address: '',
        city: '',
        zipCode: ''
      }))
    } else {
      const name = localStorage.getItem('user_name') || ''
      const email = localStorage.getItem('user_email') || ''
      const phone = localStorage.getItem('user_phone') || ''
      const address = localStorage.getItem('user_address') || ''
      const city = localStorage.getItem('user_city') || ''
      const zipCode = localStorage.getItem('user_zipCode') || ''

      setFormData(prev => ({
        ...prev,
        name,
        email,
        phone,
        address,
        city,
        zipCode
      }))
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Create order object for API
      const orderData = {
        user_email: formData.email,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          department: item.department,
          image_url: item.image_url
        })),
        total: cartTotal,
        shipping_address: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        }
      }
      
      // Save order to database
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (response.ok) {
        const savedOrder = await response.json()
        
        // Track purchase
        tracker.trackPurchase(savedOrder)
        
        // Play success sound
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
          audio.play().catch(() => {})
        } catch (e) {}
        
        // Show success animation
        setShowSuccess(true)
        
        // Clear cart and redirect after animation
        setTimeout(() => {
          clearCart()
          navigate('/products')
        }, 4000)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      console.error('Order creation failed:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center max-w-md mx-4">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto animate-pulse" style={{animationDuration: '2s'}}>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse" style={{animationDuration: '1.5s'}}>
                <CheckCircle className="h-16 w-16 text-green-600" style={{animation: 'checkmark 1s ease-in-out'}} />
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-green-200 rounded-full mx-auto" style={{animation: 'ripple 2s ease-out infinite'}}></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-green-100 rounded-full mx-auto" style={{animation: 'ripple 2s ease-out infinite 0.5s'}}></div>
          </div>
          <h2 className="text-4xl font-bold text-green-600 mb-4" style={{animation: 'fadeInUp 1s ease-out 0.5s both'}}>Order Placed!</h2>
          <p className="text-gray-600 mb-6 text-lg" style={{animation: 'fadeInUp 1s ease-out 0.8s both'}}>Your order has been successfully placed and will be delivered soon</p>
          <div className="flex justify-center mb-4" style={{animation: 'fadeInUp 1s ease-out 1.1s both'}}>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" style={{animationDuration: '1s'}}></div>
          </div>
          <p className="text-sm text-gray-500" style={{animation: 'fadeInUp 1s ease-out 1.4s both'}}>Redirecting to products...</p>
        </div>
        
        <style jsx>{`
          @keyframes checkmark {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
            100% { transform: scale(1) rotate(360deg); opacity: 1; }
          }
          
          @keyframes ripple {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          
          @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Phone</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Street Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">City</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">ZIP Code</label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Card Number</label>
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Expiry Date</label>
                      <Input
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">CVV</label>
                      <Input
                        name="cardCVV"
                        value={formData.cardCVV}
                        onChange={handleChange}
                        placeholder="123"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order - $${cartTotal.toFixed(2)}`}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
