import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/Button'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { tracker } from '../utils/eventTracker'

export function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  const { cartCount } = useCart()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      fetch(`http://localhost:8000/api/products?search=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.slice(0, 5))
          setShowSuggestions(true)
        })
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      tracker.trackSearch(searchQuery)
      navigate(`/products?search=${searchQuery}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    tracker.trackClick(product.product_id, 'search_suggestion')
    setSearchQuery('')
    setShowSuggestions(false)
    navigate(`/products?search=${product.name}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">FreshMart</span>
          </Link>
          <nav className="hidden lg:flex gap-8">
            <Link to="/" className="text-sm font-medium hover:text-black transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-black transition-colors relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-black transition-colors relative group">
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/deals" className="text-sm font-medium hover:text-black transition-colors relative group">
              Deals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="flex items-center border-2 border-gray-200 rounded-full px-4 py-2.5 w-80 focus-within:border-black transition-colors">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search for fresh products..."
                className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
              />
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                {suggestions.map((product) => (
                  <button
                    key={product.product_id}
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.department}</p>
                    </div>
                    <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 rounded-full p-3">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          
          <Link to={isLoggedIn ? '/profile' : '/login'}>
            <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-full p-3">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-sm font-medium hover:text-black transition-colors">Home</Link>
            <Link to="/products" className="text-sm font-medium hover:text-black transition-colors">Products</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-black transition-colors">Categories</Link>
            <Link to="/deals" className="text-sm font-medium hover:text-black transition-colors">Deals</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
