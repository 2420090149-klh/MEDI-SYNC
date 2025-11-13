import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import ErrorBoundary from './components/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PermissionsProvider } from './contexts/PermissionsContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PermissionsProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
