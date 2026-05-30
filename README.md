# CareerConnect - Full Stack Job Board Platform

CareerConnect is a production-ready, feature-rich job board application built with the MERN stack (MongoDB, Express.js, React, Node.js). It offers separate portals for Job Seekers (Candidates) and Employers to manage listings, submit applications, track review statuses, upload profiles and resumes, and receive professional email notifications.

---

## Technical Stack

- **Frontend**: React (Vite), React Router v6, Axios, Tailwind CSS v4, Framer Motion, React Hot Toast, Lucide Icons
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Multer (file uploads), Nodemailer (HTML emails)
- **Database**: MongoDB (Mongoose models, compound indices, full-text search indexing)
- **Styling**: Modern SaaS style, glassmorphism, responsive designs, and light/dark theme modes

---

## Directory Structure

```
career-connect/
├── backend/
│   ├── config/             # DB configuration
│   ├── controllers/        # Controllers (Auth, Jobs, Applications, Users)
│   ├── middleware/         # Middlewares (Auth check, Multer, Error handlers)
│   ├── models/             # Mongoose schemas (User, Job, Application)
│   ├── routes/             # Express routes
│   ├── utils/              # Email templates and email service
│   ├── uploads/            # Multer file storage directories
│   │   ├── logos/
│   │   ├── profiles/
│   │   └── resumes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI elements (common, layouts, home, jobs, dashboard)
│   │   ├── context/        # Auth & Theme context wrappers
│   │   ├── pages/          # Layout pages (Home, Login, Register, Dashboards...)
│   │   ├── services/       # Axios API wrapper service
│   │   ├── utils/          # Formatting helpers
│   │   ├── App.jsx         # Routes definition
│   │   ├── index.css       # Tailwind CSS v4 setup
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Local Setup & Configuration

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed locally or have a MongoDB Atlas cluster URI ready.

### 1. Environment Configuration
Create a `.env` file in the `backend/` folder (or copy from the root `.env.example` to `backend/.env`) and update the values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/careerconnect?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email Credentials (Gmail App Passwords or SMTP details)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=CareerConnect <noreply@careerconnect.com>

CLIENT_URL=http://localhost:5173
```

> [!NOTE]
> If email credentials are left empty, the application will run in sandbox mode, outputting simulated emails directly to the server log without throwing errors.

---

### 2. Backend Setup
Navigate to the `backend/` directory:
```bash
cd backend
npm install
npm run dev
```
The server will start running at `http://localhost:5000`.

---

### 3. Frontend Setup
Navigate to the `frontend/` directory in a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`. Vite will proxy API requests automatically to `http://localhost:5000`.

---

## Features Walkthrough

### 🔒 User Authentication & Authorization
- Hashed passwords using `bcrypt` (12 rounds) with custom pre-save schema hooks.
- JWT verification automatically checked via express request headers.
- Role-based restrictions (`protect`, `authorize('employer')`).

### 💼 Employer Workspace
- View dashboard analytics (Total posted, Active, Closed, and Applicants counts).
- Post new jobs or modify active/closed listing states.
- List job applications, download uploaded PDF/Word resumes, and Accept or Reject candidates.

### 📄 Candidate Workspace
- Search and filter jobs by location, keywords, categories, and salary ranges.
- Bookmark jobs to apply later.
- Submit applications with cover letters and drag-and-drop resume uploads.
- Review application status timelines in real-time.

### 📧 Email Notifications
- Registration welcome emails.
- Application submission receipts.
- Offer acceptances and rejection updates.
- Publisher posting receipts.

---

## Deployment Guide

### Database (MongoDB Atlas)
1. Register/Login at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Build a new Shared Cluster database.
3. Add a database user with password permissions.
4. Add IP permissions to allow connections from anywhere (`0.0.0.0/0`).
5. Copy the connection URI string and set it in your hosting platform environment variables.

### Backend Hosting (Render)
1. Create a Web Service on [Render](https://render.com/).
2. Connect your Git repository.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install` (within your backend subdirectory, or root package configuration)
   - **Start Command**: `node server.js`
4. Add all environment variables from your `.env` file under **Environment Tab**.

### Frontend Hosting (Netlify or Vercel)
1. Connect your repo to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
2. Configure settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Point your API calls to your newly deployed Render API backend URL by adjusting the `vite.config.js` proxy settings or environment API base URLs.
