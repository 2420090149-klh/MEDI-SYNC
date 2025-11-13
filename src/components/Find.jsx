import React, {useState} from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Calendar from './Calendar'

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
            {!showCal && renderResults(results)}
            {showCal && <Calendar slots={results} onBooked={refetch} />}
          </>
        )}
      </div>

    </section>
  )
}

function generateMockSlots(specialty,date){
  const slots = ["09:00 AM","10:30 AM","12:00 PM","02:00 PM","04:30 PM"]
  return slots.map((s,i)=>({doctor:`Dr. ${specialty.split(' ')[0]} ${i+1}`,slot:`${date} ${s}`}))
}

function renderResults(items){
  if(!items.length) return <p>No doctors found.</p>
  return (
    <div className="results-grid" role="list">
      {items.map((it,idx)=>(
        <div key={idx} className="result-card" role="listitem" tabIndex={0}>
          <div className="rc-left">
            <strong>{it.doctor}</strong>
            <div className="muted">{it.slot.split(' ')[0]} • {it.slot.split(' ')[1]}</div>
          </div>
          <div className="rc-right">
            <button
              className="btn btn-primary"
              onClick={async () => {
                if(!user){
                  // redirect to login
                  showToast('Please sign in to book an appointment')
                  navigate('/auth/login')
                  return
                }
                try {
                  await axios.post('/api/book', { id: it.id, doctor: it.doctor, slot: it.slot, patient: user.name })
                  showToast('Appointment confirmed for ' + it.slot)
                  // notify parent to refresh results
                  window.dispatchEvent(new CustomEvent('medisync:booked'))
                } catch (err) {
                  if (err?.response?.status === 409) showToast('Slot already booked')
                  else showToast('Booking failed')
                }
              }}
            >
              Book {it.slot.split(' ')[1]}
            </button>
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