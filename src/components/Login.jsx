import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, error: authError, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    // Mock login - in production this would validate with your backend
    setTimeout(() => {
      const user = { 
        name: formData.email.split('@')[0],
        email: formData.email,
        token: 'login-token'
      }
      login(user)
      setLoading(false)
      nav('/')
    }, 800)
  }

  const handleGoogle = () => {
    setLoading(true)
    setTimeout(() => {
      const user = {
        name: 'Google User',
        email: 'google@example.com',
        token: 'google-token'
      }
      login(user)
      setLoading(false)
      nav('/')
    }, 800)
  }

  const handleDemo = () => {
    setLoading(true)
    setTimeout(() => {
      const user = {
        name: 'Demo User',
        email: 'demo@medisync.example',
        token: 'demo-token'
      }
      login(user)
      setLoading(false)
      nav('/')
    }, 400)
  }

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Welcome back to MediSync</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider">or</div>
        
        <div className="auth-alternatives">
          <button 
            className="btn btn-outline google-btn"
            onClick={handleGoogle}
            disabled={loading}
          >
            Sign in with Google
          </button>
          
          <button 
            className="btn btn-success"
            onClick={handleDemo}
            disabled={loading}
          >
            Try demo account
          </button>
        </div>

        <p className="muted">
          Don't have an account?{' '}
          <a href="/register" onClick={(e) => { e.preventDefault(); nav('/register'); }}>
            Create one
          </a>
        </p>
      </div>
    </div>
  )
}
