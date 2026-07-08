
# 🎯 QuizMaster

A full-stack gamified quiz platform featuring flag trivia, a world map country-guessing game, daily challenges, XP progression, and a global leaderboard — built end-to-end with a modern React frontend and a Node/Express backend.

**🔗 Live Demo:** https://quizmaster-teal.vercel.app/
---

## ✨ Features

- **Multi-modal Authentication**
  - Email/password registration with 6-digit OTP email verification
  - Google Sign-In (OAuth 2.0 via Google Identity Services)
  - Forgot password flow with email-based reset codes
- **Flag Quiz** — Progressive difficulty levels (Easy → Impossible), unlocked sequentially by score
- **World Map Game** — Guess all 197 countries against the clock, tracked against your personal best
- **Daily Find** — A "hot or cold" distance-based daily country-guessing challenge, resets every 24 hours
- **Flag Reveal** — Progressive tile-reveal flag guessing game with tiered XP rewards based on attempts used
- **Global Leaderboard** — Ranked by total accumulated XP across all games
- **Guide** — In-app rules and mechanics reference

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Custom CSS-in-JS styling system (no framework — hand-built design tokens)
- Google Identity Services SDK

**Backend**
- Node.js + Express
- MongoDB (Mongoose ODM), hosted on MongoDB Atlas
- JWT-based authentication
- bcrypt for password hashing
- Resend (transactional email API) for OTP delivery

**Deployment**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

---

## 🚀 Local Setup

### Prerequisites
- Node.js
- A MongoDB Atlas connection string
- A Google Cloud OAuth Client ID
- A Resend API key

### Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
RESEND_API_KEY=your_resend_api_key
```

```bash
node server.js
```

### Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
npm run dev
```

---

## 📌 Known Limitations

- **Email delivery domain**: OTP/reset emails currently send via Resend's shared testing domain, which restricts delivery to a single verified test recipient. In a production deployment, this would be resolved by verifying a custom sending domain.
- **Google OAuth testing mode**: The OAuth consent screen is currently in "Testing" status, meaning only explicitly whitelisted test-user Google accounts can sign in via Google. Publishing the app removes this restriction.

---

## 🧩 Project Structure
notes_app/
├── backend/
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express route handlers
│ └── server.js
└── frontend/
└── src/
├── components/ # React components (one per screen/game)
├── styles.js # Shared design tokens
└── api.js # Axios instance

---

## 👤 Author

Built by Abdul Rehman Sohail — https://www.linkedin.com/in/abdul-rehman-sohail-2060123a9?utm_source=share_via&utm_content=profile&utm_medium=member_android



