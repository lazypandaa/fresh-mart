import { useState, useEffect } from 'react'
import { Package, TrendingUp, Users, Zap, ChevronLeft, ChevronRight } from 'lucide-react'

export function Deals() {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const bundlesPerPage = 12

  useEffect(() => {
    fetchBundles()
  }, [currentPage])

  const fetchBundles = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bundles?page=${currentPage}&limit=${bundlesPerPage}`)
      if (!response.ok) throw new Error('Failed to fetch bundles')
      const data = await response.json()
      setBundles(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(568 / bundlesPerPage) // Assuming 568 total bundles
  const currentBundles = bundles

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading deals...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Special Deals & Bundles</h1>
        <p className="text-gray-600 text-lg">Discover our top product combinations based on customer preferences</p>
        <p className="text-sm text-gray-500 mt-2">Showing page {currentPage} of {totalPages}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentBundles.map((bundle) => (
          <div key={bundle.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Bundle #{bundle.bundle_id}</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                Rank #{bundle.bundle_rank}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm font-medium">Products in this bundle:</span>
                <div className="mt-2 space-y-2">
                  {bundle.products.map((product) => (
                    <div key={product.product_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=40&h=40&fit=crop'}
                      />
                      <span className="text-sm font-medium">{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500">Support</div>
                  <div className="font-semibold text-green-600">{(bundle.support * 100).toFixed(2)}%</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className="font-semibold text-blue-600">{(bundle.confidence * 100).toFixed(1)}%</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-xs text-gray-500">Lift</div>
                  <div className="font-semibold text-orange-600">{bundle.lift.toFixed(1)}x</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}