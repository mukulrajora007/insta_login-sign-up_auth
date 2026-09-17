# Instagram-Style Responsive Authentication System

A full-stack, responsive Instagram clone focusing on **Login, Signup, and Authentication** built with:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS
- **Database**: Supabase (PostgreSQL with Row Level Security policies)

---

## 🌟 Features

- **Iconic Instagram Aesthetics**:
  - **Desktop View**: Classic two-column layout with a sleek smartphone mockup cycling through genuine-looking feed/reels/story screenshots alongside the login/signup card.
  - **Mobile Responsive**: Dynamically adjusts to clean, borderless single-column cards matching Instagram mobile web behavior.
  - **Custom Typography**: Instagram script branding, active floating-label inputs, and official brand palette.
- **Authentication Flows**:
  - **Login**: Supports login with either username or email + password, show/hide password toggle, and error messaging.
  - **Signup**: Full registration form (Email/Phone, Full Name, Username, Password) with live debounced username availability checking and input validations.
  - **Protected Dashboard / Feed**: Authenticated users are redirected to an Instagram Home feed with stories tray, interactive post (likes, comments, bookmarks), and profile summary.
- **Supabase Integration**:
  - Live PostgreSQL database querying using `@supabase/supabase-js`.
  - Ready-to-use `supabase-schema.sql` script for 1-click table setup with Row Level Security.
  - Dev-fallback mode: works out-of-the-box even before you set up your Supabase project!

---

## 🚀 Quick Start Guide

### 1. Start the Backend API

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm start
```

The backend server runs on `http://localhost:5000`.

### 2. Start the Frontend Application

In a second terminal, navigate to the frontend folder:

```bash
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🗄️ Connecting Your Supabase Database

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`backend/supabase-schema.sql`](./backend/supabase-schema.sql), paste it into the editor, and click **RUN**.
4. Go to **Project Settings → API** in Supabase, and copy:
   - **Project URL**
   - **anon / public key**
5. Open [`backend/.env`](./backend/.env) and update:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
6. Restart the backend server (`npm start`). Your application will now store all users and sessions directly in your live Supabase PostgreSQL database!

---

## 🔐 API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/api/auth/signup` | Register new user with email, name, username, password | No |
| `POST` | `/api/auth/login` | Log in with email/username and password | No |
| `GET` | `/api/auth/check-username` | Check if username is already taken | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |
| `GET` | `/api/health` | Server health & Supabase connection status | No |
