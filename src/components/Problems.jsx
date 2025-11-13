import React from 'react'

export default function Problems(){
  return (
    <section id="problems" className="problems container">
      <h2>Problem Solved</h2>
      <p className="section-lead">Traditional scheduling causes serious friction for both patients and healthcare staff. MediSync addresses these challenges.</p>
      <div className="problems-grid">
        <div className="problem-card">
          <h3>Long patient waiting times</h3>
          <p>Reduce queues and waiting-room congestion by offering precise appointment slots and buffer management.</p>
        </div>
        <div className="problem-card">
          <h3>Underutilized consultation hours</h3>
          <p>Optimize doctor schedules by filling unused slots with intelligent suggestions and real-time updates.</p>
        </div>
        <div className="problem-card">
          <h3>Lack of real-time synchronization</h3>
          <p>Prevent double-booking and repeated attempts with synchronized availability across platforms.</p>
        </div>
        <div className="problem-card">
          <h3>Increased stress for staff</h3>
          <p>Minimize administrative overhead and reduce interruptions with automated scheduling workflows.</p>
        </div>
      </div>
    </section>
  )
}
