// ── SITE CONFIGURATION ────────────────────────────────────────
// Edit this file to update all site-wide details without touching components

export const SITE = {
  name:        'TATA RAAM KUMAR',
  tagline:     'Strategic Intelligence & Fullstack Developer',
  email:       'tatu.ind@hotmail.com',          // ← replace
  whatsapp:    '+919566698821',                  // ← replace
  calendly:    'https://calendly.com/YOUR_LINK', // ← replace
  github:      'https://github.com/TATARAAMKUMAR33',
  linkedin:    'https://linkedin.com/in/tata-raam-kumar',
  substack:    'https://tataraamkumar.substack.com',
  substackRSS: 'https://tataraamkumar.substack.com/feed',
  location:    'Tamil Nadu, India',
  available:   true, // shows "Available for work" badge
}

export const COMPANIES = [
  {
    name:        'Voxia Global',
    tagline:     'Strategic Intelligence for India Watchers',
    description: 'Intelligence briefs, policy analysis, and ground-level research covering India — built for foreign investors, embassies, NGOs, and media.',
    url:         'https://voxiaglobal.com',
    role:        'Founder & Intelligence Analyst',
    since:       '2024',
    registered:  'MSME + Startup India (Spice+)',
    color:       '#D4AF37',
  },
  {
    name:        'TryIT Educations',
    tagline:     '100% Lifetime Free Exam Prep for India',
    description: 'Competitive exam preparation platform covering Class 1 to PhD — all Indian competitive, entrance, and scholarship exams in all Indian languages.',
    url:         'https://tryiteducations.net',
    telegram:    'https://t.me/tryiteducations',
    role:        'Founder & Fullstack Developer',
    since:       '2023',
    stack:       'React 18, Vite, Tailwind, Supabase, Capacitor',
    color:       '#0E7C7B',
  },
]

export const SERVICES = [
  {
    id:          'policy-intel',
    title:       'Policy Intelligence',
    icon:        '🏛',
    description: 'Monthly intelligence briefs on India policy — central, state, district, and panchayat level. Announcement vs execution gap analysis.',
    audience:    'Think tanks, embassies, foreign investors',
    model:       'Monthly retainer or one-time brief',
    personas:    ['policy', 'investor'],
  },
  {
    id:          'ground-intel',
    title:       'Ground-Level Intelligence',
    icon:        '🔍',
    description: 'OSINT-verified intelligence at district and panchayat level. Primary sources in Tamil, Hindi, and English including regional gazette notifications.',
    audience:    'NGOs, development organisations, CSR teams',
    model:       'Project-based or retainer',
    personas:    ['policy', 'investor'],
  },
  {
    id:          'research-writing',
    title:       'Research & Analytical Writing',
    icon:        '📝',
    description: 'Long-form analytical writing, policy briefs, regulatory gap analysis, and executive intelligence memos for publications and institutions.',
    audience:    'Media organisations, publishers, think tanks',
    model:       'Per piece or retainer',
    personas:    ['media', 'policy'],
  },
  {
    id:          'fullstack-dev',
    title:       'Fullstack Development',
    icon:        '⚡',
    description: 'React + Supabase + Cloudflare web applications and platforms. From concept to deployed product. I also build internal research and intelligence tools.',
    audience:    'Startups, EdTech companies, research organisations',
    model:       'Project-based',
    personas:    ['developer', 'ai'],
  },
  {
    id:          'ai-evaluation',
    title:       'AI Evaluation & RLHF',
    icon:        '🤖',
    description: 'AI response evaluation, rubric design, hallucination detection, prompt testing. Tamil native + Physics domain specialist.',
    audience:    'AI companies, Scale AI, Outlier, research labs',
    model:       'Hourly or contract',
    personas:    ['ai'],
  },
  {
    id:          'osint',
    title:       'OSINT & Competitive Intelligence',
    icon:        '🛰',
    description: 'Open-source intelligence gathering, competitive landscape mapping, market signal synthesis. India-specific with multilingual source capability.',
    audience:    'Corporates, compliance teams, strategic advisory firms',
    model:       'Project-based or retainer',
    personas:    ['policy', 'investor'],
  },
]

export const PAYMENT_INFO = {
  razorpay: {
    enabled:    false,                          // set true after Razorpay setup
    keyId:      import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    buttonText: 'Pay via Razorpay (India)',
  },
  bank: {
    enabled:    true,
    name:       'TATA RAAM KUMAR',                    // ← replace
    bank:       'CANARA BANK',               // ← replace
    account:    '110157883296',              // ← replace
    ifsc:       'CNRB0001227',                   // ← replace
    
  },
  stripe: {
    enabled:    false,                          // set true after Stripe setup
    publicKey:  import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  },
}

export const SUBSCRIPTION_PLANS = [
  {
    id:       'free',
    name:     'Free',
    priceINR:  0,
    priceUSD:  0,
    features: [
      'Public research briefs & summaries',
      'Public tracker dashboards',
      'All fullstack tool demos',
      'Substack & LinkedIn feed',
      'Company showcase & CV',
    ],
    cta:      'Start Free',
    featured: false,
  },
  {
    id:       'premium_monthly',
    name:     'Premium Monthly',
    priceINR:  499,
    priceUSD:  9,
    features: [
      'Everything in Free',
      'Full PDF downloads (all premium briefs)',
      'Complete tracker data — district & panchayat level',
      'Premium content feed access',
      'Monthly tracker update email',
      'SEBI/RBI gap analysis full reports',
      'Scam intelligence tracker (full)',
    ],
    cta:      'Subscribe Monthly',
    featured: true,
  },
  {
    id:       'premium_annual',
    name:     'Premium Annual',
    priceINR:  3999,
    priceUSD:  69,
    features: [
      'Everything in Premium Monthly',
      'Priority email alerts for new tracker launches',
      'Quarterly "State of the Sector" deep-dive',
      'Best value — saves Rs. 1989/year',
    ],
    cta:      'Subscribe Annual',
    featured: false,
  },
  {
    id:       'sector_report',
    name:     'Sector Deep-Dive',
    priceINR:  '999–2999',
    priceUSD:  '15–50',
    features: [
      'Single sector intelligence report',
      'No subscription required',
      'Instant PDF download after payment',
      'Custom sector on request',
    ],
    cta:      'Buy a Report',
    featured: false,
    oneTime:  true,
  },
]
