import { SITE, PAYMENT_INFO } from '../../data/siteConfig'

export default function AdminSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Site Settings</h2>
      <p className="text-sm text-gray-500 mb-6">
        To update these settings, edit the file: <code className="bg-gray-100 px-1 rounded">src/data/siteConfig.js</code>
        — save and push to GitHub. Cloudflare auto-deploys in ~90 seconds.
      </p>

      <div className="space-y-4">
        {[
          { label: 'Site Name',        value: SITE.name },
          { label: 'Tagline',          value: SITE.tagline },
          { label: 'Contact Email',    value: SITE.email },
          { label: 'WhatsApp Number',  value: SITE.whatsapp },
          { label: 'Calendly Link',    value: SITE.calendly },
          { label: 'GitHub Profile',   value: SITE.github },
          { label: 'LinkedIn Profile', value: SITE.linkedin },
          { label: 'Substack URL',     value: SITE.substack },
          { label: 'Substack RSS',     value: SITE.substackRSS },
          { label: 'Location',         value: SITE.location },
          { label: 'Bank Name',        value: PAYMENT_INFO.bank.name },
          { label: 'Bank Account',     value: PAYMENT_INFO.bank.account },
          { label: 'IFSC Code',        value: PAYMENT_INFO.bank.ifsc },
          { label: 'UPI ID',           value: PAYMENT_INFO.bank.upi },
        ].map(row => (
          <div key={row.label} className="card p-4 flex items-center justify-between gap-4">
            <span className="text-sm font-medium w-40 flex-shrink-0">{row.label}</span>
            <span className="text-sm flex-1 font-mono text-gray-500 truncate">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="card p-5 mt-6" style={{ background:'#fffbea', borderLeft:'4px solid #D4AF37' }}>
        <h3 className="font-semibold mb-2">How to Update Settings</h3>
        <ol className="text-sm space-y-1" style={{ color:'var(--color-text-sub)' }}>
          <li>1. Open your GitHub repo → navigate to <code className="bg-gray-100 px-1 rounded">src/data/siteConfig.js</code></li>
          <li>2. Click the pencil (edit) icon</li>
          <li>3. Change any value you need</li>
          <li>4. Click "Commit changes" at the bottom</li>
          <li>5. Cloudflare Pages will auto-deploy in ~90 seconds — done.</li>
        </ol>
      </div>

      <div className="card p-5 mt-4">
        <h3 className="font-semibold mb-3">Supabase Environment Variables</h3>
        <p className="text-sm text-gray-500 mb-3">
          Secret keys are stored in Cloudflare Pages environment variables — never in your code.
          To update: Cloudflare Dashboard → Pages → Your project → Settings → Environment Variables.
        </p>
        <div className="space-y-2">
          {['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','VITE_RAZORPAY_KEY_ID','VITE_STRIPE_PUBLIC_KEY','VITE_ADMIN_EMAIL','VITE_CONTACT_EMAIL'].map(k => (
            <div key={k} className="flex items-center gap-3">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{k}</code>
              <span className="text-xs text-gray-400">Set in Cloudflare env vars</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
