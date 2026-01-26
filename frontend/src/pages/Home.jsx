import { ShoppingBag, Truck, Shield, Clock, ArrowRight, Star, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'
import { useState, useEffect } from 'react'
import { GuestLogin } from '../components/GuestLogin'

export function Home() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showGuestLogin, setShowGuestLogin] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('http://localhost:8000/api/products?limit=8')
      const productsData = await productsRes.json()
      setProducts(productsData.products || productsData)

      // Fetch departments
      const deptRes = await fetch('http://localhost:8000/api/departments')
      const deptData = await deptRes.json()
      setDepartments(deptData.departments)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = departments.map((dept, idx) => ({
    name: dept.name,
    image: ['🥬', '🥛', '🥩', '🍞', '🥤', '🍿'][idx] || '🛒',
    count: `${Math.floor(Math.random() * 50 + 20)}+ items`,
    color: ['bg-green-50', 'bg-blue-50', 'bg-red-50', 'bg-yellow-50', 'bg-purple-50', 'bg-orange-50'][idx] || 'bg-gray-50'
  }))

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders over $50', color: 'bg-blue-50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions', color: 'bg-green-50' },
    { icon: Clock, title: 'Quick Service', desc: 'Same day delivery', color: 'bg-purple-50' },
    { icon: ShoppingBag, title: 'Quality Products', desc: 'Fresh & organic', color: 'bg-orange-50' },
  ]

  const deals = [
    { title: 'Weekend Special', discount: '30% OFF', desc: 'On all fresh fruits' },
    { title: 'New Customer', discount: '$10 OFF', desc: 'First order above $50' },
    { title: 'Bundle Deal', discount: 'Buy 2 Get 1', desc: 'On selected items' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Fresh Arrivals Every Day</span>
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Fresh Groceries
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Delivered to Your Door
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Shop from our wide selection of fresh produce, dairy, meat, and more. 
              Quality guaranteed with same-day delivery.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="group" onClick={() => navigate('/login')}>
                Login for Better Recommendations
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-2" onClick={() => setShowGuestLogin(true)}>
                Guest
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="bg-black text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto gap-8 scrollbar-hide">
            {deals.map((deal, idx) => (
              <div key={idx} className="flex items-center gap-4 min-w-fit">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{deal.discount}</span>
                  <div>
                    <p className="text-sm font-semibold">{deal.title}</p>
                    <p className="text-xs text-gray-400">{deal.desc}</p>
                  </div>
                </div>
                {idx < deals.length - 1 && <div className="h-8 w-px bg-gray-700"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group">
                <Card className="border-2 hover:border-black transition-all hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our wide range of fresh products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Card key={idx} className="group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-black">
                <CardContent className="p-8 text-center">
                  <div className={`${cat.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-5xl group-hover:scale-110 transition-transform`}>
                    {cat.image}
                  </div>
                  <h3 className="font-bold mb-2 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked fresh items just for you</p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="border-2 group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              </div>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-black overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative bg-gray-50 h-48 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.department}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold mb-3 text-lg">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.5</span>
                        </div>
                      </div>
                      <Button className="w-full group-hover:bg-black transition-colors" onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}>Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-400 mb-8 text-lg">Get exclusive deals, recipes, and updates delivered to your inbox</p>
            <div className="flex gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 h-14 rounded-xl px-6 text-black text-base"
              />
              <Button className="bg-white text-black hover:bg-gray-100 h-14 px-8 text-base font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-4">Join 50,000+ subscribers. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
      
      {showGuestLogin && (
        <GuestLogin onClose={() => setShowGuestLogin(false)} />
      )}
    </div>
  )
}
