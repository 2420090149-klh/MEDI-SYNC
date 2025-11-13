import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import '../styles/BookingModal.css'

export default function BookingModal({ appointment, onClose, onConfirm }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    timeSlot: appointment?.slot || '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: confirmation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone)) {
      showToast('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Persist booking to localStorage under current user
      const booking = {
        id: 'bk_' + Date.now(),
        userId: user?.id || 'guest',
        patient: { name: formData.name, email: formData.email, phone: formData.phone },
        doctor: appointment.doctor,
        hospital: appointment.hospital,
        specialty: appointment.specialty,
        slot: appointment.slot,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
      const key = `medisync_bookings_${booking.userId}`
      const prev = JSON.parse(localStorage.getItem(key) || '[]')
      localStorage.setItem(key, JSON.stringify([booking, ...prev]))

      // Fire cross-app event so other components can refresh
      window.dispatchEvent(new Event('medisync:booked'))

      // Send notifications via mailto/WhatsApp deeplinks (client-side)
      await sendEmailConfirmation(formData, appointment)
      await sendWhatsAppMessage(formData, appointment)

      setStep(2)
      setLoading(false)

      // Wait 3 seconds then close and refresh
      setTimeout(() => {
        onConfirm()
        onClose()
      }, 3000)

    } catch (error) {
      setLoading(false)
      showToast('Booking failed. Please try again.')
    }
  }

  // Simulate email sending
  const sendEmailConfirmation = async (data, appt) => {
    const subject = 'Appointment Confirmation - MediSync'
    const body = `Dear ${data.name},%0D%0A%0D%0AYour appointment has been confirmed!%0D%0A%0D%0ADoctor: ${encodeURIComponent(appt.doctor)}%0D%0ADate & Time: ${encodeURIComponent(appt.slot)}%0D%0APhone: ${encodeURIComponent(data.phone)}%0D%0A${data.notes ? `Notes: ${encodeURIComponent(data.notes)}%0D%0A` : ''}%0D%0APlease arrive 10 minutes early.%0D%0A%0D%0ABest regards,%0D%0AMediSync Team`
    const mailto = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(subject)}&body=${body}`
    try { window.open(mailto, '_blank', 'noopener') } catch {}
    return Promise.resolve()
  }

  // Simulate WhatsApp message
  const sendWhatsAppMessage = async (data, appt) => {
    const message = `🏥 MediSync Appointment Confirmed\n\n👤 Patient: ${data.name}\n👨‍⚕️ Doctor: ${appt.doctor}\n📅 Date & Time: ${appt.slot}\n\nPlease arrive 10 minutes early. Reply CANCEL to cancel your appointment.\n\nThank you for choosing MediSync!`;
    const url = `https://wa.me/${encodeURIComponent(data.phone)}?text=${encodeURIComponent(message)}`
    try { window.open(url, '_blank', 'noopener') } catch {}
    return Promise.resolve()
  }

  if (step === 2) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
          </div>
          <h2>✅ Booking Confirmed!</h2>
          <div className="confirmation-details">
            <p><strong>Patient:</strong> {formData.name}</p>
            <p><strong>Doctor:</strong> {appointment.doctor}</p>
            <p><strong>Date & Time:</strong> {appointment.slot}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
          </div>
          <div className="notification-status">
            <p>📧 Email confirmation sent to: <strong>{formData.email}</strong></p>
            <p>📱 WhatsApp message sent to: <strong>{formData.phone}</strong></p>
          </div>
          <p className="closing-message">This window will close automatically...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Complete Your Booking</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className="appointment-summary">
          <p><strong>Doctor:</strong> {appointment.doctor}</p>
          <p><strong>Time Slot:</strong> {appointment.slot}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="10-digit mobile number"
              pattern="\d{10}"
              maxLength="10"
            />
            <small>We'll send WhatsApp confirmation to this number</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
            <small>Confirmation email will be sent here</small>
          </div>

          <div className="form-group">
            <label htmlFor="timeSlot">Preferred Time Slot</label>
            <input
              type="text"
              id="timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific symptoms or concerns..."
              rows="3"
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
            </button>
          </div>
        </form>
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
  setTimeout(() => {
    el.style.transition = 'opacity .4s ease'
    el.style.opacity = 0
    setTimeout(() => el.style.display = 'none', 400)
  }, 2200)
}
