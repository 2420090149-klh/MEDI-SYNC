# MediSync Mock Server

This mock Express server returns deterministic appointment slots for development.

Run:

```powershell
cd server
npm install
npm start
```

The server listens on port 4000 by default and exposes:
- GET /api/search?specialty=Specialty&date=YYYY-MM-DD  -> returns array of slots
- POST /api/book  -> accepts {doctor, slot, patient} and returns confirmation

Persistence:
- Bookings are stored to `server/bookings.json` so bookings survive server restarts during development.
- The server will load `bookings.json` at startup if present and write changes after new bookings.

Demo bookings:
- A sample booking is included in `server/bookings.json` (used for demo/testing). This blocks the corresponding slot from appearing in `/api/search`.
