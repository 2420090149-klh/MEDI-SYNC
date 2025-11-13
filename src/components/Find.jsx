import React, {useState} from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Calendar from './Calendar'
import BookingModal from './BookingModal'
import { getDoctorsBySpecialty, getAvailableSlots } from '../data/doctors'

export default function Find(){
  const [results,setResults] = useState(null)
  const [loading,setLoading] = useState(false)
  const [lastQuery,setLastQuery] = useState(null)

  const onSubmit = async (e)=>{
    e.preventDefault()
    const specialty = e.target.specialty.value.trim()
    const date = e.target.date.value
    if(!specialty || !date){
      showToast('Please enter a specialty and date')
      return
    }
    setLoading(true)
    setResults(null)
    try{
      // If backend implemented, this will call /api/search
      const resp = await axios.get(`/api/search?specialty=${encodeURIComponent(specialty)}&date=${encodeURIComponent(date)}`)
      setResults(resp.data)
      setLastQuery({specialty,date})
    }catch(err){
      // fallback to mock slots
      const mock = generateMockSlots(specialty,date)
      setResults(mock)
      setLastQuery({specialty,date})
    }finally{setLoading(false)}
  }

  const refetch = async () => {
    if(!lastQuery) return
    setLoading(true)
    try{
      const resp = await axios.get(`/api/search?specialty=${encodeURIComponent(lastQuery.specialty)}&date=${encodeURIComponent(lastQuery.date)}`)
      setResults(resp.data)
    }catch(err){
      setResults(generateMockSlots(lastQuery.specialty,lastQuery.date))
    }finally{setLoading(false)}
  }

  const { user } = useAuth()
  const navigate = useNavigate()

  // listen for cross-component booking events triggered by result buttons
  React.useEffect(()=>{
    function handler(){ refetch() }
    window.addEventListener('medisync:booked', handler)
    return ()=> window.removeEventListener('medisync:booked', handler)
  },[lastQuery])

  const [showCal, setShowCal] = React.useState(false)
  const [bookingAppt, setBookingAppt] = React.useState(null)

  return (
    <section id="find" className="find container" aria-labelledby="find-heading">
      <h2 id="find-heading">Find a Doctor</h2>
      <p className="section-lead">Try a quick mock search to see how scheduling works.</p>
      <form className="search-form" id="searchForm" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="specialty">Specialty</label>
        <input aria-label="Specialty" id="specialty" name="specialty" placeholder="Specialty (e.g., General Physician)" required />
        <label className="sr-only" htmlFor="date">Date</label>
        <input aria-label="Date" id="date" name="date" type="date" required />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>

      <div className="search-results" aria-live="polite" aria-atomic="true">
        {loading && <div className="loading">Searching available doctors...</div>}
        {results && (
          <>
            <div style={{marginBottom:12}}>
              <button className="btn btn-outline" onClick={() => setShowCal((s) => !s)} aria-pressed={showCal}>
                {showCal ? 'Hide calendar' : 'View calendar'}
              </button>
            </div>
            {!showCal && renderResults(results, setBookingAppt, user, navigate)}
            {showCal && <Calendar slots={results} onBooked={refetch} />}
          </>
        )}
      </div>

      {bookingAppt && (
        <BookingModal
          appointment={bookingAppt}
          onClose={() => setBookingAppt(null)}
          onConfirm={() => {
            showToast('✅ Appointment booked successfully!')
            refetch()
          }}
        />
      )}

    </section>
  )
}

function generateMockSlots(specialty, date) {
  // Try to get real doctors for this specialty
  const doctors = getDoctorsBySpecialty(specialty);
  
  if (doctors.length > 0) {
    // Group slots by doctor to show each doctor once with multiple time options
    const results = [];
    doctors.forEach(doctor => {
      const slots = getAvailableSlots(doctor.id, date);
      // Take only first 4 slots for each doctor
      const limitedSlots = slots.slice(0, 4);
      results.push({
        id: doctor.id,
        doctor: doctor.name,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        availableSlots: limitedSlots.map(slot => `${date} ${slot}`),
        rating: doctor.rating,
        experience: doctor.experience,
        phone: doctor.phone
      });
    });
    return results;
  }
  
  // Fallback to mock data if no real doctors found
  const slots = ["09:00 AM","10:30 AM","12:00 PM","02:00 PM"];
  return [{
    id: `mock-1`,
    doctor: `Dr. ${specialty.split(' ')[0]} Specialist`,
    specialty: specialty,
    hospital: "General Hospital",
    availableSlots: slots.map(s => `${date} ${s}`),
    rating: 4.5,
    experience: "10 years"
  }];
}

function renderResults(items, setBookingAppt, user, navigate){
  if(!items.length) return <p>No doctors found.</p>
  return (
    <div className="results-grid" role="list">
      {items.map((it,idx)=>(
        <div key={it.id || idx} className="result-card enhanced" role="listitem" tabIndex={0}>
          <div className="rc-left">
            <div className="doctor-info">
              <strong className="doctor-name">{it.doctor}</strong>
              {it.hospital && <div className="hospital-name">🏥 {it.hospital}</div>}
              <div className="doctor-meta">
                {it.rating && <span className="rating">⭐ {it.rating}</span>}
                {it.experience && <span className="experience">👨‍⚕️ {it.experience}</span>}
              </div>
            </div>
            <div className="available-slots-section">
              <div className="slots-label">Available Time Slots:</div>
              <div className="slots-grid">
                {it.availableSlots && it.availableSlots.map((slot, slotIdx) => (
                  <button
                    key={slotIdx}
                    className="slot-btn"
                    onClick={() => {
                      if(!user){
                        showToast('Please sign in to book an appointment')
                        navigate('/auth/login')
                        return
                      }
                      // Open booking modal with selected slot
                      setBookingAppt({...it, slot})
                    }}
                  >
                    🕐 {slot.split(' ')[1]} {slot.split(' ')[2]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
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