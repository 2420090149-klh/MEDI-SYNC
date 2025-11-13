import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import emailjs from '@emailjs/browser'
import '../styles/BookingModal.css'

export default function BookingModal({ appointment, onClose, onConfirm }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    countryCode: '+91',
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

    const fullPhone = formData.countryCode + formData.phone

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Persist booking to localStorage under current user
      const booking = {
        id: 'bk_' + Date.now(),
        userId: user?.id || 'guest',
        patient: { name: formData.name, email: formData.email, phone: fullPhone },
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

      // Send notifications via EmailJS and WhatsApp
      await sendEmailConfirmation(formData, appointment)
      await sendWhatsAppMessage(fullPhone, formData, appointment)

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

  // Send email confirmation using EmailJS
  const sendEmailConfirmation = async (data, appt) => {
    try {
      // Initialize EmailJS with your public key
      emailjs.init('YOUR_PUBLIC_KEY') // Replace with your EmailJS public key
      
      const templateParams = {
        to_email: data.email,
        to_name: data.name,
        doctor_name: appt.doctor,
        hospital: appt.hospital || 'Hospital',
        specialty: appt.specialty || 'Consultation',
        appointment_slot: appt.slot,
        patient_phone: data.countryCode + data.phone,
        notes: data.notes || 'None',
        from_name: 'MediSync Team'
      }

      // Send email using EmailJS
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS credentials
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
      console.log('✅ Email sent successfully to:', data.email)
    } catch (error) {
      console.error('❌ Email sending failed:', error)
      // Fallback to mailto if EmailJS fails
      const subject = 'Appointment Confirmation - MediSync'
      const body = `Dear ${data.name},%0D%0A%0D%0AYour appointment has been confirmed!%0D%0A%0D%0ADoctor: ${encodeURIComponent(appt.doctor)}%0D%0ADate & Time: ${encodeURIComponent(appt.slot)}%0D%0APhone: ${data.countryCode}${data.phone}%0D%0A${data.notes ? `Notes: ${encodeURIComponent(data.notes)}%0D%0A` : ''}%0D%0APlease arrive 10 minutes early.%0D%0A%0D%0ABest regards,%0D%0AMediSync Team`
      const mailto = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(subject)}&body=${body}`
      try { window.open(mailto, '_blank', 'noopener') } catch {}
    }
    return Promise.resolve()
  }

  // Send WhatsApp message
  const sendWhatsAppMessage = async (fullPhone, data, appt) => {
    const message = `🏥 MediSync Appointment Confirmed\n\n👤 Patient: ${data.name}\n👨‍⚕️ Doctor: ${appt.doctor}\n📅 Date & Time: ${appt.slot}\n\nPlease arrive 10 minutes early. Reply CANCEL to cancel your appointment.\n\nThank you for choosing MediSync!`;
    const url = `https://wa.me/${fullPhone.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`
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
            <p><strong>Phone:</strong> {formData.countryCode} {formData.phone}</p>
          </div>
          <div className="notification-status">
            <p>📧 Email confirmation sent to: <strong>{formData.email}</strong></p>
            <p>📱 WhatsApp message sent to: <strong>{formData.countryCode} {formData.phone}</strong></p>
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
            <div className="phone-input-group">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="country-code-select"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+60">🇲🇾 +60</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+82">🇰🇷 +82</option>
                <option value="+86">🇨🇳 +86</option>
              </select>
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
                className="phone-number-input"
              />
            </div>
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
