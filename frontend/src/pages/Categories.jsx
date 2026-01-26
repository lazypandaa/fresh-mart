import { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'

export function Categories() {
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/departments')
      const data = await response.json()
      setDepartments(data.departments)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsByDepartment = async (departmentName) => {
    try {
      setProductsLoading(true)
      const response = await fetch(`http://localhost:8000/api/products?department=${departmentName}&limit=50`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setProductsLoading(false)
    }
  }

  const handleCategoryClick = (department) => {
    setSelectedDepartment(department.name)
    fetchProductsByDepartment(department.name)
  }

  const handleBackToCategories = () => {
    setSelectedDepartment(null)
    setProducts([])
  }

  const categoryEmojis = {
    'produce': '🥬',
    'dairy eggs': '🥛',
    'meat seafood': '🥩',
    'bakery': '🍞',
    'beverages': '🥤',
    'snacks': '🍿',
    'frozen': '❄️',
    'pantry': '🥫',
    'personal care': '🧴',
    'household': '🧽'
  }

  if (selectedDepartment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={handleBackToCategories}
              className="mb-4 border-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
            <h1 className="text-5xl font-bold mb-4 capitalize">{selectedDepartment}</h1>
            <p className="text-gray-600 text-lg">Products in {selectedDepartment} category</p>
          </div>

          {productsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-black overflow-hidden">
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
                          addToCart(product)
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
          )}

          {!productsLoading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Shop by Category</h1>
          <p className="text-gray-600 text-lg">Browse our wide selection of fresh products by category</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <Card 
                key={dept.id} 
                className="group cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 border-2 hover:border-black"
                onClick={() => handleCategoryClick(dept)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-5xl group-hover:scale-110 transition-transform">
                    {categoryEmojis[dept.name.toLowerCase()] || '🛒'}
                  </div>
                  <h3 className="font-bold mb-2 text-lg capitalize">{dept.name}</h3>
                  <p className="text-sm text-gray-500">Browse products</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}