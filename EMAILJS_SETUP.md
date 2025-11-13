# EmailJS Setup Instructions

To enable direct email sending from the BookingModal, follow these steps:

## 1. Create a Free EmailJS Account
- Visit [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account (allows 200 emails/month)

## 2. Set Up Email Service
- Go to **Email Services** in dashboard
- Click **Add New Service**
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the connection steps

## 3. Create an Email Template
- Go to **Email Templates**
- Click **Create New Template**
- Use these template variables in your email content:

```
Subject: Appointment Confirmation - MediSync

Hi {{to_name}},

Your appointment has been confirmed! ✅

📋 Appointment Details:
- Doctor: {{doctor_name}}
- Hospital: {{hospital}}
- Specialty: {{specialty}}
- Date & Time: {{appointment_slot}}
- Your Phone: {{patient_phone}}
- Notes: {{notes}}

Please arrive 10 minutes early for check-in.

If you need to reschedule or cancel, please contact us as soon as possible.

Best regards,
{{from_name}}
```

## 4. Get Your Credentials
- **Public Key**: Settings > Account > Public Key (e.g., `abc123xyz`)
- **Service ID**: Email Services > Your service ID (e.g., `service_abc123`)
- **Template ID**: Email Templates > Your template ID (e.g., `template_xyz789`)

## 5. Update BookingModal.jsx
Replace the placeholder values in `src/components/BookingModal.jsx`:

```javascript
// Line ~48
emailjs.init('YOUR_PUBLIC_KEY') // Replace with your public key

// Line ~60
await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

## Example Configuration
```javascript
emailjs.init('abc123xyz')
await emailjs.send('service_gmail', 'template_booking', templateParams)
```

## Testing
1. Update the three credentials in BookingModal.jsx
2. Rebuild: `npm run build`
3. Book an appointment with your email
4. Check your inbox for the confirmation email

## Troubleshooting
- **Emails not sending?** Check EmailJS dashboard for error logs
- **Wrong email address?** Verify template uses `{{to_email}}`
- **Rate limit reached?** Free tier has 200 emails/month limit

## Alternative: Use Environment Variables
For security, store credentials in `.env.local`:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

Then update BookingModal.jsx:
```javascript
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  templateParams
)
```
