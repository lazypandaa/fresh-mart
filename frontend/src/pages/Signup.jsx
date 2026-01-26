import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { User, Mail, Phone, Lock, Chrome, Facebook } from 'lucide-react'

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        try {
          await fetch('http://localhost:3001/api/email/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
            }),
          });
        } catch (err) {
          console.error('Failed to send registration email', err);
        }
      
        navigate('/login');
      }
       else {
        setError(data.detail || 'Signup failed')
      }
    } catch {
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
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <p className="text-gray-600 mt-2">Join FreshMart today and start shopping</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="text" 
                  name="name"
                  placeholder="John Doe" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="email" 
                  name="email"
                  placeholder="you@example.com" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="tel" 
                  name="phone"
                  placeholder="+1 (555) 000-0000" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={formData.phone}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="••••••••" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="••••••••" 
                  className="pl-11 h-12 border-2 focus:border-black"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <label className="flex items-start gap-3 text-sm cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded" required />
              <span className="text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="font-semibold text-black hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-semibold text-black hover:underline">Privacy Policy</Link>
              </span>
            </label>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline text-black">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
