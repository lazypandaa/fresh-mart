import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartNotification } from './components/CartNotification'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Products } from './pages/Products'
import { Categories } from './pages/Categories'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import { Profile } from './pages/Profile'
import { Deals } from './pages/Deals'
import { tracker } from './utils/eventTracker'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    tracker.trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CartNotification />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  )
}

export default App