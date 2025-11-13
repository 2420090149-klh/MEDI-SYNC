import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('upcoming');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          axios.get('https://api.medisync.com/v1/appointments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('medisync_token')}` }
          }),
          axios.get('https://api.medisync.com/v1/doctors', {
            headers: { Authorization: `Bearer ${localStorage.getItem('medisync_token')}` }
          })
        ]);

        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
                    <img src={appointment.doctor.profile_image} alt="" />
                    <div>
                      <h4>{appointment.doctor.name}</h4>
                      <p>{appointment.doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="appointment-details">
                    <div className="detail">
                      <span className="label">Date</span>
                      <span className="value">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Time</span>
                      <span className="value">{appointment.time}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Status</span>
                      <span className={`status ${appointment.status}`}>{appointment.status}</span>
                    </div>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn btn-outline">Reschedule</button>
                    <button className="btn btn-outline-danger">Cancel</button>
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
                  <img src={doctor.profile_image} alt="" className="doctor-avatar" />
                  <div className="doctor-info">
                    <h4>{doctor.name}</h4>
                    <p>{doctor.specialization}</p>
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