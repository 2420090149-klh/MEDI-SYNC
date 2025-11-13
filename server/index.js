const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// Use lowdb for simple file-backed persistence
const fs = require('fs');
const path = require('path');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const DB_FILE = path.join(__dirname, 'db.json')
const adapter = new FileSync(DB_FILE)
const db = low(adapter)

// Seed defaults
db.defaults({ bookings: [] }).write()

// If old bookings.json exists (legacy), migrate into lowdb
const LEGACY = path.join(__dirname, 'bookings.json')
if (fs.existsSync(LEGACY)) {
  try {
    const raw = fs.readFileSync(LEGACY, 'utf8')
    const arr = JSON.parse(raw || '[]')
    const existing = db.get('bookings').value()
    if (!existing || existing.length === 0) {
      db.set('bookings', arr).write()
      console.log(`Migrated ${arr.length} legacy bookings into db.json`)
    }
  } catch (e) { /* ignore */ }
}

function generateSlots(specialty, date) {
  const slots = ["09:00 AM","10:30 AM","12:00 PM","02:00 PM","04:30 PM"];
  return slots.map((s,i)=>({id:`${date}-${i}`, doctor:`Dr. ${specialty.split(' ')[0]} ${i+1}`, slot:`${date} ${s}`}));
}

app.get('/api/search', (req, res) => {
  const specialty = req.query.specialty || 'General';
  const date = req.query.date || new Date().toISOString().slice(0,10);
  let items = generateSlots(specialty, date);
  // filter out booked slots using lowdb
  const booked = db.get('bookings').map('slotId').value() || []
  items = items.filter((it) => !booked.includes(it.id));
  res.json(items);
});

app.post('/api/book', (req, res) => {
  const { id, doctor, slot, patient } = req.body || {}
  // require slot id to safely identify
  if (!id) {
    return res.status(400).json({ ok: false, error: 'Missing slot id' })
  }
  const existing = db.get('bookings').find({ slotId: id }).value()
  if (existing) return res.status(409).json({ ok: false, error: 'Slot already booked' })

  const booking = { id: `bk_${Date.now()}`, slotId: id, doctor: doctor || null, slot: slot || null, patient: patient || null, createdAt: new Date().toISOString() }
  db.get('bookings').push(booking).write()
  res.json({ ok: true, message: `Booked ${slot} with ${doctor || 'N/A'}`, bookingId: booking.id })
})

// expose current bookings (for debugging)
app.get('/api/bookings', (req, res) => {
  res.json(db.get('bookings').value())
})

if (require.main === module) {
  app.listen(port, () => console.log(`MediSync mock API listening on http://localhost:${port}`));
}

module.exports = app
