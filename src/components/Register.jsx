import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register() {
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
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
    // Mock registration - in production this would call your backend
    setTimeout(() => {
      const user = { 
        name: formData.name,
        email: formData.email,
        token: 'new-user-token'
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

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create your MediSync account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              disabled={loading}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

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
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>

          <button 
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="divider">or</div>
        
        <button 
          className="btn btn-outline google-btn"
          onClick={handleGoogle}
          disabled={loading}
        >
          Sign up with Google
        </button>

        <p className="muted">
          Already have an account?{' '}
          <a href="/login" onClick={(e) => { e.preventDefault(); nav('/login'); }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}