const fetch = require('node-fetch');

module.exports = async function (req, res) {
  const API_BASE = process.env.API_BASE || 'http://localhost:4000';
  try {
    const r = await fetch(`${API_BASE}/api/bookings`);
    const json = await r.json();
    res.status(r.status).json(json);
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Proxy error', details: err.message });
  }
};
