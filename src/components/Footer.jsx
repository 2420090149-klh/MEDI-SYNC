import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>MediSync</strong>
          <p>© {new Date().getFullYear()} MediSync. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div id="toast" className="toast" role="status" aria-live="polite"></div>
    </footer>
  )
}
