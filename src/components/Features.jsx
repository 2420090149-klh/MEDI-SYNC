import React from 'react'

export default function Features(){
  return (
    <section id="features" className="features container">
      <h2>Features & Benefits</h2>
      <p className="section-lead">Designed for both patients and healthcare providers, MediSync simplifies appointments end-to-end.</p>

      <div className="feature-columns">
        <div className="feature-box">
          <h3>For Patients</h3>
          <ul>
            <li><strong>Easy Booking</strong>: Browse available time slots and confirm instantly.</li>
            <li><strong>Reminders</strong>: Timely notifications prevent missed visits.</li>
            <li><strong>Flexibility</strong>: Reschedule or cancel with clear policies and confirmations.</li>
          </ul>
        </div>

        <div className="feature-box">
          <h3>For Doctors & Hospitals</h3>
          <ul>
            <li><strong>Dynamic Schedule Management</strong>: Update availability in real-time.</li>
            <li><strong>Improved Resource Utilization</strong>: Reduce bottlenecks with smarter slot allocation.</li>
            <li><strong>Data Security</strong>: Authentication, authorization, and encryption for sensitive records.</li>
            <li><strong>Scalability</strong>: From single clinics to multi-specialty hospitals.</li>
          </ul>
        </div>
      </div>

      <div className="cta-row">
        <a className="btn btn-primary" href="#contact">Request a Demo</a>
        <a className="btn btn-outline" href="#find">Browse Doctors</a>
      </div>
    </section>
  )
}
