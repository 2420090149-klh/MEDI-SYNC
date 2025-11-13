import React from 'react'

export default function Technology(){
  return (
    <section id="tech" className="technology container">
      <h2>Technology Overview</h2>
      <p className="section-lead">Built with modern web technologies to ensure responsiveness and accessibility across devices.</p>
      <div className="tech-grid">
        <div className="tech-card">
          <h4>Front-end</h4>
          <p>React.js (recommended) or Angular for a dynamic, client-driven UI. HTML5, CSS3 and modern JavaScript power the responsive landing interface.</p>
        </div>
        <div className="tech-card">
          <h4>Security</h4>
          <p>Strong authentication, role-based access control, and TLS encryption for data in transit. Follow HIPAA best-practices when handling PHI.</p>
        </div>
        <div className="tech-card">
          <h4>Scalability</h4>
          <p>API-driven backend, load-balanced services, and event-driven scheduling triggers enable horizontal scaling.</p>
        </div>
      </div>
      <p className="note">This project was submitted in partial fulfillment of the requirements for the degree of Bachelor of Technology in Computer Science and Engineering.</p>
    </section>
  )
}
