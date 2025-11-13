import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import BookingModal from './BookingModal'

// Simple calendar-like view: groups slots by date and allows booking
export default function Calendar({ slots = [], onBooked }) {
  const { user } = useAuth()
  const [bookingAppt, setBookingAppt] = useState(null)

  // group slots by date (YYYY-MM-DD)
  const groups = slots.reduce((acc, s) => {
    const date = s.slot.split(' ')[0]
    acc[date] = acc[date] || []
    acc[date].push(s)
    return acc
  }, {})

  const dates = Object.keys(groups).sort()

  return (
    <div className="calendar" aria-live="polite">
      {dates.length === 0 && <p>No slots available for the selected dates.</p>}
      <div className="calendar-grid">
        {dates.map((d) => (
          <div className="calendar-day" key={d}>
            <h4>{d}</h4>
            <ul>
              {groups[d].map((s) => (
                <li key={s.id} className="cal-slot">
                  <div className="slot-left">
                    <strong>{s.doctor}</strong>
                    <div className="muted">{s.slot.split(' ')[1]}</div>
                  </div>
                  <div className="slot-right">
                    <button 
                      onClick={() => {
                        if(!user) {
                          showToast('Please sign in to book an appointment')
                          return
                        }
                        setBookingAppt(s)
                      }} 
                      className="btn btn-primary"
                    >
                      Book {s.slot.split(' ')[1]}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {bookingAppt && (
        <BookingModal
          appointment={bookingAppt}
          onClose={() => setBookingAppt(null)}
          onConfirm={() => {
            showToast('✅ Appointment booked successfully!')
            if (typeof onBooked === 'function') onBooked()
          }}
        />
      )}
    </div>
  )
}

function showToast(msg){
  const el = document.getElementById('toast')
  if(!el) return alert(msg)
  el.textContent = msg
  el.style.display = 'block'
  el.style.opacity = 1
  setTimeout(()=>{el.style.transition='opacity .4s ease'; el.style.opacity=0; setTimeout(()=>el.style.display='none',400)},2200)
}
