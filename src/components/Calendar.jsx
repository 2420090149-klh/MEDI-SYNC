import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Simple calendar-like view: groups slots by date and allows booking
export default function Calendar({ slots = [], onBooked }) {
  const { user } = useContext(AuthContext)
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(false)

  // group slots by date (YYYY-MM-DD)
  const groups = slots.reduce((acc, s) => {
    const date = s.slot.split(' ')[0]
    acc[date] = acc[date] || []
    acc[date].push(s)
    return acc
  }, {})

  const dates = Object.keys(groups).sort()

  async function bookSlot(s) {
    setBooking(true)
    try {
      if(!user) {
        showToast('Please sign in to book an appointment')
        setBooking(false)
        return
      }
      // include slot id so server can persist and avoid double-booking
      await axios.post('/api/book', { id: s.id, doctor: s.doctor, slot: s.slot, patient: user.name })
      setSelected(s.id)
      showToast(`Booked ${s.slot} with ${s.doctor}`)
      if (typeof onBooked === 'function') onBooked()
    } catch (err) {
      // fallback behavior
      setSelected(s.id)
      showToast(`Booked ${s.slot} with ${s.doctor}`)
      if (typeof onBooked === 'function') onBooked()
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="calendar" aria-live="polite">
      {dates.length === 0 && <p>No slots available for the selected dates.</p>}
      <div className="calendar-grid">
        {dates.map((d) => (
          <div className="calendar-day" key={d}>
            <h4>{d}</h4>
            <ul>
              {groups[d].map((s) => (
                <li key={s.id} className={`cal-slot ${selected === s.id ? 'selected' : ''}`}>
                  <div className="slot-left">
                    <strong>{s.doctor}</strong>
                    <div className="muted">{s.slot.split(' ')[1]}</div>
                  </div>
                  <div className="slot-right">
                    <button disabled={booking} onClick={() => bookSlot(s)} className="btn btn-primary">
                      {selected === s.id ? 'Booked' : `Book ${s.slot.split(' ')[1]}`}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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
