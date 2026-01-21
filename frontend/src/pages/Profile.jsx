import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { User, Mail, Phone, LogOut, MapPin, Calendar, ShoppingBag, Package, Edit2 } from 'lucide-react'

export function Profile() {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [orders, setOrders] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const email = localStorage.getItem('user_email')
    const name = localStorage.getItem('user_name') || 'User'
    const phone = localStorage.getItem('user_phone') || ''
    const address = localStorage.getItem('user_address') || ''
    const city = localStorage.getItem('user_city') || ''
    const zipCode = localStorage.getItem('user_zipCode') || ''

    setFormData({ name, email, phone, address, city, zipCode })
    
    // Fetch orders from database
    if (email) {
      fetchOrders(email)
    }
  }, [navigate])

  const fetchOrders = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${email}`)
      const data = await response.json()
      setOrders(data.orders || [])
      
      // Calculate total spent
      const total = data.orders.reduce((sum, order) => sum + order.total, 0)
      setTotalSpent(total)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    localStorage.setItem('user_name', formData.name)
    localStorage.setItem('user_phone', formData.phone)
    localStorage.setItem('user_address', formData.address)
    localStorage.setItem('user_city', formData.city)
    localStorage.setItem('user_zipCode', formData.zipCode)
    setEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_phone')
    localStorage.removeItem('user_address')
    localStorage.removeItem('user_city')
    localStorage.removeItem('user_zipCode')
    navigate('/login')
  }

  const memberSince = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 relative">
              <button
                onClick={() => setEditing(!editing)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </button>
              <CardContent className="p-6">
                {!editing ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-5xl">{formData.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                    <p className="text-sm text-gray-600 mb-4">{formData.email}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                      <Calendar className="h-3 w-3" />
                      <span>Member since {memberSince}</span>
                    </div>
                    <div className="w-full space-y-3 text-left">
                      {formData.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{formData.phone}</span>
                        </div>
                      )}
                      {formData.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-gray-700">
                            <div>{formData.address}</div>
                            {(formData.city || formData.zipCode) && (
                              <div>{formData.city}{formData.city && formData.zipCode && ', '}{formData.zipCode}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-5xl">{formData.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Email</label>
                      <Input
                        name="email"
                        value={formData.email}
                        disabled
                        className="h-10 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Phone</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Address</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">City</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">ZIP Code</label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        className="h-10"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} className="flex-1 h-10">
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(false)}
                        className="flex-1 h-10 border-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Total Orders</span>
                  </div>
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Total Spent</span>
                  </div>
                  <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => navigate('/products')}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 mb-4">No orders yet</p>
                    <Button onClick={() => navigate('/products')}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <p className="text-sm text-gray-600 mb-2">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex gap-2 overflow-x-auto">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'
                                  }}
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
