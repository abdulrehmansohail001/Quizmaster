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

now what to do. push? then? rialway restart? or maybe vercel now

Right call to check — since this is a frontend-only change (FlagRevealGame.jsx lives in frontend/src/components/), only Vercel needs to redeploy, not Railway. Railway serves your backend, which this change doesn't touch at all.

Steps:

powershell
cd C:\Users\ars89\projects\notes_app
git add .
git commit -m "fix flag reveal tile opacity"
git push
That's it — no manual Railway restart, no manual Vercel action needed either. Both platforms are connected to your GitHub repo and auto-deploy on every push to main; Vercel will detect the new commit and rebuild automatically (usually takes 30-60 seconds), and Railway will just sit idle since nothing in backend/ changed.

Once you push, go check Vercel's Deployments tab to confirm a new deployment kicks off and finishes — then hard-refresh the live site (Ctrl+Shift+R, to bypass any cached old build) and check the Flag Reveal tiles.

now i was making viddeo and all done but ah the light screen, now you know i cant play for 24 hours , whcih recors o remove from mongo


Identified MongoDB records needing deletion for testing purposes
Identified MongoDB records needing deletion for testing purposes
Since it's specifically the Flag Reveal daily-lock you're hitting (not Daily Find), you just need to touch one document, not wipe collections wholesale.

Option A: Delete just your record (simplest)
Go to MongoDB Atlas → Browse Collections → quizdb → flagrevealstats
Find the document where userId matches your account's _id
Delete just that one document
Next time you load Flag Reveal, since no FlagRevealStats record exists for your userId, the backend treats it as a fresh player — no lastPlayed lock, XP starts counting from wherever User.totalXP already is (unaffected, since that's a separate collection).

Option B: Edit the field directly instead of deleting (if you want to keep your streak/XP history intact)
Same collection, find your document
Edit the lastPlayed field — change its value to any date that isn't today (e.g. yesterday's date, or just clear it to an empty string)
Save
This resets the daily lock while preserving your totalXP and streak values in that record.

Given you're just testing/demoing, Option A is simplest — quick delete, no need to hand-edit date strings. Go ahead and delete your flagrevealstats document, then reload Flag Reveal on the live site.

1783505155905_image.png
still visible


Diagnosed grid rendering issue and pinpointed border-radius culprit
Diagnosed grid rendering issue and pinpointed border-radius culprit
Found it — this isn't an opacity issue at all this time, it's a border-radius overlap. Each of the 6 tile <div>s has its own borderRadius: "2px", so where any two tiles meet edge-to-edge, their rounded corners don't perfectly align — leaving tiny rounded-corner gaps between them, and since there's no gap/background behind the grid other than the flag image itself, the flag peeks through right along those seams. That's exactly the lighter horizontal band you're seeing, right where the two rows meet.

Fix: remove the per-tile border radius entirely — individual tiles inside a grid don't need rounding, only the outer container (which already has borderRadius: "18px" and overflow: "hidden") needs it.

In FlagRevealGame.jsx, find this block:

javascriptreact
{Array.from({ length: 6 }).map((_, i) => (
  <div
    key={i}
    style={{
      background: revealedSet.has(i) || gameState !== "playing"
        ? "transparent"
        : "rgba(17,24,39,1)",
      borderRadius: "2px",
      transition: "background 0.5s ease",
    }}
  />
))}
Change borderRadius: "2px" to borderRadius: "0px":

javascriptreact
{Array.from({ length: 6 }).map((_, i) => (
  <div
    key={i}
    style={{
      background: revealedSet.has(i) || gameState !== "playing"
        ? "transparent"
        : "rgba(17,24,39,1)",
      borderRadius: "0px",
      transition: "background 0.5s ease",
    }}
  />
))}
Same push flow as last time:

powershell
git add .
git commit -m "remove tile border radius causing flag bleed-through gaps"
git push
Vercel will redeploy automatically, no Railway involvement needed since this is frontend-only.

1783509357516_image.png
finally , shall i add readme? give what to copy paste in ths.


Orchestrated comprehensive README with features, setup, and limitations
Orchestrated comprehensive README with features, setup, and limitations
Good idea — a solid README actually adds real value for a CV project, since it's often the first thing anyone (recruiter, interviewer) looks at before even opening the code. Here's one tailored to what you actually built:

markdown
# 🎯 QuizMaster

A full-stack gamified quiz platform featuring flag trivia, a world map country-guessing game, daily challenges, XP progression, and a global leaderboard — built end-to-end with a modern React frontend and a Node/Express backend.

**🔗 Live Demo:** [your-vercel-url-here]

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



