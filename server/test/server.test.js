const fs = require('fs')
const path = require('path')
const request = require('supertest')

const STORE = path.join(__dirname, '..', 'bookings.json')

// Ensure a clean bookings store before loading the app
beforeAll(() => {
  try {
    if (fs.existsSync(STORE)) fs.unlinkSync(STORE)
  } catch (e) {
    // ignore
  }
})

afterEach(() => {
  // remove store between tests to ensure deterministic behavior
  try {
    if (fs.existsSync(STORE)) fs.unlinkSync(STORE)
  } catch (e) {}
})

describe('MediSync mock API', () => {
  let app
  beforeAll(() => {
    // require the app after clearing store
    app = require('../index')
  })

  test('GET /api/search returns available slots', async () => {
    const res = await request(app).get('/api/search').query({ specialty: 'Cardio', date: '2025-11-05' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(5)
    expect(res.body[0]).toHaveProperty('id')
  })

  test('POST /api/book books a slot and prevents double-booking', async () => {
    // fetch available slots
    const search = await request(app).get('/api/search').query({ specialty: 'Neuro', date: '2025-11-06' })
    expect(search.status).toBe(200)
    const slots = search.body
    expect(slots.length).toBeGreaterThan(0)

    const slot = slots[0]
    // book the slot
    const book = await request(app).post('/api/book').send({ id: slot.id, doctor: slot.doctor, slot: slot.slot, patient: 'Test Patient' })
    expect(book.status).toBe(200)
    expect(book.body.ok).toBe(true)

    // searching again should exclude the booked slot
    const after = await request(app).get('/api/search').query({ specialty: 'Neuro', date: '2025-11-06' })
    expect(after.status).toBe(200)
    const ids = after.body.map((s) => s.id)
    expect(ids).not.toContain(slot.id)

    // trying to book same slot should return 409
    const double = await request(app).post('/api/book').send({ id: slot.id, doctor: slot.doctor, slot: slot.slot, patient: 'Test Patient' })
    expect(double.status).toBe(409)
    expect(double.body.ok).toBe(false)
  })
})
