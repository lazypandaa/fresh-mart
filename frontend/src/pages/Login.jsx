import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Mail, Lock, Chrome, Facebook } from 'lucide-react'
import { tracker } from '../utils/eventTracker'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user_email', email)
        localStorage.setItem('show_welcome', 'true')
        
        // Update tracker with new user ID
        tracker.updateUserId()
        tracker.trackSession('login', { email: email })
        
        navigate('/products')
      } else {
        setError(data.detail || 'Login failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <p className="text-gray-600 mt-2">Sign in to your FreshMart account</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-semibold">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="h-12 border-2 hover:border-black">
                <Chrome className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button variant="outline" type="button" className="h-12 border-2 hover:border-black">
                <Facebook className="mr-2 h-5 w-5" />
                Facebook
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 pt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold hover:underline text-black">
                Sign up for free
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
