import { createContext, useContext, useState, useEffect } from 'react'
import { tracker } from '../utils/eventTracker'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState(null)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      let newCart
      
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }]
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart))
      tracker.trackCartAdd(product.id, { name: product.name, price: product.price })
      return newCart
    })

    setLastAddedProduct(product)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId)
      localStorage.setItem('cart', JSON.stringify(newCart))
      tracker.trackCartRemove(productId)
      return newCart
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        showNotification,
        lastAddedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
