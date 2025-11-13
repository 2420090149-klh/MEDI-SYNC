import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const from = location.state?.from || null;

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
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    const result = await login(formData.email, formData.password)
    setLoading(false)
    if (result.success) {
      const fallback = userType === 'doctor' ? '/doctor-dashboard' : '/dashboard'
      navigate(from || fallback, { replace: true })
    }
  }

  const handleSocialLogin = (provider) => {
    showToast(`${provider} login will be integrated in production`)
    setTimeout(() => {
      localStorage.setItem('medisync_token', `${provider}-oauth-token`)
      const fallback = userType === 'doctor' ? '/doctor-dashboard' : '/dashboard'
      navigate(from || fallback, { replace: true })
    }, 1000)
  }

  return (
    <div className="auth-page container">
      <div className="auth-shell">
        <aside className="auth-hero" aria-hidden="true">
          <div className="hero-content">
            <div className="brand">MediSync</div>
            <h1>Smarter Healthcare, Seamless Appointments</h1>
            <ul className="hero-highlights">
              <li>Search specialists and book in seconds</li>
              <li>Multilingual voice assistance and accessibility</li>
              <li>Trusted doctors across leading hospitals</li>
            </ul>
          </div>
        </aside>
        <div className="auth-container">
        <div className="user-type-selector">
          <button className={`type-btn ${userType === 'patient' ? 'active' : ''}`} onClick={() => setUserType('patient')}>
            <span className="type-icon">👤</span><span>Patient Login</span>
          </button>
          <button className={`type-btn ${userType === 'doctor' ? 'active' : ''}`} onClick={() => setUserType('doctor')}>
            <span className="type-icon">👨‍⚕️</span><span>Doctor Login</span>
          </button>
        </div>

        <div className="auth-card">
          <h2>Welcome to MediSync</h2>
          <p className="auth-subtitle">{userType === 'doctor' ? 'Access your practice dashboard' : 'Manage your appointments'}</p>

          <div className="social-logins">
            <button className="social-btn google" onClick={() => handleSocialLogin('Google')} disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')} disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continue with Facebook
            </button>
            <button className="social-btn github" onClick={() => handleSocialLogin('GitHub')} disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#333"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <div className="divider"><span>or continue with email</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} disabled={loading} placeholder="your.email@example.com" autoComplete="email"/>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} disabled={loading} placeholder="Enter your password" autoComplete="current-password"/>
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>
            <div className="form-options">
              <label className="checkbox-label"><input type="checkbox"/><span>Remember me</span></label>
              <Link to="/auth/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <button className={`btn btn-primary btn-full ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : `Sign in as ${userType === 'doctor' ? 'Doctor' : 'Patient'}`}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/auth/register" className="link">Sign up</Link></p>
            <p style={{marginTop:12}}>
              <button type="button" className="link" onClick={() => navigate('/')}>Continue as guest</button>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

function showToast(msg) {
  const el = document.getElementById('toast')
  if (!el) return alert(msg)
  el.textContent = msg
  el.style.display = 'block'
  el.style.opacity = 1
  setTimeout(() => {el.style.transition = 'opacity .4s ease'; el.style.opacity = 0; setTimeout(() => el.style.display = 'none', 400)}, 2200)
}
