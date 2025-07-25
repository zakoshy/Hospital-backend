# Hospital Backend

This is the backend for the Hospital Portal system.

## Features

- User authentication with JWT
- Patient registration and management
- Consultations
- Prescriptions and pharmacy workflows
- Laboratory referrals and results
- Payments integration (e.g. Daraja API)
- SMS notifications using Africa's Talking

## Technologies

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for auth
- Railway for deployment

## Environment Variables

Create a `.env` file in the root with these values:

PORT=5000
MONGO_URI=<your mongodb connection string>
JWT_SECRET=<your secret key>
AT_USERNAME=sandbox
AT_API_KEY=<your africas talking key>
AT_SHORTCODE=
DARAJA_CONSUMER_KEY=
DARAJA_CONSUMER_SECRET=
DARAJA_PASSKEY=
DARAJA_SHORTCODE=
DARAJA_OAUTH_URL=


## Running Locally

1. Clone the repo:

```bash
git clone https://github.com/zakoshy/Hospital-backend.git
cd Hospital-backend

Install dependencies:
npm install

Start the server:
npm run dev

Server runs on http://localhost:5000

Author : Edwin Oshome