import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Star, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'

export function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [departments, setDepartments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const { addToCart } = useCart()
  const itemsPerPage = 20

  useEffect(() => {
    fetchDepartments()
    
    // Check if user just logged in
    const shouldShowWelcome = localStorage.getItem('show_welcome')
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true)
      localStorage.removeItem('show_welcome')
    }
  }, [])

  const closeWelcome = () => {
    setShowWelcome(false)
  }

  const getUserName = () => {
    const email = localStorage.getItem('user_email')
    return email ? email.split('@')[0] : 'User'
  }

  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      fetchProducts('all', searchQuery, 1)
      setSelectedDepartment('all')
      setCurrentPage(1)
    } else {
      fetchProducts(selectedDepartment, null, currentPage)
    }
  }, [selectedDepartment, searchParams, currentPage])

  useEffect(() => {
    // Track product views when products are loaded
    products.forEach(product => {
      tracker.trackProductView(product.id, {
        name: product.name,
        department: product.department,
        price: product.price
      })
    })
  }, [products])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departments')
      const data = await response.json()
      setDepartments(data.departments.map(dept => dept.name))
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchProducts = async (department = 'all', search = null, page = 1) => {
    try {
      setLoading(true)
      const skip = (page - 1) * itemsPerPage
      let url = `http://localhost:8000/api/products?limit=${itemsPerPage}&skip=${skip}`
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      } else if (department !== 'all') {
        url += `&department=${department}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
      setTotal(data.total || 0)
      setHasMore(data.has_more || false)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept)
    setCurrentPage(1)
  }

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome {getUserName()}!</h2>
            <p className="text-gray-600 mb-6">You're successfully logged in. Start shopping for fresh groceries!</p>
            <Button onClick={closeWelcome} className="w-full">
              Start Shopping
            </Button>
            <button 
              onClick={closeWelcome}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'Our Products'}
          </h1>
          <p className="text-gray-600 text-lg">Fresh groceries delivered to your doorstep</p>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, total)} of {total} products
            </p>
          )}
        </div>

        {/* Department Filter */}
        <div className="mb-8 relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <Button
              variant={selectedDepartment === 'all' ? 'default' : 'outline'}
              onClick={() => handleDepartmentChange('all')}
              className="whitespace-nowrap flex-shrink-0"
            >
              All Products
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? 'default' : 'outline'}
                onClick={() => handleDepartmentChange(dept)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {dept}
              </Button>
            ))}
          </div>
          {departments.length > 6 && (
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none flex items-center justify-end pr-1">
              <div className="text-gray-400 text-xs animate-pulse">→</div>
            </div>
          )}
          {departments.length > 6 && (
            <p className="text-xs text-gray-500 mt-2 text-center">← Scroll to see more categories →</p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-black overflow-hidden"
                  onClick={() => tracker.trackClick(product.id, 'product_grid')}>
                  <CardContent className="p-0">
                    <div className="relative bg-gray-100 h-64 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center'
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                        {product.department}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-500 mb-2">{product.aisle}</p>
                      <h3 className="font-bold mb-3 text-lg">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.5</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full group-hover:bg-black transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="border-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="border-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
