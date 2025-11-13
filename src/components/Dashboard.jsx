import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { realDoctors } from '../data/doctors';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('upcoming');

  useEffect(() => {
    const load = () => {
      const key = `medisync_bookings_${user?.id || 'guest'}`;
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      setAppointments(items);
      // Recommend top-rated doctors
      setDoctors(realDoctors.sort((a,b) => b.rating - a.rating).slice(0, 5));
      setLoading(false);
    };

    load();
    const handler = () => load();
    window.addEventListener('medisync:booked', handler);
    return () => window.removeEventListener('medisync:booked', handler);
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name}</h1>
        <div className="quick-actions">
          <button className="btn btn-primary">Book Appointment</button>
          <button className="btn btn-outline">View Health Records</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="appointments-section">
          <div className="section-header">
            <h2>Your Appointments</h2>
            <div className="view-toggle">
              <button 
                className={activeView === 'upcoming' ? 'active' : ''} 
                onClick={() => setActiveView('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={activeView === 'past' ? 'active' : ''} 
                onClick={() => setActiveView('past')}
              >
                Past
              </button>
            </div>
          </div>

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <img src="/icons/calendar-empty.svg" alt="" />
                <h3>No appointments yet</h3>
                <p>Schedule your first appointment with one of our specialists</p>
                <button className="btn btn-primary">Book Now</button>
              </div>
            ) : (
              appointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="doctor-info">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(appointment.doctor)}&radius=50`} alt="" className="doctor-avatar" />
                    <div>
                      <h4>{appointment.doctor}</h4>
                      <p>{appointment.specialty || 'Consultation'} {appointment.hospital ? `• ${appointment.hospital}` : ''}</p>
                    </div>
                  </div>
                  <div className="appointment-details">
                    <div className="detail">
                      <span className="label">Date & Time</span>
                      <span className="value">{appointment.slot}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Status</span>
                      <span className={`status ${appointment.status}`}>{appointment.status}</span>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn btn-outline" onClick={() => alert('Reschedule coming soon')}>Reschedule</button>
                    <button className="btn btn-outline-danger" onClick={() => {
                      const key = `medisync_bookings_${user?.id || 'guest'}`;
                      const items = JSON.parse(localStorage.getItem(key) || '[]').filter(b => b.id !== appointment.id);
                      localStorage.setItem(key, JSON.stringify(items));
                      setAppointments(items);
                    }}>Cancel</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="dashboard-sidebar">
          <section className="recommended-doctors">
            <h3>Recommended Doctors</h3>
            <div className="doctors-list">
              {doctors.slice(0, 3).map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(doctor.name)}&radius=50`} alt="" className="doctor-avatar" />
                  <div className="doctor-info">
                    <h4>{doctor.name}</h4>
                    <p>{doctor.specialty}</p>
                    <div className="doctor-rating">
                      <span className="stars">{'★'.repeat(Math.floor(doctor.rating))}</span>
                      <span className="rating-value">({doctor.rating})</span>
                    </div>
                  </div>
                  <button className="btn btn-outline">View Profile</button>
                </div>
              ))}
            </div>
          </section>

          <section className="upcoming-reminders">
            <h3>Upcoming Reminders</h3>
            <div className="reminders-list">
              {/* Add reminder items here */}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}