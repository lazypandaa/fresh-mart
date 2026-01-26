import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'

export function GuestLogin({ onClose }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGuestLogin = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/auth/guest-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })

      if (response.ok) {
        const guestData = await response.json()
        localStorage.setItem('guestUser', JSON.stringify(guestData))
        localStorage.setItem('isGuest', 'true')
        navigate('/products')
      } else {
        throw new Error('Failed to create guest account')
      }
    } catch (error) {
      console.error('Guest login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Continue as Guest</h2>
          <p className="text-gray-600">Enter your name to start shopping</p>
        </div>

        <form onSubmit={handleGuestLogin}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}