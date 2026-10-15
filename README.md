# TATA RAAM KUMAR — Strategic Intelligence Portfolio

Built with React 18 + Vite + Tailwind CSS v3 + Supabase + Cloudflare Pages.

---

## Quick Start — 4 Steps to Go Live

### Step 1: Supabase Setup
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to SQL Editor → New Query
3. Paste the entire contents of `SUPABASE_SETUP.sql` → Run
4. Go to Storage → Create bucket named `pdfs` → set to **Public**
5. Copy your **Project URL** and **anon/public key** from Settings → API

### Step 2: Configure Your Details
1. Copy `.env.example` to `.env`
2. Fill in your Supabase URL and anon key
3. Open `src/data/siteConfig.js`
4. Replace every `YOUR_...` placeholder with your real details:
   - Email address
   - WhatsApp number
   - Calendly link
   - Bank account details
   - Admin email (must match what you use to sign in)

### Step 3: Deploy to Cloudflare Pages
1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create Project
3. Connect your GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Add Environment Variables (same as your `.env` file):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
   - `VITE_CONTACT_EMAIL`
6. Deploy → your site is live

### Step 4: Admin Access
1. Go to `yoursite.pages.dev/admin`
2. Enter your admin email → click "Send Magic Link"
3. Check email → click the link → you are in the admin panel

---

## Daily Workflow (After Launch)

| Task | Time | How |
|------|------|-----|
| Post on Substack | 0 seconds | Auto-appears via RSS |
| Add LinkedIn post | 30 seconds | Admin → Content Feed → Add Post |
| Upload new PDF brief | 2 minutes | Admin → PDF Library → Upload |
| Monthly tracker update | 15-20 minutes | Admin → Trackers → Monthly Update |
| Add a new tool | 5 minutes | Admin → Tools → Add Tool |
| Create new category | 30 seconds | Admin → Categories → Create |

---

## Folder Structure

```
src/
├── components/
│   ├── admin/       — All admin panel components
│   ├── layout/      — Navbar, Footer, PersonaBar, Layout
│   ├── sections/    — Reusable page sections
│   └── ui/          — Shared UI components
├── context/
│   ├── PersonaContext.jsx   — 5-persona switching system
│   └── AuthContext.jsx      — Supabase auth + role checking
├── data/
│   └── siteConfig.js        — All site config in one place
├── pages/           — One file per route
├── utils/
│   ├── supabase.js          — Supabase client
│   └── helpers.js           — Date, truncate, badge utils
└── styles/
    └── globals.css          — All 5 persona CSS variables + base styles
```

---

## Adding a New Platform to the Content Feed

The content feed is built to support any future platform.
To add a new platform (e.g. Twitter/X, Medium, YouTube):

1. Go to Supabase → Table Editor → `content_feed`
2. Update the `type` column constraint to include the new type
3. Add a card UI for the new type in `src/pages/ContentPage.jsx`
4. Add an admin form in `src/components/admin/AdminContent.jsx`

The filter tabs auto-update — no other changes needed.

---

## Adding a New Topic / Tracker

1. Admin Panel → Categories → Create New Category (30 seconds)
2. Admin Panel → Trackers → New Tracker (2 minutes)
3. Done — filter appears on /library, tracker page live at /trackers/[slug]

---

## Environment Variables Reference

| Variable | Where to Get It |
|----------|----------------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `VITE_ADMIN_EMAIL` | Your email (only this email gets admin) |
| `VITE_CONTACT_EMAIL` | Email for contact form notifications |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe Dashboard → Developers → API Keys |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Right sidebar when logged in |

---

Built by TATA RAAM KUMAR — Voxia Global · TryIT Educations
