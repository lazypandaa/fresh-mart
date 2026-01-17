import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { CreditCard, MapPin, User, Mail, Phone } from 'lucide-react'

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Create order object
    const order = {
      id: Date.now().toString(),
      items: cart,
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'Completed',
      shippingAddress: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode
      }
    }
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.unshift(order)
    localStorage.setItem('orders', JSON.stringify(existingOrders))
    
    // Update total spent
    const totalSpent = parseFloat(localStorage.getItem('total_spent') || '0')
    localStorage.setItem('total_spent', (totalSpent + cartTotal).toFixed(2))
    
    // Track purchase
    tracker.trackPurchase(order)
    
    // Simulate order processing
    setTimeout(() => {
      clearCart()
      navigate('/order-success')
    }, 2000)
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
